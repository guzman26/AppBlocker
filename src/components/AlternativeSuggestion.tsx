import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Alternative {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

interface AlternativeSuggestionProps {
  onSelectAlternative: (id: string) => void;
  onContinueAnyway: () => void;
}

const ALTERNATIVES: Alternative[] = [
  {
    id: 'read',
    title: 'Leer un libro',
    description: 'Abre tu libro favorito',
    emoji: '📚',
  },
  {
    id: 'walk',
    title: 'Dar un paseo',
    description: 'Sal a tomar aire fresco',
    emoji: '🚶',
  },
  {
    id: 'water',
    title: 'Tomar agua',
    description: 'Hidrátate',
    emoji: '💧',
  },
  {
    id: 'message',
    title: 'Mensaje a un amigo',
    description: 'Conecta con alguien',
    emoji: '💬',
  },
];

export const AlternativeSuggestion: React.FC<AlternativeSuggestionProps> = ({
  onSelectAlternative,
  onContinueAnyway,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué tal si intentas algo diferente?</Text>
      <Text style={styles.subtitle}>Estas alternativas podrían ser más productivas</Text>

      <View style={styles.alternativesContainer}>
        {ALTERNATIVES.map((alternative) => (
          <Pressable
            key={alternative.id}
            style={styles.alternativeCard}
            onPress={() => onSelectAlternative(alternative.id)}
          >
            <Text style={styles.emoji}>{alternative.emoji}</Text>
            <View style={styles.alternativeContent}>
              <Text style={styles.alternativeTitle}>{alternative.title}</Text>
              <Text style={styles.alternativeDescription}>{alternative.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.continueButton} onPress={onContinueAnyway}>
        <Text style={styles.continueText}>Continuar de todas formas</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  alternativesContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeTitle: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  alternativeDescription: {
    fontSize: typography.caption,
    color: colors.muted,
  },
  continueButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  continueText: {
    fontSize: typography.body,
    color: colors.muted,
    textDecorationLine: 'underline',
  },
});


