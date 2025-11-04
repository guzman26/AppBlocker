import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Insight } from '../types/models';
import { colors, typography } from '../theme';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const isPositive = insight.trend >= 0;
  const trendColor = isPositive ? colors.success : colors.caution;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{insight.title}</Text>
      <Text style={styles.subtitle}>{insight.subtitle}</Text>
      
      <View style={styles.highlightRow}>
        <Text style={styles.highlight}>{insight.highlight.toFixed(1)}</Text>
        <Ionicons
          name={isPositive ? 'arrow-up-circle' : 'arrow-down-circle-outline'}
          size={22}
          color={trendColor}
        />
      </View>
      
      <Text style={[styles.delta, { color: trendColor }]}>
        {insight.deltaDescription}
      </Text>
      
      <View style={styles.trendMeterContainer}>
        <View style={styles.trendMeterBackground}>
          <LinearGradient
            colors={[colors.primary, colors.accentIndigo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.trendMeterBar, { width: `${Math.abs(insight.trend).toFixed(2) * 100}%` }]}
          />
          <Text style={styles.trendMeterText}>
            {Math.round(Math.abs(insight.trend) * 100)}% de tendencia positiva
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: `${colors.separator}59`,
  },
  title: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 6,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  highlight: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 6,
  },
  delta: {
    ...typography.footnote,
    fontWeight: '600',
    marginTop: 8,
  },
  trendMeterContainer: {
    marginTop: 18,
  },
  trendMeterBackground: {
    height: 44,
    backgroundColor: colors.background,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendMeterBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
  },
  trendMeterText: {
    ...typography.footnote,
    color: colors.textPrimary,
    fontWeight: '600',
    zIndex: 1,
  },
});










