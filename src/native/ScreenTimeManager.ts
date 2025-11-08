import { NativeModules, NativeEventEmitter } from 'react-native';

export interface SelectionPayload {
  applications: string[];
  categories: string[];
  webDomains: string[];
}

interface ScreenTimeManagerInterface {
  requestAuthorization(): Promise<boolean>;
  checkAuthorizationStatus(): Promise<boolean>;
  openFamilyActivityPicker(): Promise<SelectionPayload>;
  blockSelectedApps(): Promise<boolean>;
  unblockApps(): Promise<boolean>;
  getBlockedApps(): Promise<SelectionPayload>;
}

const { ScreenTimeManager } = NativeModules;

// Create event emitter for listening to native events (only if module exists)
export const screenTimeEventEmitter = ScreenTimeManager 
  ? new NativeEventEmitter(ScreenTimeManager)
  : null;

class ScreenTimeManagerWrapper {
  private manager: ScreenTimeManagerInterface | null;
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = !!ScreenTimeManager;
    if (!this.isAvailable) {
      console.warn(
        '⚠️ ScreenTimeManager native module not found. App will run with mock data only.'
      );
      this.manager = null;
      return;
    }
    this.manager = ScreenTimeManager as ScreenTimeManagerInterface;
  }

  /**
   * Request authorization to use Screen Time API
   */
  async requestAuthorization(): Promise<boolean> {
    if (!this.manager) return false;
    try {
      const authorized = await this.manager.requestAuthorization();
      return authorized;
    } catch (error) {
      console.error('Error requesting authorization:', error);
      return false;
    }
  }

  /**
   * Verify the current Screen Time authorization state
   */
  async checkAuthorizationStatus(): Promise<boolean> {
    if (!this.manager) return false;
    try {
      return await this.manager.checkAuthorizationStatus();
    } catch (error) {
      console.error('Error checking authorization status:', error);
      return false;
    }
  }

  /**
   * Open the native Family Activity Picker to select apps
   */
  async openFamilyActivityPicker(): Promise<SelectionPayload> {
    if (!this.manager) {
      return {
        applications: [],
        categories: [],
        webDomains: [],
      };
    }
    try {
      const selection = await this.manager.openFamilyActivityPicker();
      return normalizeSelection(selection);
    } catch (error) {
      console.error('Error opening family activity picker:', error);
      return {
        applications: [],
        categories: [],
        webDomains: [],
      };
    }
  }

  /**
   * Block the apps that were selected in the Family Activity Picker
   */
  async blockSelectedApps(): Promise<boolean> {
    if (!this.manager) return false;
    try {
      const result = await this.manager.blockSelectedApps();
      return result;
    } catch (error) {
      console.error('Error blocking apps:', error);
      return false;
    }
  }

  /**
   * Unblock all currently blocked apps
   */
  async unblockApps(): Promise<boolean> {
    if (!this.manager) return false;
    try {
      const result = await this.manager.unblockApps();
      return result;
    } catch (error) {
      console.error('Error unblocking apps:', error);
      return false;
    }
  }

  /**
   * Get list of currently blocked apps
   */
  async getBlockedApps(): Promise<SelectionPayload> {
    if (!this.manager) {
      return { applications: [], categories: [], webDomains: [] };
    }
    try {
      const apps = await this.manager.getBlockedApps();
      return normalizeSelection(apps);
    } catch (error) {
      console.error('Error getting blocked apps:', error);
      return { applications: [], categories: [], webDomains: [] };
    }
  }

  /**
   * Listen to Screen Time events
   */
  addListener(callback: (event: any) => void) {
    if (!screenTimeEventEmitter) {
      return { remove: () => {} };
    }
    return screenTimeEventEmitter.addListener('ScreenTimeEvent', callback);
  }
}

export default new ScreenTimeManagerWrapper();

const normalizeSelection = (selection: SelectionPayload | undefined): SelectionPayload => {
  if (!selection) {
    return { applications: [], categories: [], webDomains: [] };
  }

  const { applications, categories, webDomains } = selection;
  return {
    applications: Array.isArray(applications) ? applications : [],
    categories: Array.isArray(categories) ? categories : [],
    webDomains: Array.isArray(webDomains) ? webDomains : [],
  };
};
