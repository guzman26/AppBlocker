import { NativeModules, NativeEventEmitter } from 'react-native';

type BlockSchedule = {
  identifier: string;
  startDate: string;
  endDate: string;
  repeatsDaily: boolean;
  /**
   * ISO weekday number expected by iOS DateComponents (1 = Sunday ... 7 = Saturday).
   * When present the block will only run on the specified weekday.
   */
  weekday?: number;
};

type SelectedApplication = {
  bundleIdentifier: string;
  displayName: string;
  category: string;
};

type EventPayload = {
  event: 'activitySummary' | 'activityAlert';
  message: string;
};

export interface ScreenTimeModule {
  requestAuthorization(): Promise<boolean>;
  openFamilyActivityPicker(): Promise<SelectedApplication[]>;
  saveSelectedApplications(apps: SelectedApplication[]): Promise<void>;
  loadSelectedApplications(): Promise<SelectedApplication[]>;
  scheduleBlocks(schedules: BlockSchedule[]): Promise<void>;
  fetchActiveBlocks(): Promise<BlockSchedule[]>;
  removeAllBlocks(): Promise<void>;
}

const { ScreenTimeManager } = NativeModules;

if (!ScreenTimeManager) {
  throw new Error('ScreenTimeManager native module not found. Ensure iOS native module is correctly linked.');
}

export const screenTimeManager: ScreenTimeModule = ScreenTimeManager;

export const screenTimeEvents = new NativeEventEmitter(ScreenTimeManager);

export type { BlockSchedule, SelectedApplication, EventPayload };
