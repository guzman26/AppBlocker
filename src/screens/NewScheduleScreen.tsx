import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockData } from '../data/mockData';
import { Schedule } from '../types/models';
import { colors, typography } from '../theme';

export const NewScheduleScreen: React.FC = () => {
  const [schedules, setSchedules] = useState(mockData.schedules);

  const toggleSchedule = (index: number) => {
    const updated = [...schedules];
    updated[index] = {
      ...updated[index],
      isEnabled: !updated[index].isEnabled,
    };
    setSchedules(updated);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.largeTitle}>Horarios</Text>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="calendar-outline" size={26} color={colors.accentIndigo} />
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Programa tu semana</Text>
              <Text style={styles.heroDescription}>
                Crea automatizaciones con tus ritmos de energía y apps clave.
              </Text>
            </View>
          </View>
          <View style={styles.weeklyStatsCard}>
            <Text style={styles.weeklyStatsLabel}>Tiempo protegido semanal</Text>
            <Text style={styles.weeklyStatsValue}>38 h</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Rutinas automáticas</Text>

        {/* Schedule Tiles */}
        {schedules.map((schedule, index) => (
          <ScheduleTile
            key={index}
            schedule={schedule}
            onToggle={() => toggleSchedule(index)}
          />
        ))}

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={22} color={colors.white} />
          <Text style={styles.addButtonText}>Nuevo horario inteligente</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ScheduleTileProps {
  schedule: Schedule;
  onToggle: () => void;
}

const ScheduleTile: React.FC<ScheduleTileProps> = ({ schedule, onToggle }) => {
  return (
    <View style={styles.scheduleTile}>
      <View style={styles.scheduleIconContainer}>
        <Ionicons name="rocket" size={22} color={colors.accentPurple} />
      </View>
      <View style={styles.scheduleTextContainer}>
        <Text style={styles.scheduleName}>{schedule.name}</Text>
        <Text style={styles.scheduleDays}>{schedule.days.join(' · ')}</Text>
        <Text style={styles.scheduleTime}>{schedule.timeRange}</Text>
      </View>
      <Switch
        value={schedule.isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.systemGray5, true: colors.primary }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.systemGray5}
      />
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
  heroCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.07,
    shadowRadius: 28,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  heroIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: `${colors.accentIndigo}29`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  heroTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  heroDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  weeklyStatsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  weeklyStatsLabel: {
    ...typography.footnote,
    color: colors.textPrimary,
  },
  weeklyStatsValue: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  scheduleTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${colors.separator}66`,
  },
  scheduleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.accentPurple}2E`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  scheduleName: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  scheduleDays: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scheduleTime: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
  },
  addButtonText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});










