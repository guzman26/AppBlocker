import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import ScreenTimeManager from '../native/ScreenTimeManager';
import type { SelectionPayload } from '../native/ScreenTimeManager';
import FocusGuardianService from '../services/FocusGuardianService';

export interface GuardianStatus {
  isEnabled: boolean;
  warningCount: number;
  lastWarningAt: Date | null;
  remindersScheduled: boolean;
  reminderIntervalMinutes: number;
  permissionGranted: boolean;
}

const GUARDIAN_REMINDER_MINUTES = 5;

interface UseAppBlockerReturn {
  isAuthorized: boolean;
  blockedApps: string[];
  isBlocking: boolean;
  isSessionActive: boolean;
  requestAuthorization: () => Promise<boolean>;
  selectAndBlockApps: () => Promise<boolean | null>;
  unblockAllApps: () => Promise<boolean>;
  startBlockingSession: (name: string, duration: number) => Promise<boolean>;
  stopBlockingSession: () => Promise<boolean>;
  refreshBlockedApps: () => Promise<void>;
  guardianStatus: GuardianStatus;
  setGuardianEnabled: (enabled: boolean) => Promise<boolean>;
  hasSelection: boolean;
}

export const useAppBlocker = (): UseAppBlockerReturn => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [guardianStatus, setGuardianStatus] = useState<GuardianStatus>({
    isEnabled: false,
    warningCount: 0,
    lastWarningAt: null,
    remindersScheduled: false,
    reminderIntervalMinutes: GUARDIAN_REMINDER_MINUTES,
    permissionGranted: false,
  });

  const guardianStatusRef = useRef(guardianStatus);
  const isSessionActiveRef = useRef(isSessionActive);
  const activeSessionNameRef = useRef<string | null>(null);

  useEffect(() => {
    guardianStatusRef.current = guardianStatus;
  }, [guardianStatus]);

  useEffect(() => {
    isSessionActiveRef.current = isSessionActive;
  }, [isSessionActive]);

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
      setHasSelection(selectionHasContent(selection));
    } catch (error) {
      console.error('Error refreshing blocked apps:', error);
    }
  }, []);

  // Check if session is active
  const checkSessionStatus = useCallback(async () => {
    try {
      const active = await ScreenTimeManager.isSessionActive();
      setIsSessionActive(active);
      if (!active) {
        activeSessionNameRef.current = null;
      }
    } catch (error) {
      console.error('Error checking session status:', error);
    }
  }, []);

  // Select and block apps using Family Activity Picker
  const selectAndBlockApps = useCallback(async (): Promise<boolean | null> => {
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

      if (!selectionChosen) {
        setIsBlocking(false);
        setHasSelection(false);
        return null;
      }

      // Block the selected apps
      const success = await ScreenTimeManager.blockSelectedApps();

      if (success) {
        setBlockedApps(selection.applications);
        setHasSelection(true);
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
        setHasSelection(false);
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

        activeSessionNameRef.current = name;
        const success = await ScreenTimeManager.startSession(name, startTime, endTime);

        if (success) {
          await checkSessionStatus();
          await refreshBlockedApps();
          setHasSelection(true);
          setGuardianStatus((prev) => ({
            ...prev,
            warningCount: 0,
            lastWarningAt: null,
          }));
          if (guardianStatusRef.current.isEnabled) {
            const scheduled = await FocusGuardianService.scheduleReturnReminderAsync(
              guardianStatusRef.current.reminderIntervalMinutes,
              name
            );
            if (scheduled && !guardianStatusRef.current.remindersScheduled) {
              setGuardianStatus((prev) => ({
                ...prev,
                remindersScheduled: true,
              }));
            }
          }
        }

        return success;
      } catch (error) {
        console.error('Error starting blocking session:', error);
        return false;
      }
    },
    [isAuthorized, requestAuthorization, checkSessionStatus, refreshBlockedApps]
  );

  // Stop the current blocking session
  const stopBlockingSession = useCallback(async (): Promise<boolean> => {
    try {
      const success = await ScreenTimeManager.stopSession();
      if (success) {
        await checkSessionStatus();
        await refreshBlockedApps();
        activeSessionNameRef.current = null;
        await FocusGuardianService.cancelScheduledRemindersAsync();
        if (guardianStatusRef.current.remindersScheduled) {
          setGuardianStatus((prev) => ({
            ...prev,
            remindersScheduled: false,
          }));
        }
      }
      return success;
    } catch (error) {
      console.error('Error stopping blocking session:', error);
      return false;
    }
  }, [checkSessionStatus, refreshBlockedApps]);

  const setGuardianEnabled = useCallback(
    async (enabled: boolean): Promise<boolean> => {
      if (enabled) {
        const granted = await FocusGuardianService.ensurePermissionsAsync();
        if (!granted) {
          setGuardianStatus((prev) => ({
            ...prev,
            isEnabled: false,
            permissionGranted: false,
          }));
          return false;
        }

        setGuardianStatus((prev) => ({
          ...prev,
          isEnabled: true,
          permissionGranted: true,
        }));

        if (isSessionActiveRef.current) {
          const scheduled = await FocusGuardianService.scheduleReturnReminderAsync(
            guardianStatusRef.current.reminderIntervalMinutes,
            activeSessionNameRef.current ?? 'tu sesión de focus'
          );
          if (scheduled) {
            setGuardianStatus((prev) => ({
              ...prev,
              remindersScheduled: true,
            }));
          }
        }

        return true;
      }

      await FocusGuardianService.cancelScheduledRemindersAsync();
      setGuardianStatus((prev) => ({
        ...prev,
        isEnabled: false,
        remindersScheduled: false,
      }));
      return true;
    },
    []
  );

  // Initialize - check authorization and load blocked apps
  useEffect(() => {
    const initialize = async () => {
      const authorized = await ScreenTimeManager.checkAuthorizationStatus();
      setIsAuthorized(authorized);
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

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (!guardianStatusRef.current.isEnabled || !isSessionActiveRef.current) {
        return;
      }

      if (nextState === 'active') {
        FocusGuardianService.cancelScheduledRemindersAsync().finally(() => {
          if (guardianStatusRef.current.remindersScheduled) {
            setGuardianStatus((prev) => ({
              ...prev,
              remindersScheduled: false,
            }));
          }
        });
        return;
      }

      if (nextState === 'background' || nextState === 'inactive') {
        const sessionName =
          activeSessionNameRef.current ?? 'tu sesión de enfoque';

        FocusGuardianService.sendGuardianAlertAsync(sessionName)
          .then((alerted) => {
            if (alerted) {
              setGuardianStatus((prev) => ({
                ...prev,
                warningCount: prev.warningCount + 1,
                lastWarningAt: new Date(),
              }));
            }
          })
          .catch((error) => {
            console.error('Error enviando alerta de guardian', error);
          });

        FocusGuardianService.scheduleReturnReminderAsync(
          guardianStatusRef.current.reminderIntervalMinutes,
          sessionName
        )
          .then((scheduled) => {
            if (scheduled) {
              setGuardianStatus((prev) => ({
                ...prev,
                remindersScheduled: true,
              }));
            }
          })
          .catch((error) => {
            console.error('Error programando recordatorio de guardian', error);
          });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isSessionActiveRef.current) {
      FocusGuardianService.cancelScheduledRemindersAsync().finally(() => {
        if (guardianStatusRef.current.remindersScheduled) {
          setGuardianStatus((prev) => ({
            ...prev,
            remindersScheduled: false,
          }));
        }
      });
      return;
    }

    if (guardianStatusRef.current.isEnabled && !guardianStatusRef.current.remindersScheduled) {
      FocusGuardianService.scheduleReturnReminderAsync(
        guardianStatusRef.current.reminderIntervalMinutes,
        activeSessionNameRef.current ?? 'tu sesión de enfoque'
      )
        .then((scheduled) => {
          if (scheduled) {
            setGuardianStatus((prev) => ({
              ...prev,
              remindersScheduled: true,
            }));
          }
        })
        .catch((error) => {
          console.error('Error preparando recordatorios de guardian', error);
        });
    }
  }, [isSessionActive]);

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
    guardianStatus,
    setGuardianEnabled,
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
