import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { BreathingExercise } from '../components/BreathingExercise';
import { IntentionInput } from '../components/IntentionInput';
import { AlternativeSuggestion } from '../components/AlternativeSuggestion';
import { useIntervention } from '../hooks/useIntervention';
import { colors, spacing, typography } from '../theme';

interface IntentionPromptScreenProps {
  visible: boolean;
  appName: string;
  appBundleId: string;
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 'breathing' | 'intention' | 'alternatives';

export const IntentionPromptScreen: React.FC<IntentionPromptScreenProps> = ({
  visible,
  appName,
  appBundleId,
  onComplete,
  onCancel,
}) => {
  const { config, recordIntention } = useIntervention();
  const [step, setStep] = useState<Step>('breathing');

  const handleBreathingComplete = () => {
    if (config.requireIntention) {
      setStep('intention');
    } else if (config.showAlternatives) {
      setStep('alternatives');
    } else {
      onComplete();
    }
  };

  const handleIntentionSubmit = async (intention: string) => {
    await recordIntention(appBundleId, appName, intention);

    if (config.showAlternatives) {
      setStep('alternatives');
    } else {
      onComplete();
    }
  };

  const handleIntentionSkip = () => {
    if (config.showAlternatives) {
      setStep('alternatives');
    } else {
      onComplete();
    }
  };

  const handleAlternativeSelect = (alternativeId: string) => {
    console.log('User selected alternative:', alternativeId);
    onCancel();
  };

  const handleContinueAnyway = () => {
    onComplete();
  };

  const handleClose = () => {
    setStep('breathing');
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.headerSubtitle}>Pausa de reflexión</Text>
        </View>

        {step === 'breathing' && (
          <BreathingExercise duration={config.breathingDuration} onComplete={handleBreathingComplete} />
        )}

        {step === 'intention' && (
          <IntentionInput appName={appName} onSubmit={handleIntentionSubmit} onSkip={handleIntentionSkip} />
        )}

        {step === 'alternatives' && (
          <AlternativeSuggestion onSelectAlternative={handleAlternativeSelect} onContinueAnyway={handleContinueAnyway} />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
    alignItems: 'center',
  },
  appName: {
    fontSize: typography.subheading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.caption,
    color: colors.muted,
  },
});


