import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAnalytics } from '../hooks/useAnalytics';
import { StatCard } from '../components/StatCard';
import { UsageChart } from '../components/UsageChart';
import { ProgressRing } from '../components/ProgressRing';
import { Card } from '../components/Card';
import { colors, spacing, typography } from '../theme';

export const AnalyticsScreen: React.FC = () => {
  const { dailyStats, todayStats, weeklyTotal, monthlyTotal, currentStreak, loading, refresh } = useAnalytics();

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const todayMinutes = todayStats?.blockedMinutes || 0;
  const todayGoal = 180;
  const todayProgress = Math.min((todayMinutes / todayGoal) * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
    >
      <Text style={styles.title}>Análisis de uso</Text>
      <Text style={styles.subtitle}>Revisa tus métricas y progreso de bloqueo</Text>

      <Card>
        <View style={styles.progressContainer}>
          <ProgressRing progress={todayProgress} label="de meta diaria" />
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Tiempo bloqueado hoy</Text>
            <Text style={styles.progressValue}>{formatMinutes(todayMinutes)}</Text>
            <Text style={styles.progressGoal}>Meta: {formatMinutes(todayGoal)}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <StatCard label="Racha actual" value={currentStreak} subtitle="días consecutivos" color={colors.accent} />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Esta semana"
            value={formatMinutes(weeklyTotal)}
            subtitle="tiempo bloqueado"
            color={colors.primary}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <StatCard
            label="Intervenciones"
            value={todayStats?.interventionCount || 0}
            subtitle="pausas hoy"
            color={colors.primary}
          />
        </View>
        <View style={styles.statItem}>
          <StatCard
            label="Bloqueos exitosos"
            value={todayStats?.successfulBlocks || 0}
            subtitle="apps bloqueadas"
            color={colors.accent}
          />
        </View>
      </View>

      <UsageChart data={dailyStats} title="Últimos 7 días" />

      <Card>
        <Text style={styles.sectionTitle}>Resumen mensual</Text>
        <View style={styles.monthlyContainer}>
          <View style={styles.monthlyRow}>
            <Text style={styles.monthlyLabel}>Tiempo total bloqueado</Text>
            <Text style={styles.monthlyValue}>{formatMinutes(monthlyTotal)}</Text>
          </View>
          <View style={styles.monthlyRow}>
            <Text style={styles.monthlyLabel}>Promedio diario</Text>
            <Text style={styles.monthlyValue}>{formatMinutes(Math.round(monthlyTotal / 30))}</Text>
          </View>
          <View style={styles.monthlyRow}>
            <Text style={styles.monthlyLabel}>Días con bloqueos</Text>
            <Text style={styles.monthlyValue}>{dailyStats.length} días</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Consejos</Text>
        <Text style={styles.tipText}>
          {currentStreak >= 7
            ? '¡Excelente racha! Mantén el ritmo para consolidar tus nuevos hábitos.'
            : currentStreak >= 3
              ? 'Buen progreso. Intenta mantener la consistencia por 7 días.'
              : 'Establece metas pequeñas y alcanzables para comenzar tu racha.'}
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: typography.subheading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressValue: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  progressGoal: {
    fontSize: typography.caption,
    color: colors.muted,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.subheading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  monthlyContainer: {
    gap: spacing.sm,
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  monthlyLabel: {
    fontSize: typography.body,
    color: colors.muted,
  },
  monthlyValue: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  tipText: {
    fontSize: typography.body,
    color: colors.muted,
    lineHeight: 22,
  },
});


