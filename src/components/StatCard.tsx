import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtitle, color = colors.primary }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  label: {
    fontSize: typography.caption,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.heading,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.caption,
    color: colors.muted,
  },
});


