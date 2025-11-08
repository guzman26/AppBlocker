import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlockSession } from '../types/models';
import { colors, typography } from '../theme';

interface BlockSessionCardProps {
  session: BlockSession;
}

export const BlockSessionCard: React.FC<BlockSessionCardProps> = ({ session }) => {
  const gradientColors = [
    `${session.accentColor}E6`, // 90% opacity
    `${session.accentColor}A6`, // 65% opacity
  ] as const;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{session.name}</Text>
            <Text style={styles.description}>{session.description}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{session.timeRange}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${session.progress * 100}%` }]} />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.statusText}>
            {session.isActive ? 'En progreso' : 'Programado'}
          </Text>
          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>
              {Math.round(session.progress * 100)}% completado
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 36,
    elevation: 12,
  },
  gradient: {
    padding: 20,
    borderRadius: 26,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...typography.title,
    color: colors.white,
  },
  description: {
    ...typography.body,
    color: `${colors.white}CC`,
    marginTop: 4,
  },
  timeBadge: {
    height: 34,
    paddingHorizontal: 14,
    backgroundColor: `${colors.white}1F`,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    ...typography.footnote,
    color: colors.white,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: `${colors.white}29`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    ...typography.body,
    color: colors.white,
  },
  completionBadge: {
    backgroundColor: `${colors.white}33`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completionText: {
    ...typography.footnote,
    color: colors.white,
    fontWeight: '600',
  },
});














