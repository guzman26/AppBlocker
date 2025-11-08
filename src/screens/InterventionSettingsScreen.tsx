import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useIntervention } from '../hooks/useIntervention';
import { Card } from '../components';
import { colors, spacing } from '../theme';

export const InterventionSettingsScreen: React.FC = () => {
  const { config, updateConfig, loading } = useIntervention();

  const handleToggleEnabled = (value: boolean) => {
    updateConfig({ enabled: value });
  };

  const handleBreathingDurationChange = (value: number) => {
    updateConfig({ breathingDuration: Math.round(value) });
  };

  const handleToggleIntention = (value: boolean) => {
    updateConfig({ requireIntention: value });
  };

  const handleToggleAlternatives = (value: boolean) => {
    updateConfig({ showAlternatives: value });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Intervenciones</Text>
          <Text style={styles.subtitle}>
            Configura pausas conscientes al acceder a apps bloqueadas
          </Text>
        </View>

        {/* How to Use Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instructionsIcon}>ℹ️</Text>
          <Text style={styles.instructionsTitle}>Cómo funcionan las intervenciones</Text>
          <Text style={styles.instructionsText}>
            Las intervenciones crean un espacio de reflexión entre el impulso de
            abrir una app y la acción de hacerlo. Esto te ayuda a tomar decisiones
            más conscientes sobre tu uso del teléfono.
          </Text>
        </Card>

        {/* Master Toggle */}
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Activar Intervenciones</Text>
              <Text style={styles.settingDescription}>
                Agrega pausas conscientes antes de desbloquear apps
              </Text>
            </View>
            <Switch
              value={config.enabled}
              onValueChange={handleToggleEnabled}
              trackColor={{
                false: colors.separator,
                true: colors.primary,
              }}
              thumbColor={colors.white}
            />
          </View>
        </Card>

        {/* Breathing Exercise Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejercicio de Respiración</Text>
          <Card style={styles.card}>
            <View style={styles.settingContent}>
              <View style={styles.settingHeader}>
                <Text style={styles.settingLabel}>Duración</Text>
                <Text style={styles.settingValue}>
                  {config.breathingDuration}s
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={30}
                step={1}
                value={config.breathingDuration}
                onValueChange={handleBreathingDurationChange}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.separator}
                thumbTintColor={colors.primary}
                disabled={!config.enabled}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>5s</Text>
                <Text style={styles.sliderLabel}>30s</Text>
              </View>
            </View>
          </Card>
          <Text style={styles.sectionDescription}>
            Un ejercicio de respiración guiada para crear una pausa consciente.
            Ajusta entre 5 y 30 segundos según tu preferencia.
          </Text>
        </View>

        {/* Intention Prompt Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pregunta de Intención</Text>
          <Card style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Preguntar Intención</Text>
                <Text style={styles.settingDescription}>
                  Te pregunta por qué quieres abrir la app
                </Text>
              </View>
              <Switch
                value={config.requireIntention}
                onValueChange={handleToggleIntention}
                trackColor={{
                  false: colors.separator,
                  true: colors.primary,
                }}
                thumbColor={colors.white}
                disabled={!config.enabled}
              />
            </View>
          </Card>
          <Text style={styles.sectionDescription}>
            Fomenta la toma de decisiones conscientes. Te ayuda a reflexionar si
            realmente necesitas abrir la app.
          </Text>
        </View>

        {/* Alternative Suggestions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sugerencias de Alternativas</Text>
          <Card style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Mostrar Alternativas</Text>
                <Text style={styles.settingDescription}>
                  Sugiere actividades más saludables
                </Text>
              </View>
              <Switch
                value={config.showAlternatives}
                onValueChange={handleToggleAlternatives}
                trackColor={{
                  false: colors.separator,
                  true: colors.primary,
                }}
                thumbColor={colors.white}
                disabled={!config.enabled}
              />
            </View>
          </Card>
          <Text style={styles.sectionDescription}>
            Ofrece alternativas productivas en lugar de distracciones. Te da ideas
            de otras cosas que podrías hacer.
          </Text>
        </View>

        {/* Tips Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoTitle}>Consejos de Uso</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Empieza con el ejercicio de respiración de 8-10 segundos
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                La pregunta de intención es muy efectiva para redes sociales
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Puedes desactivar las intervenciones y solo usar el bloqueo básico
              </Text>
            </View>
          </View>
        </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 17,
    color: colors.textSecondary,
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
  instructionsCard: {
    padding: spacing.lg,
    backgroundColor: colors.primary + '10',
    marginBottom: spacing.xl,
  },
  instructionsIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  instructionsText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingContent: {
    padding: spacing.lg,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  settingValue: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? -spacing.sm : spacing.xs,
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.textTertiary,
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
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 20,
    color: colors.primary,
    marginRight: spacing.sm,
    lineHeight: 22,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

