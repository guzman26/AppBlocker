import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface BreathingExerciseProps {
  duration: number;
  onComplete: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ duration, onComplete }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(duration);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const cycleTime = 12;
    const inhaleTime = 4;
    const holdTime = 4;
    const exhaleTime = 4;

    const animateBreathing = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: inhaleTime * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: holdTime * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: exhaleTime * 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (countdown > cycleTime) {
          animateBreathing();
        }
      });
    };

    animateBreathing();

    const phaseInterval = setInterval(() => {
      setPhase((current) => {
        if (current === 'inhale') return 'hold';
        if (current === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          clearInterval(phaseInterval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(countdownInterval);
    };
  }, [countdown, duration, onComplete, scaleAnim]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhala profundo';
      case 'hold':
        return 'Mantén el aire';
      case 'exhale':
        return 'Exhala lentamente';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{getPhaseText()}</Text>

      <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />

      <Text style={styles.countdown}>{countdown}s</Text>

      <Text style={styles.subtitle}>Respira conscientemente antes de continuar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  instruction: {
    fontSize: typography.heading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    opacity: 0.6,
    marginBottom: spacing.xl,
  },
  countdown: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
});


