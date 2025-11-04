import { useCallback, useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import type { DailyStats, AppUsage } from '../types';

interface AnalyticsState {
  dailyStats: DailyStats[];
  todayStats: DailyStats | null;
  weeklyTotal: number;
  monthlyTotal: number;
  currentStreak: number;
  loading: boolean;
}

export const useAnalytics = () => {
  const [state, setState] = useState<AnalyticsState>({
    dailyStats: [],
    todayStats: null,
    weeklyTotal: 0,
    monthlyTotal: 0,
    currentStreak: 0,
    loading: true,
  });

  const loadAnalytics = useCallback(async () => {
    try {
      const dailyStats = await StorageService.getDailyStats();
      const todayStats = await StorageService.getTodayStats();

      const weeklyTotal = dailyStats.slice(0, 7).reduce((sum, stat) => sum + stat.blockedMinutes, 0);

      const monthlyTotal = dailyStats.slice(0, 30).reduce((sum, stat) => sum + stat.blockedMinutes, 0);

      const currentStreak = calculateStreak(dailyStats);

      setState({
        dailyStats,
        todayStats,
        weeklyTotal,
        monthlyTotal,
        currentStreak,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const calculateStreak = (stats: DailyStats[]): number => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < stats.length; i++) {
      const statDate = new Date(stats[i].date);
      statDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (statDate.getTime() === expectedDate.getTime() && stats[i].successfulBlocks > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const updateTodayStats = useCallback(
    async (updates: Partial<DailyStats>) => {
      await StorageService.updateTodayStats(updates);
      await loadAnalytics();
    },
    [loadAnalytics],
  );

  const incrementIntervention = useCallback(async () => {
    const today = state.todayStats || {
      date: new Date().toISOString().split('T')[0],
      blockedMinutes: 0,
      interventionCount: 0,
      successfulBlocks: 0,
    };

    await updateTodayStats({
      interventionCount: today.interventionCount + 1,
    });
  }, [state.todayStats, updateTodayStats]);

  const incrementSuccessfulBlock = useCallback(async () => {
    const today = state.todayStats || {
      date: new Date().toISOString().split('T')[0],
      blockedMinutes: 0,
      interventionCount: 0,
      successfulBlocks: 0,
    };

    await updateTodayStats({
      successfulBlocks: today.successfulBlocks + 1,
    });
  }, [state.todayStats, updateTodayStats]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    ...state,
    refresh: loadAnalytics,
    updateTodayStats,
    incrementIntervention,
    incrementSuccessfulBlock,
  };
};


