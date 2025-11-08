import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FocusModeHeader } from '../components/FocusModeHeader';
import { BlockSessionCard } from '../components/BlockSessionCard';
import { AppUsageTile } from '../components/AppUsageTile';
import { SegmentedControl } from '../components/SegmentedControl';
import { mockData } from '../data/mockData';
import { colors, typography } from '../theme';

export const NewDashboardScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [focusEnabled, setFocusEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.largeTitle}>Focus</Text>
          <Image
            source={{ uri: mockData.profile.avatarUrl }}
            style={styles.avatar}
          />
        </View>

        {/* Focus Mode Header */}
        <FocusModeHeader
          isEnabled={focusEnabled}
          onChanged={setFocusEnabled}
        />

        {/* Segmented Control */}
        <View style={styles.segmentedControlContainer}>
          <SegmentedControl
            segments={['Hoy', '7 días', '30 días']}
            selectedIndex={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </View>

        {/* Block Sessions */}
        {mockData.sessions.map((session, index) => (
          <View key={index} style={styles.sessionCard}>
            <BlockSessionCard session={session} />
          </View>
        ))}

        {/* Featured Apps Section */}
        <Text style={styles.sectionTitle}>Apps destacadas</Text>
        
        {mockData.usage.map((usage, index) => (
          <View key={index} style={styles.usageTile}>
            <AppUsageTile usage={usage} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 8,
  },
  largeTitle: {
    ...typography.largeTitle,
    color: colors.textPrimary,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.separator}66`,
  },
  segmentedControlContainer: {
    marginTop: 28,
    marginBottom: 24,
  },
  sessionCard: {
    marginBottom: 18,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 12,
  },
  usageTile: {
    marginBottom: 12,
  },
});














