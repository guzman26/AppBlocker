import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<Props> = ({ label, onPress, disabled }) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      disabled && styles.disabled,
      pressed && styles.pressed,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
