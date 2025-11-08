import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export interface WeekdayOption {
  value: number;
  label: string;
  shortLabel: string;
}

const WEEKDAYS: WeekdayOption[] = [
  { value: 2, label: 'Lunes', shortLabel: 'L' },
  { value: 3, label: 'Martes', shortLabel: 'M' },
  { value: 4, label: 'Miércoles', shortLabel: 'X' },
  { value: 5, label: 'Jueves', shortLabel: 'J' },
  { value: 6, label: 'Viernes', shortLabel: 'V' },
  { value: 7, label: 'Sábado', shortLabel: 'S' },
  { value: 1, label: 'Domingo', shortLabel: 'D' },
];

interface Props {
  selected: number[];
  onToggle: (weekday: number) => void;
}

export const WeekdaySelector: React.FC<Props> = ({ selected, onToggle }) => {
  const isSelected = (weekday: number) => selected.includes(weekday);

  return (
    <View style={styles.container}>
      {WEEKDAYS.map((day) => (
        <Pressable
          key={day.value}
          style={[styles.pill, isSelected(day.value) && styles.pillSelected]}
          onPress={() => onToggle(day.value)}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected(day.value) }}
          accessibilityLabel={day.label}
        >
          <Text style={[styles.pillText, isSelected(day.value) && styles.pillTextSelected]}>
            {day.shortLabel}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontSize: typography.caption,
    color: colors.muted,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: colors.text,
  },
});

export { WEEKDAYS };
