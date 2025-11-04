import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, typography } from '../theme';

interface IntentionInputProps {
  appName: string;
  onSubmit: (intention: string) => void;
  onSkip: () => void;
}

export const IntentionInput: React.FC<IntentionInputProps> = ({ appName, onSubmit, onSkip }) => {
  const [intention, setIntention] = useState('');

  const handleSubmit = () => {
    if (intention.trim()) {
      onSubmit(intention.trim());
    } else {
      onSkip();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>¿Por qué quieres abrir {appName}?</Text>

      <Text style={styles.subtitle}>Tómate un momento para reflexionar sobre tu intención</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe tu razón aquí..."
        placeholderTextColor={colors.muted}
        value={intention}
        onChangeText={setIntention}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        autoFocus
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton label="Continuar" onPress={handleSubmit} disabled={!intention.trim()} />
        <PrimaryButton label="Omitir" onPress={onSkip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  question: {
    fontSize: typography.heading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    minHeight: 120,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceAlt,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
});


