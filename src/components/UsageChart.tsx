import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import type { DailyStats } from '../types';

interface UsageChartProps {
  data: DailyStats[];
  title: string;
}

const CHART_WIDTH = Dimensions.get('window').width - spacing.lg * 2;
const CHART_HEIGHT = 200;
const BAR_WIDTH = 24;

export const UsageChart: React.FC<UsageChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map((d) => d.blockedMinutes), 1);
  const last7Days = data.slice(0, 7).reverse();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {last7Days.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay datos disponibles</Text>
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <View style={styles.barsContainer}>
            {last7Days.map((stat, index) => {
              const height = (stat.blockedMinutes / maxValue) * (CHART_HEIGHT - 40);
              return (
                <View key={stat.date} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <Text style={styles.barValue}>{formatMinutes(stat.blockedMinutes)}</Text>
                    <View style={[styles.bar, { height: Math.max(height, 4) }]} />
                  </View>
                  <Text style={styles.barLabel}>{formatDate(stat.date)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  title: {
    fontSize: typography.subheading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chartContainer: {
    height: CHART_HEIGHT,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: CHART_HEIGHT - 30,
    paddingTop: spacing.lg,
  },
  barWrapper: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: CHART_HEIGHT - 50,
  },
  bar: {
    width: BAR_WIDTH,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: spacing.xs,
  },
  barValue: {
    fontSize: typography.caption - 2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  barLabel: {
    fontSize: typography.caption,
    color: colors.muted,
  },
  emptyState: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.muted,
  },
});


