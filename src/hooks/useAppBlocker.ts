import { useState, useEffect, useCallback } from 'react';
import ScreenTimeManager from '../native/ScreenTimeManager';

interface UseAppBlockerReturn {
  isAuthorized: boolean;
  blockedApps: string[];
  isBlocking: boolean;
  isSessionActive: boolean;
  requestAuthorization: () => Promise<boolean>;
  selectAndBlockApps: () => Promise<boolean>;
  unblockAllApps: () => Promise<boolean>;
  startBlockingSession: (name: string, duration: number) => Promise<boolean>;
  stopBlockingSession: () => Promise<boolean>;
  refreshBlockedApps: () => Promise<void>;
}

export const useAppBlocker = (): UseAppBlockerReturn => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Request Screen Time authorization
  const requestAuthorization = useCallback(async (): Promise<boolean> => {
    try {
      const authorized = await ScreenTimeManager.requestAuthorization();
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('Error requesting authorization:', error);
      return false;
    }
  }, []);

  // Refresh the list of blocked apps
  const refreshBlockedApps = useCallback(async () => {
    try {
      const apps = await ScreenTimeManager.getBlockedApps();
      setBlockedApps(apps);
    } catch (error) {
      console.error('Error refreshing blocked apps:', error);
    }
  }, []);

  // Check if session is active
  const checkSessionStatus = useCallback(async () => {
    try {
      const active = await ScreenTimeManager.isSessionActive();
      setIsSessionActive(active);
    } catch (error) {
      console.error('Error checking session status:', error);
    }
  }, []);

  // Select and block apps using Family Activity Picker
  const selectAndBlockApps = useCallback(async (): Promise<boolean> => {
    if (!isAuthorized) {
      const authorized = await requestAuthorization();
      if (!authorized) {
        return false;
      }
    }

    setIsBlocking(true);
    try {
      // Open the native picker
      await ScreenTimeManager.openFamilyActivityPicker();
      
      // Block the selected apps
      const success = await ScreenTimeManager.blockSelectedApps();
      
      if (success) {
        await refreshBlockedApps();
      }
      
      return success;
    } catch (error) {
      console.error('Error selecting and blocking apps:', error);
      return false;
    } finally {
      setIsBlocking(false);
    }
  }, [isAuthorized, requestAuthorization, refreshBlockedApps]);

  // Unblock all apps
  const unblockAllApps = useCallback(async (): Promise<boolean> => {
    setIsBlocking(true);
    try {
      const success = await ScreenTimeManager.unblockApps();
      if (success) {
        await refreshBlockedApps();
      }
      return success;
    } catch (error) {
      console.error('Error unblocking apps:', error);
      return false;
    } finally {
      setIsBlocking(false);
    }
  }, [refreshBlockedApps]);

  // Start a timed blocking session
  const startBlockingSession = useCallback(
    async (name: string, durationMinutes: number): Promise<boolean> => {
      if (!isAuthorized) {
        const authorized = await requestAuthorization();
        if (!authorized) {
          return false;
        }
      }

      try {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        
        const success = await ScreenTimeManager.startSession(name, startTime, endTime);
        
        if (success) {
          await checkSessionStatus();
        }
        
        return success;
      } catch (error) {
        console.error('Error starting blocking session:', error);
        return false;
      }
    },
    [isAuthorized, requestAuthorization, checkSessionStatus]
  );

  // Stop the current blocking session
  const stopBlockingSession = useCallback(async (): Promise<boolean> => {
    try {
      const success = await ScreenTimeManager.stopSession();
      if (success) {
        await checkSessionStatus();
      }
      return success;
    } catch (error) {
      console.error('Error stopping blocking session:', error);
      return false;
    }
  }, [checkSessionStatus]);

  // Initialize - check authorization and load blocked apps
  useEffect(() => {
    const initialize = async () => {
      await refreshBlockedApps();
      await checkSessionStatus();
    };

    initialize();

    // Listen to Screen Time events
    const subscription = ScreenTimeManager.addListener((event) => {
      console.log('Screen Time event:', event);
      refreshBlockedApps();
      checkSessionStatus();
    });

    return () => {
      subscription.remove();
    };
  }, [refreshBlockedApps, checkSessionStatus]);

  return {
    isAuthorized,
    blockedApps,
    isBlocking,
    isSessionActive,
    requestAuthorization,
    selectAndBlockApps,
    unblockAllApps,
    startBlockingSession,
    stopBlockingSession,
    refreshBlockedApps,
  };
};
