import Foundation
import FamilyControls
import DeviceActivity
import ManagedSettings
import UIKit
import React

@objc(ScreenTimeManager)
class ScreenTimeManager: RCTEventEmitter {
  
  private let store = ManagedSettingsStore()
  private let activityCenter = DeviceActivityCenter()
  private let authCenter = AuthorizationCenter.shared
  
  private static let SELECTED_APPS_KEY = "screentime.selectedApps"
  private static let BLOCKED_WEBSITES_KEY = "screentime.blockedWebsites"
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return ["ScreenTimeEvent"]
  }
  
  // MARK: - Authorization
  
  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do {
        try await authCenter.requestAuthorization(for: .individual)
        let status = authCenter.authorizationStatus
        resolve(status == .approved)
      } catch {
        resolve(false)
      }
    }
  }
  
  // MARK: - App Selection
  
  @objc
  func openFamilyActivityPicker(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      resolve([])
    }
  }
  
  private func handleFamilyActivitySelection(_ selection: FamilyActivitySelection, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let rootVC = self.getRootViewController()?.presentedViewController {
        rootVC.dismiss(animated: true) {
          let apps = self.convertSelectionToApps(selection)
          resolve(apps)
        }
      }
    }
  }
  
  private func convertSelectionToApps(_ selection: FamilyActivitySelection) -> [[String: String]] {
    var apps: [[String: String]] = []
    
    for token in selection.applicationTokens {
      apps.append([
        "bundleIdentifier": "app.token.\(token.hashValue)",
        "displayName": "App \(apps.count + 1)",
        "category": "Productivity"
      ])
    }
    
    return apps
  }
  
  private func getAppName(for bundleId: String) -> String {
    let components = bundleId.split(separator: ".")
    if let last = components.last {
      return String(last).capitalized
    }
    return bundleId
  }
  
  @objc
  func saveSelectedApplications(_ apps: [[String: String]], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if let data = try? JSONSerialization.data(withJSONObject: apps) {
      UserDefaults.standard.set(data, forKey: Self.SELECTED_APPS_KEY)
      resolve(nil)
    } else {
      reject("SAVE_ERROR", "No se pudieron guardar las aplicaciones", nil)
    }
  }
  
  @objc
  func loadSelectedApplications(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let data = UserDefaults.standard.data(forKey: Self.SELECTED_APPS_KEY),
          let apps = try? JSONSerialization.jsonObject(with: data) as? [[String: String]] else {
      resolve([])
      return
    }
    resolve(apps)
  }
  
  // MARK: - Blocking Schedules
  
  @objc
  func scheduleBlocks(_ schedules: [[String: Any]], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        for scheduleDict in schedules {
          guard let identifier = scheduleDict["identifier"] as? String,
                let startDateStr = scheduleDict["startDate"] as? String,
                let endDateStr = scheduleDict["endDate"] as? String,
                let repeatsDaily = scheduleDict["repeatsDaily"] as? Bool else {
            continue
          }
          
          let weekday = scheduleDict["weekday"] as? Int
          
          try await self.createDeviceActivitySchedule(
            identifier: identifier,
            startDateISO: startDateStr,
            endDateISO: endDateStr,
            repeatsDaily: repeatsDaily,
            weekday: weekday
          )
        }
        
        await self.applyBlockingRestrictions()
        resolve(nil)
      } catch {
        reject("SCHEDULE_ERROR", error.localizedDescription, error)
      }
    }
  }
  
  private func createDeviceActivitySchedule(
    identifier: String,
    startDateISO: String,
    endDateISO: String,
    repeatsDaily: Bool,
    weekday: Int?
  ) async throws {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    
    guard let startDate = formatter.date(from: startDateISO),
          let endDate = formatter.date(from: endDateISO) else {
      throw NSError(domain: "ScreenTimeManager", code: 1, userInfo: [NSLocalizedDescriptionKey: "Formato de fecha inválido"])
    }
    
    let calendar = Calendar.current
    let startComponents = calendar.dateComponents([.hour, .minute, .second], from: startDate)
    let endComponents = calendar.dateComponents([.hour, .minute, .second], from: endDate)
    
    var schedule: DeviceActivitySchedule
    
    if repeatsDaily {
      var intervalStart = DateComponents()
      intervalStart.hour = startComponents.hour
      intervalStart.minute = startComponents.minute
      intervalStart.second = startComponents.second
      
      if let weekday = weekday {
        intervalStart.weekday = weekday
      }
      
      var intervalEnd = DateComponents()
      intervalEnd.hour = endComponents.hour
      intervalEnd.minute = endComponents.minute
      intervalEnd.second = endComponents.second
      
      if let weekday = weekday {
        intervalEnd.weekday = weekday
      }
      
      schedule = DeviceActivitySchedule(
        intervalStart: intervalStart,
        intervalEnd: intervalEnd,
        repeats: true
      )
    } else {
      schedule = DeviceActivitySchedule(
        intervalStart: DateComponents(
          calendar: calendar,
          hour: startComponents.hour,
          minute: startComponents.minute
        ),
        intervalEnd: DateComponents(
          calendar: calendar,
          hour: endComponents.hour,
          minute: endComponents.minute
        ),
        repeats: false
      )
    }
    
    let activityName = DeviceActivityName(identifier)
    
    do {
      try activityCenter.startMonitoring(activityName, during: schedule)
    } catch {
      print("Error al programar actividad \(identifier): \(error)")
    }
  }
  
  private func applyBlockingRestrictions() async {
    guard let data = UserDefaults.standard.data(forKey: Self.SELECTED_APPS_KEY),
          let apps = try? JSONSerialization.jsonObject(with: data) as? [[String: String]] else {
      return
    }
    
    let bundleIds = apps.compactMap { $0["bundleIdentifier"] }
    
      await MainActor.run {
      self.applyWebsiteBlocking()
    }
  }
  
  private func applyWebsiteBlocking() {
    // Website blocking not fully implemented in this version
  }
  
  @objc
  func fetchActiveBlocks(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let schedules: [[String: Any]] = []
    resolve(schedules)
  }
  
  private func formatDateComponents(_ components: DateComponents) -> String {
    let calendar = Calendar.current
    let date = calendar.date(from: components) ?? Date()
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.string(from: date)
  }
  
  @objc
  func removeAllBlocks(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    store.shield.applications = nil
    store.shield.applicationCategories = nil
    
    resolve(nil)
  }
  
  // MARK: - Website Blocking
  
  @objc
  func saveBlockedWebsites(_ websites: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if let data = try? JSONSerialization.data(withJSONObject: websites) {
      UserDefaults.standard.set(data, forKey: Self.BLOCKED_WEBSITES_KEY)
      
      Task {
        await self.applyBlockingRestrictions()
        resolve(nil)
      }
    } else {
      reject("SAVE_ERROR", "No se pudieron guardar los sitios web", nil)
    }
  }
  
  @objc
  func loadBlockedWebsites(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let data = UserDefaults.standard.data(forKey: Self.BLOCKED_WEBSITES_KEY),
          let websites = try? JSONSerialization.jsonObject(with: data) as? [String] else {
      resolve([])
      return
    }
    resolve(websites)
  }
  
  // MARK: - Usage Monitoring
  
  @objc
  func fetchUsageData(_ startDateISO: String, endDateISO: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    
    guard let startDate = formatter.date(from: startDateISO),
          let endDate = formatter.date(from: endDateISO) else {
      reject("INVALID_DATE", "Formato de fecha inválido", nil)
      return
    }
    
    let usageData: [String: Any] = [
      "totalBlockedTime": 0,
      "blockedApps": [],
      "interventions": 0,
      "intentionsFulfilled": 0
    ]
    
    resolve(usageData)
  }
  
  // MARK: - Focus Mode Integration
  
  @objc
  func getFocusModes(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let focusModes: [[String: String]] = [
      ["id": "work", "name": "Trabajo"],
      ["id": "personal", "name": "Personal"],
      ["id": "sleep", "name": "Dormir"]
    ]
    
    resolve(focusModes)
  }
  
  @objc
  func syncWithFocusMode(_ focusModeId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve(nil)
  }
  
  // MARK: - Helpers
  
  private func getRootViewController() -> UIViewController? {
    guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
          let window = windowScene.windows.first(where: { $0.isKeyWindow }),
          let rootVC = window.rootViewController else {
      return nil
    }
    
    var currentVC = rootVC
    while let presented = currentVC.presentedViewController {
      currentVC = presented
    }
    
    return currentVC
  }
  
  // MARK: - Event Emission
  
  func emitEvent(_ eventName: String, body: [String: Any]) {
    sendEvent(withName: "ScreenTimeEvent", body: body)
  }
}
