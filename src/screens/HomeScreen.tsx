import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppBlocker } from '../hooks/useAppBlocker';
import { PrimaryButton, Card } from '../components';
import { colors, spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const {
    isAuthorized,
    isBlocking,
    isBlockingActive,
    hasSelection,
    blockedApps,
    requestAuthorization,
    selectApps,
    toggleBlocking,
  } = useAppBlocker();

  const handleSelectApps = async () => {
    if (!isAuthorized) {
      const authorized = await requestAuthorization();
      if (!authorized) {
        return;
      }
    }
    await selectApps();
  };

  const handleToggleBlocking = async (value: boolean) => {
    if (!hasSelection) {
      await handleSelectApps();
      return;
    }
    await toggleBlocking(value);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AppBlocker</Text>
          <Text style={styles.subtitle}>
            Bloqueo consciente de aplicaciones
          </Text>
        </View>

        {/* How to Use Card */}
        {isAuthorized && !hasSelection && (
          <Card style={[styles.card, styles.howToCard]}>
            <Text style={styles.howToIcon}>📖</Text>
            <Text style={styles.howToTitle}>Cómo usar AppBlocker</Text>
            <View style={styles.howToSteps}>
              <View style={styles.howToStep}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>
                  Toca "Seleccionar Apps" para elegir las apps que quieres bloquear
                </Text>
              </View>
              <View style={styles.howToStep}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>
                  Activa el interruptor de bloqueo cuando quieras concentrarte
                </Text>
              </View>
              <View style={styles.howToStep}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>
                  Configura intervenciones en la pestaña "Interventions"
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Authorization Card */}
        {!isAuthorized && (
          <Card style={styles.card}>
            <View style={styles.authCard}>
              <Text style={styles.authIcon}>🔐</Text>
              <Text style={styles.authTitle}>Autorización Requerida</Text>
              <Text style={styles.authDescription}>
                Para bloquear apps, necesitamos acceso a Screen Time de iOS.
                Toca el botón para otorgar permisos.
              </Text>
              <PrimaryButton
                title="Otorgar Permiso"
                onPress={requestAuthorization}
                style={styles.authButton}
              />
              <View style={styles.authHelp}>
                <Text style={styles.authHelpText}>
                  💡 Esto es seguro y solo permite a la app gestionar el bloqueo de apps en tu dispositivo.
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Main Control Card */}
        {isAuthorized && (
          <>
            <Card style={styles.card}>
              <View style={styles.controlCard}>
                <View style={styles.controlHeader}>
                <View style={styles.controlInfo}>
                  <Text style={styles.controlTitle}>Bloqueo</Text>
                  <Text style={styles.controlDescription}>
                    {isBlockingActive
                      ? 'Las apps están bloqueadas'
                      : 'Las apps no están bloqueadas'}
                  </Text>
                </View>
                  {isBlocking ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Switch
                      value={isBlockingActive}
                      onValueChange={handleToggleBlocking}
                      trackColor={{
                        false: colors.separator,
                        true: colors.primary,
                      }}
                      thumbColor={colors.white}
                      disabled={!hasSelection || isBlocking}
                    />
                  )}
                </View>

                {!hasSelection && (
                  <View style={styles.noSelectionBanner}>
                    <Text style={styles.noSelectionText}>
                      Primero selecciona apps para bloquear
                    </Text>
                  </View>
                )}
              </View>
            </Card>

            {/* Select Apps Button */}
            <PrimaryButton
              title={hasSelection ? 'Cambiar Apps' : 'Seleccionar Apps a Bloquear'}
              onPress={handleSelectApps}
              disabled={isBlocking}
              style={styles.selectButton}
            />

            {/* Blocked Apps List */}
            {hasSelection && blockedApps.length > 0 && (
              <Card style={styles.card}>
                <View style={styles.appsCard}>
                  <Text style={styles.appsTitle}>
                    Apps Seleccionadas ({blockedApps.length})
                  </Text>
                  <Text style={styles.appsDescription}>
                    Estas apps se bloquearán cuando actives el bloqueo
                  </Text>
                  <View style={styles.appsList}>
                    {blockedApps.slice(0, 5).map((app, index) => (
                      <View key={index} style={styles.appItem}>
                        <View style={styles.appDot} />
                        <Text style={styles.appText} numberOfLines={1}>
                          App {index + 1}
                        </Text>
                      </View>
                    ))}
                    {blockedApps.length > 5 && (
                      <Text style={styles.moreApps}>
                        + {blockedApps.length - 5} more
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            )}

            {/* Info Card */}
            <Card style={styles.infoCard}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoTitle}>Cómo funciona</Text>
              <Text style={styles.infoText}>
                Cuando el bloqueo está activo, iOS mostrará un escudo al intentar
                abrir apps bloqueadas. Ve a la pestaña "Interventions" para configurar
                ejercicios de respiración y reflexión antes de desbloquear.
              </Text>
            </Card>
          </>
        )}
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
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.lg,
  },
  authCard: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  authIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  authDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  authButton: {
    minWidth: 200,
  },
  authHelp: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
  },
  authHelpText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  howToCard: {
    padding: spacing.lg,
  },
  howToIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  howToTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  howToSteps: {
    gap: spacing.md,
  },
  howToStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: spacing.md,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingTop: 5,
  },
  controlCard: {
    padding: spacing.lg,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlInfo: {
    flex: 1,
  },
  controlTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  controlDescription: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  noSelectionBanner: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.warning + '20',
    borderRadius: 8,
  },
  noSelectionText: {
    fontSize: 14,
    color: colors.warning,
    textAlign: 'center',
  },
  selectButton: {
    marginBottom: spacing.lg,
  },
  appsCard: {
    padding: spacing.lg,
  },
  appsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  appsDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  appsList: {
    marginTop: spacing.sm,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  appDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  appText: {
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  moreApps: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
  infoCard: {
    padding: spacing.lg,
    backgroundColor: colors.primary + '10',
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

