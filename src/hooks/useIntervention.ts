import { useCallback, useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import type { InterventionConfig, IntentionRecord } from '../types';

interface InterventionState {
  config: InterventionConfig;
  intentions: IntentionRecord[];
  loading: boolean;
}

export const useIntervention = () => {
  const [state, setState] = useState<InterventionState>({
    config: {
      enabled: true,
      breathingDuration: 8,
      requireIntention: true,
      showAlternatives: true,
    },
    intentions: [],
    loading: true,
  });

  const loadConfig = useCallback(async () => {
    try {
      const config = await StorageService.getInterventionConfig();
      const intentions = await StorageService.getIntentions();
      setState({
        config,
        intentions,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading intervention config:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const updateConfig = useCallback(async (updates: Partial<InterventionConfig>) => {
    const newConfig = { ...state.config, ...updates };
    await StorageService.saveInterventionConfig(newConfig);
    setState((prev) => ({ ...prev, config: newConfig }));
  }, [state.config]);

  const recordIntention = useCallback(async (
    appBundleId: string,
    appName: string,
    intention: string,
  ) => {
    const record: IntentionRecord = {
      id: `${Date.now()}-${Math.random()}`,
      appBundleId,
      appName,
      intention,
      timestamp: new Date().toISOString(),
      fulfilled: false,
    };

    await StorageService.saveIntention(record);
    setState((prev) => ({
      ...prev,
      intentions: [record, ...prev.intentions],
    }));

    return record.id;
  }, []);

  const markIntentionFulfilled = useCallback(async (id: string, fulfilled: boolean) => {
    await StorageService.updateIntentionFulfillment(id, fulfilled);
    setState((prev) => ({
      ...prev,
      intentions: prev.intentions.map((i) =>
        i.id === id ? { ...i, fulfilled } : i
      ),
    }));
  }, []);

  return {
    ...state,
    updateConfig,
    recordIntention,
    markIntentionFulfilled,
    refresh: loadConfig,
  };
};


