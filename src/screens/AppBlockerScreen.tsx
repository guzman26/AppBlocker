import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppBlocker } from '../hooks/useAppBlocker';
import { colors, typography } from '../theme';
import {
  openNotificationPreferences,
  openUsageAccessSettings,
} from '../services/systemSettings';

export const AppBlockerScreen: React.FC = () => {
  const {
    isAuthorized,
    blockedApps,
    isBlocking,
    isSessionActive,
    requestAuthorization,
    selectAndBlockApps,
    unblockAllApps,
    startBlockingSession,
    stopBlockingSession,
    guardianStatus,
    setGuardianEnabled,
    hasSelection,
  } = useAppBlocker();

  const [sessionDuration, setSessionDuration] = useState(60); // minutes

  const guardianLastWarning = useMemo(() => {
    if (!guardianStatus.lastWarningAt) {
      return 'Sin avisos';
    }

    const diff = Date.now() - guardianStatus.lastWarningAt.getTime();

    if (diff < 60 * 1000) {
      return 'Hace menos de 1 min';
    }

    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `Hace ${minutes} min`;
    }

    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 24) {
      return `Hace ${hours} h`;
    }

    return guardianStatus.lastWarningAt.toLocaleDateString();
  }, [guardianStatus.lastWarningAt]);

  const anonymizedBlockedApps = useMemo(() => {
    return blockedApps.map((token, index) => {
      const prefix = token.slice(0, 6);
      const suffix = token.slice(-4);
      const obfuscated = `${prefix}…${suffix}`;
      return `Selección ${index + 1} · ${obfuscated}`;
    });
  }, [blockedApps]);

  const blockingSummary = useMemo(() => {
    if (!hasSelection) {
      return 'Sin apps bloqueadas';
    }

    if (anonymizedBlockedApps.length > 0) {
      return `${anonymizedBlockedApps.length} aplicaciones protegidas`;
    }

    return 'Bloqueo activo para categorías o dominios';
  }, [hasSelection, anonymizedBlockedApps.length]);

  const handleAuthorization = async () => {
    const authorized = await requestAuthorization();
    if (authorized) {
      Alert.alert('¡Autorizado!', 'Ahora puedes bloquear aplicaciones.');
    } else {
      Alert.alert(
        'Autorización denegada',
        'Necesitamos permiso para gestionar Screen Time.'
      );
    }
  };

  const handleSelectApps = async () => {
    const result = await selectAndBlockApps();
    if (result === true) {
      Alert.alert('¡Listo!', 'Las aplicaciones seleccionadas han sido bloqueadas.');
    } else if (result === false) {
      Alert.alert('Error', 'No se pudieron bloquear las aplicaciones.');
    } else {
      Alert.alert(
        'Sin cambios',
        'No seleccionaste nuevas apps o categorías para bloquear.'
      );
    }
  };

  const handleUnblockAll = async () => {
    Alert.alert(
      'Desbloquear todas las apps',
      '¿Estás seguro de que quieres desbloquear todas las aplicaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbloquear',
          style: 'destructive',
          onPress: async () => {
            const success = await unblockAllApps();
            if (success) {
              Alert.alert('¡Desbloqueado!', 'Todas las apps están disponibles.');
            }
          },
        },
      ]
    );
  };

  const handleGuardianToggle = async (value: boolean) => {
    const success = await setGuardianEnabled(value);

    if (!success) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos permisos de notificaciones para avisarte cuando abandones la sesión.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir ajustes',
            onPress: () => {
              openNotificationPreferences();
            },
          },
        ]
      );

      if (value) {
        await setGuardianEnabled(false);
      }

      return;
    }

    if (value) {
      Alert.alert(
        'Guardian estricto activo',
        'Te enviaremos alertas si detectamos que sales de la app durante una sesión de bloqueo.'
      );
    }
  };

  const handleStartSession = async () => {
    const success = await startBlockingSession('Sesión de Focus', sessionDuration);
    if (success) {
      Alert.alert(
        '¡Sesión iniciada!',
        `Las apps estarán bloqueadas por ${sessionDuration} minutos.`
      );
    } else {
      Alert.alert('Error', 'No se pudo iniciar la sesión.');
    }
  };

  const handleStopSession = async () => {
    Alert.alert(
      'Detener sesión',
      '¿Quieres terminar la sesión de bloqueo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Terminar',
          style: 'destructive',
          onPress: async () => {
            const success = await stopBlockingSession();
            if (success) {
              Alert.alert('Sesión terminada', 'El bloqueo ha sido removido.');
            }
          },
        },
      ]
    );
  };

  const handleOpenUsageSettings = async () => {
    const opened = await openUsageAccessSettings();
    if (!opened) {
      Alert.alert(
        'No disponible',
        'No pudimos abrir los ajustes del sistema para controlar el uso de apps.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.largeTitle}>Bloqueo de Apps</Text>

        {/* Authorization Card */}
        {!isAuthorized && (
          <View style={styles.authCard}>
            <View style={styles.authIconContainer}>
              <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
            </View>
            <Text style={styles.authTitle}>Permiso requerido</Text>
            <Text style={styles.authDescription}>
              Para bloquear aplicaciones, necesitamos acceso a Screen Time.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAuthorization}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Autorizar acceso</Text>
            </TouchableOpacity>
          </View>
        )}

        {isAuthorized && (
          <>
            {/* Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={styles.statusIconContainer}>
                  <Ionicons
                    name={isSessionActive ? 'lock-closed' : 'lock-open'}
                    size={24}
                    color={isSessionActive ? colors.primary : colors.textSecondary}
                  />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>
                    {isSessionActive ? 'Sesión activa' : 'Sin sesión activa'}
                  </Text>
                  <Text style={styles.statusDescription}>{blockingSummary}</Text>
                </View>
              </View>

              {isSessionActive && (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={handleStopSession}
                  activeOpacity={0.8}
                >
                  <Text style={styles.stopButtonText}>Terminar sesión</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Acciones rápidas</Text>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleSelectApps}
              disabled={isBlocking}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="apps" size={24} color={colors.primary} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Seleccionar apps para bloquear</Text>
                <Text style={styles.actionDescription}>
                  Elige qué aplicaciones quieres limitar
                </Text>
              </View>
              {isBlocking ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleOpenUsageSettings}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="settings" size={24} color={colors.primary} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Abrir control del sistema</Text>
                <Text style={styles.actionDescription}>
                  Ajusta límites nativos de bienestar digital o Screen Time
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Session Duration Selector */}
            <View style={styles.durationCard}>
              <Text style={styles.durationTitle}>Duración de sesión</Text>
              <View style={styles.durationButtons}>
                {[30, 60, 90, 120].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationButton,
                      sessionDuration === duration && styles.durationButtonActive,
                    ]}
                    onPress={() => setSessionDuration(duration)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.durationButtonText,
                        sessionDuration === duration && styles.durationButtonTextActive,
                      ]}
                    >
                      {duration} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, isSessionActive && styles.primaryButtonDisabled]}
              onPress={handleStartSession}
              disabled={isSessionActive || !hasSelection}
              activeOpacity={0.8}
            >
              <Ionicons name="timer" size={20} color={colors.white} />
              <Text style={styles.primaryButtonText}>Iniciar sesión de focus</Text>
            </TouchableOpacity>

            {/* Blocked Apps List */}
            {hasSelection && (
              <>
                <View style={styles.blockedHeader}>
                  <Text style={styles.sectionTitle}>Apps bloqueadas</Text>
                  <TouchableOpacity onPress={handleUnblockAll} activeOpacity={0.8}>
                    <Text style={styles.unblockAllText}>Desbloquear todas</Text>
                  </TouchableOpacity>
                </View>

                {anonymizedBlockedApps.length > 0 ? (
                  <>
                    <Text style={styles.blockedAppHint}>
                      Por privacidad, iOS entrega identificadores encriptados en lugar de nombres reales.
                    </Text>

                    {anonymizedBlockedApps.map((app) => (
                      <View key={app} style={styles.appTile}>
                        <View style={styles.appIconPlaceholder}>
                          <Ionicons name="apps-outline" size={20} color={colors.textSecondary} />
                        </View>
                        <Text style={styles.appName}>{app}</Text>
                        <View style={styles.blockedBadge}>
                          <Ionicons name="lock-closed" size={12} color={colors.caution} />
                          <Text style={styles.blockedBadgeText}>Bloqueada</Text>
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <View style={styles.blockedEmptyState}>
                    <Ionicons name="apps-outline" size={22} color={colors.textSecondary} />
                    <Text style={styles.blockedEmptyTitle}>Bloqueo activo</Text>
                    <Text style={styles.blockedEmptySubtitle}>
                      Se bloquearán categorías o dominios seleccionados desde el picker de Screen Time.
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Guardian Strict Mode */}
            <View style={styles.guardianCard}>
              <View style={styles.guardianHeader}>
                <View style={styles.guardianIconContainer}>
                  <Ionicons name="shield-half" size={20} color={colors.primary} />
                </View>
                <View style={styles.guardianTextContainer}>
                  <Text style={styles.guardianTitle}>Guardian estricto</Text>
                  <Text style={styles.guardianDescription}>
                    Usa notificaciones del sistema y seguimiento en segundo plano
                    para mantener bloqueadas tus apps.
                  </Text>
                </View>
                <Switch
                  value={guardianStatus.isEnabled}
                  onValueChange={handleGuardianToggle}
                  trackColor={{ false: colors.systemGray5, true: colors.primary }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.systemGray5}
                />
              </View>

              <View style={styles.guardianMetricsRow}>
                <GuardianMetric
                  label="Avisos detectados"
                  value={`${guardianStatus.warningCount}`}
                />
                <View style={styles.guardianDivider} />
                <GuardianMetric label="Último aviso" value={guardianLastWarning} />
                <View style={styles.guardianDivider} />
                <GuardianMetric
                  label="Recordatorios"
                  value={
                    guardianStatus.remindersScheduled
                      ? `Cada ${guardianStatus.reminderIntervalMinutes} min`
                      : 'Inactivos'
                  }
                />
              </View>

              {!guardianStatus.permissionGranted && guardianStatus.isEnabled && (
                <View style={styles.guardianWarning}>
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color={colors.caution}
                    style={styles.guardianWarningIcon}
                  />
                  <Text style={styles.guardianWarningText}>
                    Habilita las notificaciones para recibir alertas inmediatas.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface GuardianMetricProps {
  label: string;
  value: string;
}

const GuardianMetric: React.FC<GuardianMetricProps> = ({ label, value }) => (
  <View style={styles.guardianMetric}>
    <Text style={styles.guardianMetricLabel}>{label}</Text>
    <Text style={styles.guardianMetricValue}>{value}</Text>
  </View>
);

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
    marginBottom: 20,
    paddingTop: 8,
  },
  authCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  authIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}1F`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  authTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  authDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statusTitle: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusDescription: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stopButton: {
    marginTop: 16,
    backgroundColor: `${colors.destructive}1F`,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  stopButtonText: {
    ...typography.callout,
    color: colors.destructive,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.primary}1F`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actionDescription: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 2,
  },
  durationCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  durationTitle: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 12,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: colors.primary,
  },
  durationButtonText: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  durationButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 24,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.systemGray5,
  },
  primaryButtonText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '600',
  },
  blockedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unblockAllText: {
    ...typography.callout,
    color: colors.primary,
    fontWeight: '600',
  },
  blockedAppHint: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  blockedEmptyState: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedEmptyTitle: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 12,
  },
  blockedEmptySubtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  appTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  appIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    ...typography.callout,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 12,
  },
  blockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.caution}1F`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  blockedBadgeText: {
    ...typography.footnote,
    color: colors.caution,
    fontWeight: '600',
  },
  guardianCard: {
    marginTop: 28,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  guardianHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guardianIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardianTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  guardianTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  guardianDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  guardianMetricsRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guardianMetric: {
    flex: 1,
  },
  guardianMetricLabel: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
  guardianMetricValue: {
    ...typography.callout,
    color: colors.textPrimary,
    marginTop: 4,
    fontWeight: '600',
  },
  guardianDivider: {
    width: 1,
    height: 32,
    backgroundColor: `${colors.separator}66`,
    marginHorizontal: 12,
  },
  guardianWarning: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.caution}14`,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  guardianWarningIcon: {
    marginRight: 8,
  },
  guardianWarningText: {
    ...typography.footnote,
    color: colors.caution,
    flex: 1,
  },
});

