import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { InsightCard } from '../components/InsightCard';
import { SegmentedControl } from '../components/SegmentedControl';
import { mockData } from '../data/mockData';
import { colors, typography } from '../theme';

export const NewInsightsScreen: React.FC = () => {
  const [selectedScope, setSelectedScope] = useState(1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.largeTitle}>Insights</Text>

        {/* Hero Banner */}
        <LinearGradient
          colors={['#0A84FF', '#5E5CE6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>Focus Score</Text>
            <View style={styles.flowModeBadge}>
              <Ionicons name="sparkles" size={16} color={colors.white} />
              <Text style={styles.flowModeText}>Modo flujo</Text>
            </View>
          </View>

          <Text style={styles.heroScore}>8.7</Text>
          <Text style={styles.heroDescription}>
            Tu foco es sobresaliente, mantén este ritmo durante 2 días más para desbloquear recomendaciones avanzadas.
          </Text>

          <View style={styles.metricsRow}>
            <HeroMetric
              label="Bloqueos"
              value="26"
              description="+6 vs. semana pasada"
            />
            <View style={styles.metricSpacer} />
            <HeroMetric
              label="Apps críticas"
              value="4"
              description="Sin alertas"
            />
          </View>
        </LinearGradient>

        {/* Scope Selector */}
        <View style={styles.scopeSelectorContainer}>
          <SegmentedControl
            segments={['24 h', 'Semana', 'Mes']}
            selectedIndex={selectedScope}
            onChange={setSelectedScope}
          />
        </View>

        {/* Insights */}
        {mockData.insights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <InsightCard insight={insight} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

interface HeroMetricProps {
  label: string;
  value: string;
  description: string;
}

const HeroMetric: React.FC<HeroMetricProps> = ({ label, value, description }) => {
  return (
    <View style={styles.heroMetric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDescription}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  largeTitle: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: 12,
    paddingTop: 8,
  },
  heroBanner: {
    borderRadius: 30,
    padding: 24,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 12,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroLabel: {
    ...typography.footnote,
    color: `${colors.white}CC`,
  },
  flowModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.white}2E`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  flowModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 6,
  },
  heroScore: {
    fontSize: 54,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 6,
  },
  heroDescription: {
    ...typography.body,
    color: `${colors.white}E0`,
    marginBottom: 18,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metricSpacer: {
    width: 18,
  },
  heroMetric: {
    flex: 1,
    backgroundColor: `${colors.white}1F`,
    borderRadius: 20,
    padding: 16,
  },
  metricLabel: {
    ...typography.footnote,
    color: `${colors.white}B8`,
  },
  metricValue: {
    ...typography.title,
    color: colors.white,
    marginTop: 4,
  },
  metricDescription: {
    ...typography.footnote,
    color: `${colors.white}B8`,
    marginTop: 4,
  },
  scopeSelectorContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  insightCard: {
    marginBottom: 16,
  },
});














