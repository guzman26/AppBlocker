import { NativeModules, NativeEventEmitter } from 'react-native';
import type {
  BlockSchedule,
  SelectedApplication,
  EventPayload,
  UsageData,
  FocusMode,
} from '../types';

export interface ScreenTimeModule {
  requestAuthorization(): Promise<boolean>;
  openFamilyActivityPicker(): Promise<SelectedApplication[]>;
  saveSelectedApplications(apps: SelectedApplication[]): Promise<void>;
  loadSelectedApplications(): Promise<SelectedApplication[]>;
  scheduleBlocks(schedules: BlockSchedule[]): Promise<void>;
  fetchActiveBlocks(): Promise<BlockSchedule[]>;
  removeAllBlocks(): Promise<void>;
  saveBlockedWebsites(websites: string[]): Promise<void>;
  loadBlockedWebsites(): Promise<string[]>;
  fetchUsageData(startDateISO: string, endDateISO: string): Promise<UsageData>;
  getFocusModes(): Promise<FocusMode[]>;
  syncWithFocusMode(focusModeId: string): Promise<void>;
}

const { ScreenTimeManager } = NativeModules;

if (!ScreenTimeManager) {
  throw new Error('ScreenTimeManager native module not found. Ensure iOS native module is correctly linked.');
}

export const screenTimeManager: ScreenTimeModule = ScreenTimeManager;

export const screenTimeEvents = new NativeEventEmitter(ScreenTimeManager);

export type { BlockSchedule, SelectedApplication, EventPayload, UsageData, FocusMode };
