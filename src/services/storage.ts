import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  SelectedApplication,
  BlockedWebsite,
  IntentionRecord,
  InterventionConfig,
  DailyStats,
} from '../types';

export class StorageService {
  private static readonly KEYS = {
    SELECTED_APPS: 'appblocker.selectedApps',
    BLOCK_PLAN: 'appblocker.plan',
    BLOCKED_WEBSITES: 'appblocker.blockedWebsites',
    INTENTIONS: 'appblocker.intentions',
    INTERVENTION_CONFIG: 'appblocker.interventionConfig',
    DAILY_STATS: 'appblocker.dailyStats',
    USAGE_HISTORY: 'appblocker.usageHistory',
  };

  static async getSelectedApps(): Promise<SelectedApplication[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.SELECTED_APPS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async saveSelectedApps(apps: SelectedApplication[]): Promise<void> {
    await AsyncStorage.setItem(this.KEYS.SELECTED_APPS, JSON.stringify(apps));
  }

  static async getBlockPlan(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.BLOCK_PLAN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static async saveBlockPlan(plan: any): Promise<void> {
    await AsyncStorage.setItem(this.KEYS.BLOCK_PLAN, JSON.stringify(plan));
  }

  static async getBlockedWebsites(): Promise<BlockedWebsite[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.BLOCKED_WEBSITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async saveBlockedWebsites(websites: BlockedWebsite[]): Promise<void> {
    await AsyncStorage.setItem(this.KEYS.BLOCKED_WEBSITES, JSON.stringify(websites));
  }

  static async addBlockedWebsite(domain: string): Promise<void> {
    const websites = await this.getBlockedWebsites();
    const newWebsite: BlockedWebsite = {
      domain,
      addedAt: new Date().toISOString(),
    };
    websites.push(newWebsite);
    await this.saveBlockedWebsites(websites);
  }

  static async removeBlockedWebsite(domain: string): Promise<void> {
    const websites = await this.getBlockedWebsites();
    const filtered = websites.filter((w) => w.domain !== domain);
    await this.saveBlockedWebsites(filtered);
  }

  static async getIntentions(): Promise<IntentionRecord[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.INTENTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async saveIntention(intention: IntentionRecord): Promise<void> {
    const intentions = await this.getIntentions();
    intentions.push(intention);
    await AsyncStorage.setItem(this.KEYS.INTENTIONS, JSON.stringify(intentions));
  }

  static async updateIntentionFulfillment(id: string, fulfilled: boolean): Promise<void> {
    const intentions = await this.getIntentions();
    const updated = intentions.map((i) => (i.id === id ? { ...i, fulfilled } : i));
    await AsyncStorage.setItem(this.KEYS.INTENTIONS, JSON.stringify(updated));
  }

  static async getInterventionConfig(): Promise<InterventionConfig> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.INTERVENTION_CONFIG);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fall through to default
    }

    return {
      enabled: true,
      breathingDuration: 8,
      requireIntention: true,
      showAlternatives: true,
    };
  }

  static async saveInterventionConfig(config: InterventionConfig): Promise<void> {
    await AsyncStorage.setItem(this.KEYS.INTERVENTION_CONFIG, JSON.stringify(config));
  }

  static async getDailyStats(): Promise<DailyStats[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.DAILY_STATS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async saveDailyStat(stat: DailyStats): Promise<void> {
    const stats = await this.getDailyStats();
    const existingIndex = stats.findIndex((s) => s.date === stat.date);

    if (existingIndex >= 0) {
      stats[existingIndex] = stat;
    } else {
      stats.push(stat);
    }

    const sorted = stats.sort((a, b) => b.date.localeCompare(a.date));
    const last30Days = sorted.slice(0, 30);

    await AsyncStorage.setItem(this.KEYS.DAILY_STATS, JSON.stringify(last30Days));
  }

  static async getTodayStats(): Promise<DailyStats | null> {
    const today = new Date().toISOString().split('T')[0];
    const stats = await this.getDailyStats();
    return stats.find((s) => s.date === today) || null;
  }

  static async updateTodayStats(updates: Partial<DailyStats>): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const current = await this.getTodayStats();

    const newStats: DailyStats = {
      date: today,
      blockedMinutes: current?.blockedMinutes || 0,
      interventionCount: current?.interventionCount || 0,
      successfulBlocks: current?.successfulBlocks || 0,
      ...updates,
    };

    await this.saveDailyStat(newStats);
  }

  static async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(this.KEYS));
  }
}

