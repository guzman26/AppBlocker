import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components';
import { colors, spacing } from '../theme';

const APP_VERSION = '0.1.0';

export const SettingsScreen: React.FC = () => {
  const handleOpenGitHub = () => {
    Linking.openURL('https://github.com');
  };

  const handleOpenPrivacy = () => {
    // Add privacy policy link if needed
    console.log('Privacy policy');
  };

  const handleOpenSupport = () => {
    Linking.openURL('mailto:support@example.com');
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
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>Información y ayuda sobre la app</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <Card style={styles.card}>
            <View style={styles.aboutContent}>
              <Text style={styles.appIcon}>🛡️</Text>
              <Text style={styles.appName}>AppBlocker</Text>
              <Text style={styles.appTagline}>Bloqueo consciente de apps</Text>
              <Text style={styles.appVersion}>Versión {APP_VERSION}</Text>
            </View>
          </Card>
        </View>

        {/* How to Use Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guía de Uso Completa</Text>
          
          <Card style={styles.guideCard}>
            <Text style={styles.guideStep}>1️⃣ Otorga Permisos</Text>
            <Text style={styles.guideText}>
              Primero, otorga acceso a Screen Time. Esto permite a la app bloquear
              aplicaciones usando el sistema de iOS.
            </Text>
          </Card>

          <Card style={styles.guideCard}>
            <Text style={styles.guideStep}>2️⃣ Selecciona Apps</Text>
            <Text style={styles.guideText}>
              Toca "Seleccionar Apps" en la pestaña Home. Se abrirá el selector
              nativo de iOS donde puedes elegir qué apps quieres bloquear.
            </Text>
          </Card>

          <Card style={styles.guideCard}>
            <Text style={styles.guideStep}>3️⃣ Activa el Bloqueo</Text>
            <Text style={styles.guideText}>
              Usa el interruptor de bloqueo para activar/desactivar. Cuando está
              activo, iOS mostrará un escudo al intentar abrir apps bloqueadas.
            </Text>
          </Card>

          <Card style={styles.guideCard}>
            <Text style={styles.guideStep}>4️⃣ Configura Intervenciones</Text>
            <Text style={styles.guideText}>
              Ve a la pestaña "Interventions" para configurar ejercicios de
              respiración y preguntas de intención. Esto agrega pausas conscientes
              antes de desbloquear.
            </Text>
          </Card>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cómo Funciona</Text>
          <Card style={styles.card}>
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                AppBlocker usa la Screen Time API de Apple para bloquear apps.
                Es el mismo sistema que usa iOS para el control parental, por lo
                que es totalmente seguro y nativo.
              </Text>
              <Text style={[styles.infoText, styles.infoTextSpaced]}>
                La filosofía está inspirada en OneSec: en lugar de restricciones
                rígidas, agrega "fricción consciente" mediante pausas de
                respiración y reflexión.
              </Text>
              <Text style={[styles.infoText, styles.infoTextSpaced]}>
                Esto te ayuda a tomar decisiones más conscientes sobre tu uso del
                teléfono sin sentirte frustrado por bloqueos permanentes.
              </Text>
            </View>
          </Card>
        </View>

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requisitos</Text>
          <Card style={styles.card}>
            <View style={styles.requirementItem}>
              <Text style={styles.requirementIcon}>📱</Text>
              <View style={styles.requirementText}>
                <Text style={styles.requirementTitle}>iOS 16 o superior</Text>
                <Text style={styles.requirementDescription}>
                  Necesario para usar la Screen Time API
                </Text>
              </View>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={styles.requirementItem}>
              <Text style={styles.requirementIcon}>🔐</Text>
              <View style={styles.requirementText}>
                <Text style={styles.requirementTitle}>Permisos de Screen Time</Text>
                <Text style={styles.requirementDescription}>
                  Otorga el permiso en la pestaña Home
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <Card style={styles.card}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={handleOpenGitHub}
            >
              <Text style={styles.linkText}>Ver en GitHub</Text>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>
          </Card>
          <Card style={styles.card}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={handleOpenSupport}
            >
              <Text style={styles.linkText}>Contactar Soporte</Text>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Hecho con enfoque e intención
          </Text>
        </View>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.sm,
  },
  aboutContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  appIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  appTagline: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  appVersion: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  guideCard: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  guideStep: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  guideText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoContent: {
    padding: spacing.lg,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoTextSpaced: {
    marginTop: spacing.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  requirementIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  requirementText: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  requirementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  linkText: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '500',
  },
  linkArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: 13,
    color: colors.textTertiary,
  },
});

