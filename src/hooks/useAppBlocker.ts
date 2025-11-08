import { useState, useEffect, useCallback } from 'react';
import ScreenTimeManager from '../native/ScreenTimeManager';
import type { SelectionPayload } from '../native/ScreenTimeManager';

interface UseAppBlockerReturn {
  isAuthorized: boolean;
  blockedApps: string[];
  isBlocking: boolean;
  isBlockingActive: boolean;
  requestAuthorization: () => Promise<boolean>;
  selectApps: () => Promise<boolean>;
  toggleBlocking: (active: boolean) => Promise<boolean>;
  refreshBlockedApps: () => Promise<void>;
  hasSelection: boolean;
}

export const useAppBlocker = (): UseAppBlockerReturn => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isBlockingActive, setIsBlockingActive] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

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
      const selection = await ScreenTimeManager.getBlockedApps();
      setBlockedApps(selection.applications);
      const hasContent = selectionHasContent(selection);
      setHasSelection(hasContent);
      setIsBlockingActive(hasContent);
    } catch (error) {
      console.error('Error refreshing blocked apps:', error);
    }
  }, []);

  // Select apps using Family Activity Picker (doesn't block immediately)
  const selectApps = useCallback(async (): Promise<boolean> => {
    if (!isAuthorized) {
      const authorized = await requestAuthorization();
      if (!authorized) {
        return false;
      }
    }

    setIsBlocking(true);
    try {
      // Open the native picker
      const selection = await ScreenTimeManager.openFamilyActivityPicker();
      const selectionChosen = selectionHasContent(selection);

      if (selectionChosen) {
        setBlockedApps(selection.applications);
        setHasSelection(true);
        
        // If blocking was already active, apply the new selection immediately
        if (isBlockingActive) {
          await ScreenTimeManager.blockSelectedApps();
          await refreshBlockedApps();
        }
      }

      return selectionChosen;
    } catch (error) {
      console.error('Error selecting apps:', error);
      return false;
    } finally {
      setIsBlocking(false);
    }
  }, [isAuthorized, isBlockingActive, requestAuthorization, refreshBlockedApps]);

  // Toggle blocking on/off
  const toggleBlocking = useCallback(
    async (active: boolean): Promise<boolean> => {
      if (!hasSelection) {
        console.warn('No apps selected to block');
        return false;
      }

      setIsBlocking(true);
      try {
        if (active) {
          const success = await ScreenTimeManager.blockSelectedApps();
          if (success) {
            setIsBlockingActive(true);
            await refreshBlockedApps();
          }
          return success;
        } else {
          const success = await ScreenTimeManager.unblockApps();
          if (success) {
            setIsBlockingActive(false);
            await refreshBlockedApps();
          }
          return success;
        }
      } catch (error) {
        console.error('Error toggling blocking:', error);
        return false;
      } finally {
        setIsBlocking(false);
      }
    },
    [hasSelection, refreshBlockedApps]
  );

  // Initialize - check authorization and load blocked apps
  useEffect(() => {
    const initialize = async () => {
      const authorized = await ScreenTimeManager.checkAuthorizationStatus();
      setIsAuthorized(authorized);
      await refreshBlockedApps();
    };

    initialize();

    // Listen to Screen Time events
    const subscription = ScreenTimeManager.addListener((event) => {
      console.log('Screen Time event:', event);
      refreshBlockedApps();
    });

    return () => {
      subscription.remove();
    };
  }, [refreshBlockedApps]);

  return {
    isAuthorized,
    blockedApps,
    isBlocking,
    isBlockingActive,
    requestAuthorization,
    selectApps,
    toggleBlocking,
    refreshBlockedApps,
    hasSelection,
  };
};

const selectionHasContent = (selection: SelectionPayload): boolean => {
  return (
    selection.applications.length > 0 ||
    selection.categories.length > 0 ||
    selection.webDomains.length > 0
  );
};
