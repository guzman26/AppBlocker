import Foundation
import FamilyControls
import DeviceActivity
import ManagedSettings
import React

@objc(ScreenTimeManager)
class ScreenTimeManager: RCTEventEmitter {
  private let authorizationCenter = AuthorizationCenter.shared
  private let store = ManagedSettingsStore()
  private let deviceActivityCenter = DeviceActivityCenter()
  private let userDefaults = UserDefaults.standard

  private var shieldedApplications: FamilyActivitySelection = .init()
  private var hasListeners = false

  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  override func supportedEvents() -> [String]! {
    ["ScreenTimeEvent"]
  }

  private func emit(event: String, message: String) {
    guard hasListeners else { return }
    sendEvent(withName: "ScreenTimeEvent", body: [
      "event": event,
      "message": message,
    ])
  }

  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do {
        try await authorizationCenter.requestAuthorization(for: .individual)
        resolve(true)
        emit(event: "activitySummary", message: "Autorización concedida")
      } catch {
        resolve(false)
        emit(event: "activityAlert", message: "No se pudo obtener la autorización")
      }
    }
  }

  @objc
  func openFamilyActivityPicker(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let picker = FamilyActivityPickerViewController(initialSelection: self.shieldedApplications)
      picker.delegate = self

      guard let root = RCTPresentedViewController() else {
        reject("no_root", "No root view controller available", nil)
        return
      }

      root.present(picker, animated: true)
      self.currentPickerResolver = resolve
      self.currentPickerRejecter = reject
    }
  }

  private var currentPickerResolver: RCTPromiseResolveBlock?
  private var currentPickerRejecter: RCTPromiseRejectBlock?

  @objc
  func saveSelectedApplications(_ apps: [[String: Any]], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    shieldedApplications = FamilyActivitySelection()

    let applicationTokens = apps.compactMap { $0["bundleIdentifier"] as? String }
    shieldedApplications.applicationTokens = Set(applicationTokens.compactMap { ApplicationToken(bundleIdentifier: $0) })

    do {
      let data = try JSONSerialization.data(withJSONObject: apps, options: [])
      userDefaults.set(data, forKey: "selectedApps")
      resolve(nil)
    } catch {
      reject("persist_error", "Failed to persist selection", error)
    }
  }

  @objc
  func loadSelectedApplications(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let data = userDefaults.data(forKey: "selectedApps") else {
      resolve([])
      return
    }

    do {
      let json = try JSONSerialization.jsonObject(with: data, options: [])
      if let apps = json as? [[String: Any]] {
        let tokens = apps.compactMap { $0["bundleIdentifier"] as? String }
        shieldedApplications.applicationTokens = Set(tokens.compactMap { ApplicationToken(bundleIdentifier: $0) })
      }
      resolve(json)
    } catch {
      reject("decode_error", "Failed to decode selection", error)
    }
  }

  @objc
  func scheduleBlocks(_ schedules: [[String: Any]], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do {
        try await deviceActivityCenter.stopMonitoring()

        for schedule in schedules {
          guard
            let identifier = schedule["identifier"] as? String,
            let startDateString = schedule["startDate"] as? String,
            let endDateString = schedule["endDate"] as? String,
            let repeatsDaily = schedule["repeatsDaily"] as? Bool,
            let startDate = ISO8601DateFormatter().date(from: startDateString),
            let endDate = ISO8601DateFormatter().date(from: endDateString)
          else {
            continue
          }

          var components = DateComponents()
          components.calendar = Calendar.current
          components.hour = Calendar.current.component(.hour, from: startDate)
          components.minute = Calendar.current.component(.minute, from: startDate)

          var endComponents = DateComponents()
          endComponents.calendar = Calendar.current
          endComponents.hour = Calendar.current.component(.hour, from: endDate)
          endComponents.minute = Calendar.current.component(.minute, from: endDate)

          let scheduleEvents = DeviceActivitySchedule(
            intervalStart: components,
            intervalEnd: endComponents,
            repeats: repeatsDaily
          )

          try deviceActivityCenter.startMonitoring(.init(identifier), during: scheduleEvents)
        }

        applyShieldRestrictions()
        let data = try JSONSerialization.data(withJSONObject: schedules, options: [])
        userDefaults.set(data, forKey: "activeSchedules")
        emit(event: "activitySummary", message: "Restricciones activas")
        resolve(nil)
      } catch {
        reject("schedule_error", "Failed to schedule blocks", error)
      }
    }
  }

  @objc
  func fetchActiveBlocks(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // DeviceActivityCenter does not currently expose active schedules directly.
    // We persist the last request in UserDefaults for the JS layer to hydrate the UI.
    guard let data = userDefaults.data(forKey: "activeSchedules") else {
      resolve([])
      return
    }

    do {
      let json = try JSONSerialization.jsonObject(with: data, options: [])
      resolve(json)
    } catch {
      reject("schedule_decode", "Failed to decode schedules", error)
    }
  }

  @objc
  func removeAllBlocks(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do {
        try await deviceActivityCenter.stopMonitoring()
        store.shield.applications = nil
        userDefaults.removeObject(forKey: "activeSchedules")
        resolve(nil)
        emit(event: "activitySummary", message: "Restricciones desactivadas")
      } catch {
        reject("remove_error", "Failed to remove restrictions", error)
      }
    }
  }

  private func applyShieldRestrictions() {
    store.shield.applications = shieldedApplications.applicationTokens
  }
}

extension ScreenTimeManager: FamilyActivityPickerViewControllerDelegate {
  func familyActivityPickerViewControllerDidCancel(_ controller: FamilyActivityPickerViewController) {
    currentPickerRejecter?("cancelled", "User cancelled selection", nil)
    currentPickerRejecter = nil
    currentPickerResolver = nil
    controller.dismiss(animated: true)
  }

  func familyActivityPickerViewController(_ controller: FamilyActivityPickerViewController, didFinishWith selection: FamilyActivitySelection) {
    shieldedApplications = selection

    let apps: [[String: Any]] = selection.applicationTokens.map { token in
      [
        "bundleIdentifier": token.bundleIdentifier,
        "displayName": token.localizedName,
        "category": token.localizedDisplayName,
      ]
    }

    do {
      let data = try JSONSerialization.data(withJSONObject: apps, options: [])
      userDefaults.set(data, forKey: "selectedApps")
    } catch {
      emit(event: "activityAlert", message: "No se pudo guardar la selección")
    }

    currentPickerResolver?(apps)
    currentPickerRejecter = nil
    currentPickerResolver = nil

    controller.dismiss(animated: true)
  }
}
