import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

interface FocusModeHeaderProps {
  isEnabled: boolean;
  onChanged: (value: boolean) => void;
}

export const FocusModeHeader: React.FC<FocusModeHeaderProps> = ({ isEnabled, onChanged }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="moon" size={24} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Focus Automático</Text>
          <Text style={styles.description}>
            Optimiza tus sesiones según la agenda y estado de energía.
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={onChanged}
          trackColor={{ false: colors.systemGray5, true: colors.primary }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.systemGray5}
        />
      </View>
      <View style={styles.metricsRow}>
        <DetailPill
          icon="flash"
          label="Ritmo ideal"
          value={isEnabled ? '92%' : '78%'}
        />
        <View style={styles.spacer} />
        <DetailPill
          icon="time-outline"
          label="Siguiente pausa"
          value="14 min"
        />
      </View>
    </View>
  );
};

interface DetailPillProps {
  icon: string;
  label: string;
  value: string;
}

const DetailPill: React.FC<DetailPillProps> = ({ icon, label, value }) => {
  return (
    <View style={styles.pill}>
      <View style={styles.pillIconContainer}>
        <Ionicons name={icon as any} size={18} color={colors.textPrimary} />
      </View>
      <View>
        <Text style={styles.pillLabel}>{label}</Text>
        <Text style={styles.pillValue}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.primary}1F`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  spacer: {
    width: 12,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 14,
    paddingHorizontal: 16,
  },
  pillIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.systemGray5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pillLabel: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
  pillValue: {
    ...typography.callout,
    color: colors.textPrimary,
    marginTop: 2,
  },
});










