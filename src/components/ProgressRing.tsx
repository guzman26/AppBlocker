import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color = colors.primary,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.svgContainer}>
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: colors.surfaceAlt,
            },
          ]}
        />
        <View
          style={[
            styles.progressCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: 'transparent',
              borderRightColor: progress > 25 ? color : 'transparent',
              borderBottomColor: progress > 50 ? color : 'transparent',
              borderLeftColor: progress > 75 ? color : 'transparent',
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
  },
  progressCircle: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
  },
  percentage: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: typography.caption,
    color: colors.muted,
  },
});


