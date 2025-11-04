const { withDangerousMod, IOSConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to add ScreenTimeManager native module to iOS
 */
const withScreenTimeManager = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosRoot = path.join(projectRoot, 'ios', config.modRequest.projectName || 'AppBlocker');

      // Create ScreenTimeManager.swift
      const screenTimeManagerSwift = `import Foundation
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
        reject("AUTH_ERROR", "Failed to request authorization: \\(error.localizedDescription)", error)
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
`;

      // Create ScreenTimeManagerBridge.m
      const screenTimeManagerBridge = `#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ScreenTimeManager, NSObject)

RCT_EXTERN_METHOD(requestAuthorization:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(openFamilyActivityPicker:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(blockSelectedApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unblockApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBlockedApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(blockWebsite:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unblockWebsite:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBlockedWebsites:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startSession:(NSString *)name
                  startTime:(nonnull NSNumber *)startTime
                  endTime:(nonnull NSNumber *)endTime
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopSession:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isSessionActive:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
`;

      // Write the files
      const swiftPath = path.join(iosRoot, 'ScreenTimeManager.swift');
      const bridgePath = path.join(iosRoot, 'ScreenTimeManagerBridge.m');
      
      fs.writeFileSync(swiftPath, screenTimeManagerSwift);
      fs.writeFileSync(bridgePath, screenTimeManagerBridge);
      
      console.log('✅ Added ScreenTimeManager native module files');
      
      return config;
    },
  ]);
};

module.exports = withScreenTimeManager;








