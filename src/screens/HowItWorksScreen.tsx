import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: readonly [string, string];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient }) => {
  return (
    <View style={styles.featureCard}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featureGradient}
      >
        <View style={styles.featureIconContainer}>
          <Ionicons name={icon as any} size={28} color={colors.white} />
        </View>
      </LinearGradient>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
};

interface StepItemProps {
  number: number;
  title: string;
  description: string;
}

const StepItem: React.FC<StepItemProps> = ({ number, title, description }) => {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
};

interface BenefitItemProps {
  icon: string;
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, text }) => {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon as any} size={20} color={colors.success} />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
};

export const HowItWorksScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.largeTitle}>Cómo funciona</Text>

        {/* Hero Banner */}
        <LinearGradient
          colors={['#667EEA', '#764BA2'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroIconContainer}>
            <Ionicons name="rocket" size={48} color={colors.white} />
          </View>
          <Text style={styles.heroTitle}>Recupera tu enfoque</Text>
          <Text style={styles.heroDescription}>
            AppBlocker te ayuda a mantener el control de tu tiempo digital con herramientas
            inteligentes de bloqueo y seguimiento.
          </Text>
        </LinearGradient>

        {/* Main Features */}
        <Text style={styles.sectionTitle}>Funcionalidades principales</Text>
        
        <View style={styles.featuresGrid}>
          <FeatureCard
            icon="lock-closed"
            title="Bloqueo inteligente"
            description="Bloquea apps distractoras durante tus sesiones de enfoque"
            gradient={['#0A84FF', '#5E5CE6'] as const}
          />
          <FeatureCard
            icon="calendar"
            title="Horarios automáticos"
            description="Programa bloqueos recurrentes según tu rutina diaria"
            gradient={['#AF52DE', '#FF2D55'] as const}
          />
          <FeatureCard
            icon="analytics"
            title="Insights detallados"
            description="Visualiza tu uso y progreso con métricas claras"
            gradient={['#34C759', '#64D2FF'] as const}
          />
          <FeatureCard
            icon="timer"
            title="Sesiones temporizadas"
            description="Crea sesiones de enfoque con duración personalizada"
            gradient={['#FF9500', '#FF3B30']}
          />
        </View>

        {/* How to Use */}
        <Text style={styles.sectionTitle}>Cómo empezar</Text>
        
        <View style={styles.stepsContainer}>
          <StepItem
            number={1}
            title="Autoriza el acceso"
            description="Permite que AppBlocker acceda a Screen Time para gestionar tus aplicaciones. Es seguro y privado, tus datos nunca salen de tu dispositivo."
          />
          <StepItem
            number={2}
            title="Selecciona apps para bloquear"
            description="Ve a la pestaña 'Bloqueo' y selecciona las aplicaciones que quieres limitar. Puedes elegir redes sociales, juegos o cualquier app que te distraiga."
          />
          <StepItem
            number={3}
            title="Configura tu horario"
            description="En 'Horarios', crea rutinas automáticas. Por ejemplo, bloquea redes sociales de 9 AM a 5 PM los días laborales."
          />
          <StepItem
            number={4}
            title="Inicia una sesión"
            description="Cuando necesites enfocarte, inicia una sesión temporizada. Elige la duración y las apps se bloquearán automáticamente."
          />
          <StepItem
            number={5}
            title="Revisa tu progreso"
            description="En 'Insights' verás tu puntuación de enfoque, tiempo productivo y cuántas distracciones has evitado."
          />
        </View>

        {/* Benefits */}
        <Text style={styles.sectionTitle}>Beneficios</Text>
        
        <View style={styles.benefitsContainer}>
          <BenefitItem
            icon="checkmark-circle"
            text="Mejora tu productividad hasta un 40%"
          />
          <BenefitItem
            icon="checkmark-circle"
            text="Reduce el tiempo en redes sociales"
          />
          <BenefitItem
            icon="checkmark-circle"
            text="Aumenta tu concentración y flow state"
          />
          <BenefitItem
            icon="checkmark-circle"
            text="Crea hábitos digitales saludables"
          />
          <BenefitItem
            icon="checkmark-circle"
            text="Recupera horas de tiempo productivo"
          />
          <BenefitItem
            icon="checkmark-circle"
            text="Duerme mejor sin notificaciones nocturnas"
          />
        </View>

        {/* Privacy Card */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIconContainer}>
            <Ionicons name="shield-checkmark" size={32} color={colors.success} />
          </View>
          <Text style={styles.privacyTitle}>Tu privacidad es primero</Text>
          <Text style={styles.privacyDescription}>
            Toda la información de tus apps y uso permanece en tu dispositivo. No recopilamos
            datos personales ni los compartimos con terceros. AppBlocker usa la API oficial
            de Apple Screen Time, diseñada con privacidad en mente.
          </Text>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Consejos para el éxito</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Comienza bloqueando solo 2-3 apps que más te distraen
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Programa sesiones cortas (30-60 min) al principio
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Usa "Desconexión Nocturna" para mejorar tu sueño
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Revisa tus insights semanalmente para ver tu progreso
              </Text>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
        
        <View style={styles.faqContainer}>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Puedo desbloquear apps en una emergencia?</Text>
            <Text style={styles.faqAnswer}>
              Sí, siempre puedes detener una sesión o desbloquear todas las apps desde la
              pestaña de Bloqueo.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Afecta al rendimiento de mi iPhone?</Text>
            <Text style={styles.faqAnswer}>
              No, AppBlocker usa APIs nativas de iOS que son muy eficientes y no consumen
              batería adicional.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Funciona sin conexión a internet?</Text>
            <Text style={styles.faqAnswer}>
              Sí, todas las funciones de bloqueo funcionan offline ya que todo ocurre
              localmente en tu dispositivo.
            </Text>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
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
  largeTitle: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: 16,
    paddingTop: 8,
  },
  
  // Hero Banner
  heroBanner: {
    borderRadius: 30,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  heroDescription: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Section Title
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 16,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 24,
    padding: 20,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  featureGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 6,
  },
  featureDescription: {
    ...typography.footnote,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Steps
  stepsContainer: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    ...typography.footnote,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Benefits
  benefitsContainer: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  benefitText: {
    ...typography.callout,
    color: colors.textPrimary,
    flex: 1,
  },

  // Privacy Card
  privacyCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: `${colors.success}40`,
  },
  privacyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  privacyTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  privacyDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: `${colors.caution}15`,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${colors.caution}40`,
  },
  tipsTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    ...typography.body,
    color: colors.caution,
    fontWeight: '700',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },

  // FAQ
  faqContainer: {
    gap: 12,
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 20,
    padding: 18,
  },
  faqQuestion: {
    ...typography.callout,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  bottomSpacer: {
    height: 20,
  },
});













