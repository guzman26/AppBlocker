import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  screenTimeManager,
  screenTimeEvents,
  type BlockSchedule,
  type EventPayload,
  type SelectedApplication,
} from '../native/AppBlockerModule';

const SELECTED_APPS_KEY = 'appblocker.selectedApps';

export interface AppBlockerState {
  authorized: boolean;
  loading: boolean;
  selectedApps: SelectedApplication[];
  schedules: BlockSchedule[];
  lastEvent?: EventPayload;
}

export interface AppBlockerActions {
  requestAuthorization: () => Promise<void>;
  pickApps: () => Promise<void>;
  scheduleBlock: (schedule: BlockSchedule) => Promise<void>;
  removeAllBlocks: () => Promise<void>;
}

const sortByName = (apps: SelectedApplication[]) =>
  [...apps].sort((a, b) => a.displayName.localeCompare(b.displayName));

export const useAppBlocker = (): [AppBlockerState, AppBlockerActions] => {
  const [state, setState] = useState<AppBlockerState>({
    authorized: false,
    loading: true,
    selectedApps: [],
    schedules: [],
  });

  const hydrate = useCallback(async () => {
    const [authorized, selectedApps, schedules] = await Promise.all([
      screenTimeManager.requestAuthorization(),
      screenTimeManager.loadSelectedApplications(),
      screenTimeManager.fetchActiveBlocks(),
    ]);

    setState((prev) => ({
      ...prev,
      authorized,
      selectedApps: sortByName(selectedApps),
      schedules,
      loading: false,
    }));
  }, []);

  useEffect(() => {
    hydrate().catch((error) => {
      console.error('Failed to hydrate AppBlocker state', error);
      setState((prev) => ({ ...prev, loading: false }));
    });
  }, [hydrate]);

  useEffect(() => {
    const subscription = screenTimeEvents.addListener('ScreenTimeEvent', (payload: EventPayload) => {
      setState((prev) => ({ ...prev, lastEvent: payload }));
    });

    return () => subscription.remove();
  }, []);

  const persistApps = useCallback(async (apps: SelectedApplication[]) => {
    await AsyncStorage.setItem(SELECTED_APPS_KEY, JSON.stringify(apps));
  }, []);

  const requestAuthorization = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const authorized = await screenTimeManager.requestAuthorization();
    setState((prev) => ({ ...prev, authorized, loading: false }));
  }, []);

  const pickApps = useCallback(async () => {
    const selection = await screenTimeManager.openFamilyActivityPicker();
    const apps = sortByName(selection);
    await screenTimeManager.saveSelectedApplications(apps);
    await persistApps(apps);
    setState((prev) => ({ ...prev, selectedApps: apps }));
  }, [persistApps]);

  const scheduleBlock = useCallback(
    async (schedule: BlockSchedule) => {
      const schedules = [
        ...state.schedules.filter((item) => item.identifier !== schedule.identifier),
        schedule,
      ];
      await screenTimeManager.scheduleBlocks(schedules);
      setState((prev) => ({ ...prev, schedules }));
    },
    [state.schedules],
  );

  const removeAllBlocks = useCallback(async () => {
    await screenTimeManager.removeAllBlocks();
    setState((prev) => ({ ...prev, schedules: [] }));
  }, []);

  return [
    state,
    {
      requestAuthorization,
      pickApps,
      scheduleBlock,
      removeAllBlocks,
    },
  ];
};
