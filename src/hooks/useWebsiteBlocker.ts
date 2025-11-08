import { useCallback, useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
// Using mock for development - change to '../native/AppBlockerModule' when native module is ready
import { screenTimeManager } from '../native/AppBlockerModule.mock';
import type { BlockedWebsite } from '../types';

interface WebsiteBlockerState {
  websites: BlockedWebsite[];
  loading: boolean;
}

export const useWebsiteBlocker = () => {
  const [state, setState] = useState<WebsiteBlockerState>({
    websites: [],
    loading: true,
  });

  const loadWebsites = useCallback(async () => {
    try {
      const websites = await StorageService.getBlockedWebsites();
      setState({
        websites,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading blocked websites:', error);
      setState({ websites: [], loading: false });
    }
  }, []);

  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  const addWebsite = useCallback(async (domain: string) => {
    await StorageService.addBlockedWebsite(domain);
    
    const websites = await StorageService.getBlockedWebsites();
    const domains = websites.map((w) => w.domain);
    
    await screenTimeManager.saveBlockedWebsites(domains);
    
    setState((prev) => ({
      ...prev,
      websites,
    }));
  }, []);

  const removeWebsite = useCallback(async (domain: string) => {
    await StorageService.removeBlockedWebsite(domain);
    
    const websites = await StorageService.getBlockedWebsites();
    const domains = websites.map((w) => w.domain);
    
    await screenTimeManager.saveBlockedWebsites(domains);
    
    setState((prev) => ({
      ...prev,
      websites: prev.websites.filter((w) => w.domain !== domain),
    }));
  }, []);

  const syncWithNative = useCallback(async () => {
    const websites = await StorageService.getBlockedWebsites();
    const domains = websites.map((w) => w.domain);
    await screenTimeManager.saveBlockedWebsites(domains);
  }, []);

  return {
    ...state,
    addWebsite,
    removeWebsite,
    syncWithNative,
    refresh: loadWebsites,
  };
};


