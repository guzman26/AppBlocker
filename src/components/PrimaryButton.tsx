import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<Props> = ({ label, onPress, disabled }) => (
  <Pressable style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: colors.muted,
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
