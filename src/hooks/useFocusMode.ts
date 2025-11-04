import { useCallback, useEffect, useState } from 'react';
// Using mock for development - change to '../native/AppBlockerModule' when native module is ready
import { screenTimeManager } from '../native/AppBlockerModule.mock';
import type { FocusMode } from '../types';

interface FocusModeState {
  focusModes: FocusMode[];
  activeFocusMode: string | null;
  loading: boolean;
}

export const useFocusMode = () => {
  const [state, setState] = useState<FocusModeState>({
    focusModes: [],
    activeFocusMode: null,
    loading: true,
  });

  const loadFocusModes = useCallback(async () => {
    try {
      const modes = await screenTimeManager.getFocusModes();
      setState({
        focusModes: modes,
        activeFocusMode: modes.find((m) => m.isActive)?.id || null,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading focus modes:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadFocusModes();
  }, [loadFocusModes]);

  const syncWithFocusMode = useCallback(async (focusModeId: string) => {
    try {
      await screenTimeManager.syncWithFocusMode(focusModeId);
      setState((prev) => ({
        ...prev,
        activeFocusMode: focusModeId,
      }));
    } catch (error) {
      console.error('Error syncing with focus mode:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    syncWithFocusMode,
    refresh: loadFocusModes,
  };
};


