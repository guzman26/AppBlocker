import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockData } from '../data/mockData';
import { Profile } from '../types/models';
import { colors, typography } from '../theme';

export const NewSettingsScreen: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(mockData.profile);

  const toggleNotifications = () => {
    setProfile(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  };

  const toggleHapticFeedback = () => {
    setProfile(prev => ({
      ...prev,
      hapticFeedbackEnabled: !prev.hapticFeedbackEnabled,
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.largeTitle}>Ajustes</Text>

        {/* Profile Header */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: profile.avatarUrl }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileRole}>{profile.role}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
          <Ionicons name="qr-code-outline" size={26} color={colors.primary} />
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <ToggleTile
          label="Notificaciones inteligentes"
          subtitle="Solo interrupciones relevantes cuando el foco está activo."
          value={profile.notificationsEnabled}
          onToggle={toggleNotifications}
        />

        <ToggleTile
          label="Respuesta háptica"
          subtitle="Recibe confirmaciones sutiles al bloquear apps."
          value={profile.hapticFeedbackEnabled}
          onToggle={toggleHapticFeedback}
        />

        {/* Integrations Section */}
        <Text style={styles.sectionTitle}>Integraciones</Text>

        <LinkTile
          icon="fitness-outline"
          label="Sincronizar con Salud"
          subtitle="Ajusta tu enfoque según tu recuperación y sueño."
        />

        <LinkTile
          icon="shield-checkmark-outline"
          label="Control parental"
          subtitle="Gestiona límites y reportes para tu familia."
        />

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <LinkTile
          icon="person-circle-outline"
          label="Suscripción Pro"
          subtitle="Gestión avanzada de hábitos digitales."
          badge="Activo"
        />

        <LinkTile
          icon="lock-closed-outline"
          label="Privacidad y datos"
          subtitle="Controla qué información compartes."
        />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ToggleTileProps {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
}

const ToggleTile: React.FC<ToggleTileProps> = ({ label, subtitle, value, onToggle }) => {
  return (
    <View style={styles.tile}>
      <View style={styles.tileTextContainer}>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.systemGray5, true: colors.primary }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.systemGray5}
      />
    </View>
  );
};

interface LinkTileProps {
  icon: string;
  label: string;
  subtitle: string;
  badge?: string;
}

const LinkTile: React.FC<LinkTileProps> = ({ icon, label, subtitle, badge }) => {
  return (
    <TouchableOpacity style={styles.tile} activeOpacity={0.8}>
      <View style={styles.linkIconContainer}>
        <Ionicons name={icon as any} size={22} color={colors.accentTeal} />
      </View>
      <View style={styles.linkTextContainer}>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileSubtitle}>{subtitle}</Text>
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
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
  largeTitle: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: 12,
    paddingTop: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: `${colors.separator}40`,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  profileName: {
    ...typography.title,
    color: colors.textPrimary,
  },
  profileRole: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileEmail: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 6,
  },
  sectionTitle: {
    ...typography.callout,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${colors.separator}59`,
  },
  tileTextContainer: {
    flex: 1,
  },
  tileLabel: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  tileSubtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  linkIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.accentTeal}2E`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  linkTextContainer: {
    flex: 1,
  },
  badge: {
    backgroundColor: `${colors.success}1F`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    ...typography.footnote,
    color: colors.success,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 32,
  },
  logoutButtonText: {
    ...typography.callout,
    color: colors.destructive,
    marginLeft: 8,
  },
});










