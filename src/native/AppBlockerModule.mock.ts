import { EventEmitter } from 'events';
import type {
  BlockSchedule,
  SelectedApplication,
  EventPayload,
  UsageData,
  FocusMode,
} from '../types';

// Mock implementation for development/testing
const mockEventEmitter = new EventEmitter();

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

// Mock Screen Time Manager for development
export const screenTimeManager: ScreenTimeModule = {
  async requestAuthorization() {
    console.log('[MOCK] requestAuthorization called');
    return true; // Always authorized in mock
  },

  async openFamilyActivityPicker() {
    console.log('[MOCK] openFamilyActivityPicker called');
    // Return some dummy apps
    return [
      { bundleIdentifier: 'com.facebook.Facebook', displayName: 'Facebook', category: 'Social' },
      { bundleIdentifier: 'com.instagram.Instagram', displayName: 'Instagram', category: 'Social' },
      { bundleIdentifier: 'com.twitter.Twitter', displayName: 'Twitter', category: 'Social' },
    ];
  },

  async saveSelectedApplications(apps: SelectedApplication[]) {
    console.log('[MOCK] saveSelectedApplications called with:', apps);
  },

  async loadSelectedApplications() {
    console.log('[MOCK] loadSelectedApplications called');
    return [];
  },

  async scheduleBlocks(schedules: BlockSchedule[]) {
    console.log('[MOCK] scheduleBlocks called with:', schedules);
  },

  async fetchActiveBlocks() {
    console.log('[MOCK] fetchActiveBlocks called');
    return [];
  },

  async removeAllBlocks() {
    console.log('[MOCK] removeAllBlocks called');
  },

  async saveBlockedWebsites(websites: string[]) {
    console.log('[MOCK] saveBlockedWebsites called with:', websites);
  },

  async loadBlockedWebsites() {
    console.log('[MOCK] loadBlockedWebsites called');
    return [];
  },

  async fetchUsageData(startDateISO: string, endDateISO: string) {
    console.log('[MOCK] fetchUsageData called');
    return {
      totalBlockedTime: 0,
      blockedApps: [],
      interventions: 0,
      intentionsFulfilled: 0,
    };
  },

  async getFocusModes() {
    console.log('[MOCK] getFocusModes called');
    return [
      { id: 'work', name: 'Trabajo' },
      { id: 'personal', name: 'Personal' },
      { id: 'sleep', name: 'Dormir' },
    ];
  },

  async syncWithFocusMode(focusModeId: string) {
    console.log('[MOCK] syncWithFocusMode called with:', focusModeId);
  },
};

export const screenTimeEvents = {
  addListener: (eventName: string, listener: (payload: EventPayload) => void) => {
    console.log('[MOCK] addListener called for:', eventName);
    mockEventEmitter.on(eventName, listener);
    return {
      remove: () => {
        mockEventEmitter.off(eventName, listener);
      },
    };
  },
};

export type { BlockSchedule, SelectedApplication, EventPayload, UsageData, FocusMode };

