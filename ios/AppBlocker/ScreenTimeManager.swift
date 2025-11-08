import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity
import SwiftUI
import UIKit

@available(iOS 16.0, *)
final class FamilyActivitySelectionStore: ObservableObject {
  @Published var selection: FamilyActivitySelection

  init(selection: FamilyActivitySelection = FamilyActivitySelection()) {
    self.selection = selection
  }
}

@available(iOS 16.0, *)
struct FamilyActivityPickerContainer: View {
  @ObservedObject var store: FamilyActivitySelectionStore

  var body: some View {
    FamilyActivityPicker(selection: $store.selection)
      .navigationTitle("Selecciona apps")
      .navigationBarTitleDisplayMode(.inline)
  }
}

@available(iOS 16.0, *)
final class FamilyActivityPickerHostingController: UIHostingController<FamilyActivityPickerContainer> {
  let selectionStore: FamilyActivitySelectionStore
  var onComplete: ((FamilyActivitySelection) -> Void)?
  var onCancel: (() -> Void)?

  init(store: FamilyActivitySelectionStore) {
    self.selectionStore = store
    super.init(rootView: FamilyActivityPickerContainer(store: store))
    title = "Selecciona apps"
  }

  @MainActor @objc required dynamic init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    navigationItem.rightBarButtonItem = UIBarButtonItem(
      barButtonSystemItem: .done,
      target: self,
      action: #selector(handleDone)
    )
    navigationItem.leftBarButtonItem = UIBarButtonItem(
      barButtonSystemItem: .cancel,
      target: self,
      action: #selector(handleCancel)
    )
  }

  @objc private func handleDone() {
    onComplete?(selectionStore.selection)
  }

  @objc private func handleCancel() {
    onCancel?()
  }
}

@available(iOS 16.0, *)
@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject {

  private let store = ManagedSettingsStore()
  private let authorizationCenter = AuthorizationCenter.shared
  private let activityCenter = DeviceActivityCenter()

  private var lastSelection = FamilyActivitySelection()
  private var manualSelection = FamilyActivitySelection()
  private var activeSessionSelection: FamilyActivitySelection?
  private var activeScheduleName: DeviceActivityName?
  private var sessionEndDate: Date?

  // MARK: - Authorization

  @objc
  func requestAuthorization(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        try await authorizationCenter.requestAuthorization(for: .individual)
        resolve(true)
      } catch {
        reject("AUTH_ERROR", "Failed to request authorization: \(error.localizedDescription)", error)
      }
    }
  }

  @objc
  func checkAuthorizationStatus(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let status = authorizationCenter.authorizationStatus
    resolve(status == .approved)
  }

  // MARK: - Activity Picker

  @objc
  func openFamilyActivityPicker(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard let presenter = self.topViewController() else {
        reject("NO_ROOT_VIEW", "Unable to find root view controller to present FamilyActivityPicker", nil)
        return
      }

      let selectionStore = FamilyActivitySelectionStore(selection: self.lastSelection)
      let pickerController = FamilyActivityPickerHostingController(store: selectionStore)
      let navigationController = UINavigationController(rootViewController: pickerController)
      navigationController.modalPresentationStyle = .formSheet

      pickerController.onComplete = { selection in
        navigationController.dismiss(animated: true) {
          self.lastSelection = selection
          self.resolveSelection(selection, resolver: resolve)
        }
      }

      pickerController.onCancel = {
        navigationController.dismiss(animated: true) {
          self.resolveSelection(self.lastSelection, resolver: resolve)
        }
      }

      presenter.present(navigationController, animated: true)
    }
  }

  // MARK: - Blocking Controls

  @objc
  func blockSelectedApps(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard hasContent(in: lastSelection) else {
      resolve(false)
      return
    }

    manualSelection = lastSelection
    apply(selection: manualSelection)
    resolve(true)
  }

  @objc
  func unblockApps(
    _ resolve: RCTPromiseResolveBlock,
    rejecter _: RCTPromiseRejectBlock
  ) {
    manualSelection = FamilyActivitySelection()
    clearAllShields()
    resolve(true)
  }

  @objc
  func getBlockedApps(
    _ resolve: RCTPromiseResolveBlock,
    rejecter _: RCTPromiseRejectBlock
  ) {
    let appTokens = store.shield.applications ?? []
    let categoryTokens = store.shield.applicationCategories ?? []
    let webTokens = store.shield.webDomains ?? []

    let payload: [String: Any] = [
      "applications": appTokens.map { $0.rawValue.base64EncodedString() },
      "categories": categoryTokens.map { $0.rawValue.base64EncodedString() },
      "webDomains": webTokens.map { $0.rawValue.base64EncodedString() },
    ]

    resolve(payload)
  }

  @objc
  func blockWebsite(
    _ url: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    reject("UNSUPPORTED", "Direct website shielding is not supported without FamilyActivityPicker selection", nil)
  }

  @objc
  func unblockWebsite(
    _ url: String,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter _: RCTPromiseRejectBlock
  ) {
    resolve(false)
  }

  @objc
  func getBlockedWebsites(
    _ resolve: RCTPromiseResolveBlock,
    rejecter _: RCTPromiseRejectBlock
  ) {
    let tokens = store.shield.webDomains ?? []
    let encoded = tokens.map { $0.rawValue.base64EncodedString() }
    resolve(encoded)
  }

  // MARK: - Timed Sessions

  @objc
  func startSession(
    _ name: String,
    startTime: NSNumber,
    endTime: NSNumber,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    guard hasContent(in: lastSelection) else {
      reject("NO_SELECTION", "Select apps to block before starting a session.", nil)
      return
    }

    let startDate = Date(timeIntervalSince1970: startTime.doubleValue / 1000.0)
    let endDate = Date(timeIntervalSince1970: endTime.doubleValue / 1000.0)

    guard endDate > startDate else {
      reject("INVALID_RANGE", "End time must be later than start time", nil)
      return
    }

    do {
      try restartMonitoringSchedule(named: name, start: startDate, end: endDate)
      activeSessionSelection = lastSelection
      apply(selection: lastSelection)
      sessionEndDate = endDate
      resolve(true)
    } catch {
      reject("SESSION_ERROR", "Failed to start monitoring session: \(error.localizedDescription)", error)
    }
  }

  @objc
  func stopSession(
    _ resolve: RCTPromiseResolveBlock,
    rejecter _: RCTPromiseRejectBlock
  ) {
    finishActiveSession()
    resolve(true)
  }

  @objc
  func isSessionActive(
    _ resolve: RCTPromiseResolveBlock,
    rejecter _: RCTPromiseRejectBlock
  ) {
    updateSessionExpirationState()
    resolve(activeSessionSelection != nil)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    true
  }

  // MARK: - Helpers

  private func resolveSelection(
    _ selection: FamilyActivitySelection,
    resolver: RCTPromiseResolveBlock
  ) {
    let payload: [String: Any] = [
      "applications": selection.applicationTokens.map { $0.rawValue.base64EncodedString() },
      "categories": selection.categoryTokens.map { $0.rawValue.base64EncodedString() },
      "webDomains": selection.webDomainTokens.map { $0.rawValue.base64EncodedString() }
    ]
    resolver(payload)
  }

  private func apply(selection: FamilyActivitySelection) {
    if selection.applicationTokens.isEmpty {
      store.shield.applications = nil
    } else {
      store.shield.applications = selection.applicationTokens
    }

    if selection.categoryTokens.isEmpty {
      store.shield.applicationCategories = nil
    } else {
      store.shield.applicationCategories = selection.categoryTokens
    }

    if selection.webDomainTokens.isEmpty {
      store.shield.webDomains = nil
    } else {
      store.shield.webDomains = selection.webDomainTokens
    }
  }

  private func clearAllShields() {
    store.shield.applications = nil
    store.shield.applicationCategories = nil
    store.shield.webDomains = nil
  }

  private func restartMonitoringSchedule(
    named name: String,
    start: Date,
    end: Date
  ) throws {
    if let currentName = activeScheduleName {
      try? activityCenter.stopMonitoring(currentName)
    }

    let calendar = Calendar.current
    var intervalStart = calendar.dateComponents([.hour, .minute], from: start)
    var intervalEnd = calendar.dateComponents([.hour, .minute], from: end)

    intervalStart.timeZone = TimeZone.current
    intervalEnd.timeZone = TimeZone.current

    let schedule = DeviceActivitySchedule(
      intervalStart: intervalStart,
      intervalEnd: intervalEnd,
      repeats: false,
      warningTime: nil
    )

    let scheduleName = DeviceActivityName(name)
    try activityCenter.startMonitoring(scheduleName, during: schedule)
    activeScheduleName = scheduleName
  }

  private func finishActiveSession() {
    if let currentName = activeScheduleName {
      try? activityCenter.stopMonitoring(currentName)
      activeScheduleName = nil
    }

    activeSessionSelection = nil
    sessionEndDate = nil

    if hasContent(in: manualSelection) {
      apply(selection: manualSelection)
    } else {
      clearAllShields()
    }
  }

  private func updateSessionExpirationState() {
    guard let endDate = sessionEndDate else {
      return
    }

    if Date() >= endDate {
      finishActiveSession()
    }
  }

  private func hasContent(in selection: FamilyActivitySelection) -> Bool {
    !(selection.applicationTokens.isEmpty && selection.categoryTokens.isEmpty && selection.webDomainTokens.isEmpty)
  }

  private func topViewController(base: UIViewController? = nil) -> UIViewController? {
    let baseController: UIViewController?

    if let provided = base {
      baseController = provided
    } else {
      baseController = UIApplication.shared.connectedScenes
        .compactMap { $0 as? UIWindowScene }
        .flatMap { $0.windows }
        .first { $0.isKeyWindow }?
        .rootViewController
    }

    guard let controller = baseController else {
      return nil
    }

    if let nav = controller as? UINavigationController {
      return topViewController(base: nav.visibleViewController)
    }

    if let tab = controller as? UITabBarController {
      return topViewController(base: tab.selectedViewController)
    }

    if let presented = controller.presentedViewController {
      return topViewController(base: presented)
    }

    return controller
  }
}

