import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject {
  
  private let store = ManagedSettingsStore()
  private let center = AuthorizationCenter.shared
  
  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        try await center.requestAuthorization(for: .individual)
        resolve(true)
      } catch {
        reject("AUTH_ERROR", "Failed to request authorization: \(error.localizedDescription)", error)
      }
    }
  }
  
  @objc
  func openFamilyActivityPicker(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Note: Family Activity Picker requires SwiftUI and needs to be presented from a view controller
    // For now, return empty array. Implementation requires bridging to SwiftUI.
    resolve([])
  }
  
  @objc
  func blockSelectedApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Implementation will depend on selected apps from picker
    resolve(false)
  }
  
  @objc
  func unblockApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    store.clearAllSettings()
    resolve(true)
  }
  
  @objc
  func getBlockedApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve([])
  }
  
  @objc
  func blockWebsite(_ url: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(false)
  }
  
  @objc
  func unblockWebsite(_ url: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(false)
  }
  
  @objc
  func getBlockedWebsites(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve([])
  }
  
  @objc
  func startSession(_ name: String, startTime: NSNumber, endTime: NSNumber, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(false)
  }
  
  @objc
  func stopSession(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(false)
  }
  
  @objc
  func isSessionActive(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(false)
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
