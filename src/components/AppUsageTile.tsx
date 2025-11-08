import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppUsage } from '../types/models';
import { colors, typography } from '../theme';

interface AppUsageTileProps {
  usage: AppUsage;
}

export const AppUsageTile: React.FC<AppUsageTileProps> = ({ usage }) => {
  const isOverLimit = usage.used > usage.limit;
  const changeColor = usage.changePercentage <= 0 ? colors.success : colors.caution;
  
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins} min`;
    }
    return `${hours} h ${mins.toString().padStart(2, '0')} min`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${usage.tint}2E` }]}>
        <Ionicons name={usage.icon as any} size={24} color={usage.tint} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.name}>{usage.name}</Text>
        <Text style={styles.category}>
          {usage.category} · límite {formatDuration(usage.limit)}
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.usage}>{formatDuration(usage.used)}</Text>
        <Text style={[styles.change, { color: usage.changePercentage === 0 ? colors.textSecondary : changeColor }]}>
          {usage.changePercentage > 0 ? '+' : ''}{usage.changePercentage.toFixed(0)}%
        </Text>
      </View>
      
      <View style={[styles.indicator, { backgroundColor: isOverLimit ? colors.caution : colors.success }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 20,
    padding: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: `${colors.separator}66`,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  category: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    alignItems: 'flex-end',
    marginRight: 4,
  },
  usage: {
    ...typography.callout,
    color: colors.textPrimary,
  },
  change: {
    ...typography.footnote,
    marginTop: 2,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});














