import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  screenTimeManager,
  screenTimeEvents,
  type BlockSchedule,
  type EventPayload,
  type SelectedApplication,
} from '../native/AppBlockerModule';

const SELECTED_APPS_KEY = 'appblocker.selectedApps';
const BLOCK_PLAN_KEY = 'appblocker.plan';
const FOCUS_IDENTIFIER_PREFIX = 'focus-session';

export interface BlockingPlan {
  startTimeISO: string;
  endTimeISO: string;
  weekdays: number[];
}

export interface FocusSession {
  identifier: string;
  endsAtISO: string;
}

export interface AppBlockerState {
  authorized: boolean;
  loading: boolean;
  selectedApps: SelectedApplication[];
  schedules: BlockSchedule[];
  plan: BlockingPlan;
  focusSession?: FocusSession;
  lastEvent?: EventPayload;
}

export interface AppBlockerActions {
  requestAuthorization: () => Promise<void>;
  pickApps: () => Promise<void>;
  updatePlan: (plan: BlockingPlan) => Promise<void>;
  schedulePlan: (plan?: BlockingPlan) => Promise<void>;
  startFocusSession: (minutes: number) => Promise<void>;
  cancelFocusSession: () => Promise<void>;
  removeAllBlocks: () => Promise<void>;
}

const createDefaultPlan = (): BlockingPlan => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(21, 0, 0, 0);
  const end = new Date(now);
  end.setHours(7, 0, 0, 0);

  return {
    startTimeISO: start.toISOString(),
    endTimeISO: end.toISOString(),
    weekdays: [2, 3, 4, 5, 6],
  };
};

const parsePlan = (raw: string | null): BlockingPlan => {
  if (!raw) {
    return createDefaultPlan();
  }

  try {
    const parsed = JSON.parse(raw) as BlockingPlan;
    return {
      ...createDefaultPlan(),
      ...parsed,
      weekdays: Array.isArray(parsed.weekdays) ? parsed.weekdays : createDefaultPlan().weekdays,
    };
  } catch {
    return createDefaultPlan();
  }
};

const sortByName = (apps: SelectedApplication[]) =>
  [...apps].sort((a, b) => a.displayName.localeCompare(b.displayName));

const buildPlanSchedules = (plan: BlockingPlan): BlockSchedule[] =>
  plan.weekdays.map((weekday) => ({
    identifier: `plan-${weekday}`,
    startDate: plan.startTimeISO,
    endDate: plan.endTimeISO,
    repeatsDaily: true,
    weekday,
  }));

const extractFocusSession = (schedules: BlockSchedule[]): FocusSession | undefined => {
  const focus = schedules.find((schedule) => !schedule.repeatsDaily);
  if (!focus) {
    return undefined;
  }

  return {
    identifier: focus.identifier,
    endsAtISO: focus.endDate,
  };
};

const persistApps = async (apps: SelectedApplication[]) => {
  await AsyncStorage.setItem(SELECTED_APPS_KEY, JSON.stringify(apps));
};

const persistPlan = async (plan: BlockingPlan) => {
  await AsyncStorage.setItem(BLOCK_PLAN_KEY, JSON.stringify(plan));
};

export const useAppBlocker = (): [AppBlockerState, AppBlockerActions] => {
  const [state, setState] = useState<AppBlockerState>({
    authorized: false,
    loading: true,
    selectedApps: [],
    schedules: [],
    plan: createDefaultPlan(),
  });

  const focusFromSchedules = useCallback((schedules: BlockSchedule[]) => extractFocusSession(schedules), []);

  const hydrate = useCallback(async () => {
    try {
      const [authorized, selectedApps, schedules, storedPlan] = await Promise.all([
        screenTimeManager.requestAuthorization(),
        screenTimeManager.loadSelectedApplications(),
        screenTimeManager.fetchActiveBlocks(),
        AsyncStorage.getItem(BLOCK_PLAN_KEY),
      ]);

      const plan = parsePlan(storedPlan);
      const sortedApps = sortByName(selectedApps);
      const focusSession = focusFromSchedules(schedules);

      setState((prev) => ({
        ...prev,
        authorized,
        selectedApps: sortedApps,
        schedules,
        plan,
        focusSession,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to hydrate AppBlocker state', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [focusFromSchedules]);

  useEffect(() => {
    hydrate().catch((error) => {
      console.error('Failed to hydrate AppBlocker state', error);
    });
  }, [hydrate]);

  useEffect(() => {
    const subscription = screenTimeEvents.addListener('ScreenTimeEvent', (payload: EventPayload) => {
      setState((prev) => ({ ...prev, lastEvent: payload }));
    });

    return () => subscription.remove();
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
  }, []);

  const updatePlan = useCallback(async (plan: BlockingPlan) => {
    await persistPlan(plan);
    setState((prev) => ({ ...prev, plan }));
  }, []);

  const schedulePlan = useCallback(
    async (plan?: BlockingPlan) => {
      const nextPlan = plan ?? state.plan;
      await persistPlan(nextPlan);

      const planSchedules = buildPlanSchedules(nextPlan);
      const focusSchedules = state.schedules.filter((schedule) => !schedule.repeatsDaily);
      const schedules = [...planSchedules, ...focusSchedules];

      if (schedules.length === 0) {
        await screenTimeManager.removeAllBlocks();
      } else {
        await screenTimeManager.scheduleBlocks(schedules);
      }

      setState((prev) => ({
        ...prev,
        plan: nextPlan,
        schedules,
        focusSession: focusFromSchedules(schedules),
      }));
    },
    [state.plan, state.schedules, focusFromSchedules],
  );

  const startFocusSession = useCallback(
    async (minutes: number) => {
      const now = new Date();
      const end = new Date(now.getTime() + minutes * 60_000);

      const focusSchedule: BlockSchedule = {
        identifier: `${FOCUS_IDENTIFIER_PREFIX}-${now.getTime()}`,
        startDate: now.toISOString(),
        endDate: end.toISOString(),
        repeatsDaily: false,
      };

      const schedules = [...buildPlanSchedules(state.plan), focusSchedule];
      await screenTimeManager.scheduleBlocks(schedules);

      setState((prev) => ({
        ...prev,
        schedules,
        focusSession: {
          identifier: focusSchedule.identifier,
          endsAtISO: focusSchedule.endDate,
        },
      }));
    },
    [state.plan],
  );

  const cancelFocusSession = useCallback(async () => {
    const schedules = buildPlanSchedules(state.plan);

    if (schedules.length === 0) {
      await screenTimeManager.removeAllBlocks();
    } else {
      await screenTimeManager.scheduleBlocks(schedules);
    }

    setState((prev) => ({
      ...prev,
      schedules,
      focusSession: undefined,
    }));
  }, [state.plan]);

  const removeAllBlocks = useCallback(async () => {
    await screenTimeManager.removeAllBlocks();
    setState((prev) => ({
      ...prev,
      schedules: [],
      focusSession: undefined,
    }));
  }, []);

  return useMemo(
    () => [
      state,
      {
        requestAuthorization,
        pickApps,
        updatePlan,
        schedulePlan,
        startFocusSession,
        cancelFocusSession,
        removeAllBlocks,
      },
    ],
    [state, requestAuthorization, pickApps, updatePlan, schedulePlan, startFocusSession, cancelFocusSession, removeAllBlocks],
  );
};
