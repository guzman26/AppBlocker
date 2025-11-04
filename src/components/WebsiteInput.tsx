import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, typography } from '../theme';

interface WebsiteInputProps {
  onAdd: (domain: string) => void;
}

export const WebsiteInput: React.FC<WebsiteInputProps> = ({ onAdd }) => {
  const [domain, setDomain] = useState('');

  const handleAdd = () => {
    if (domain.trim()) {
      const cleanDomain = domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];

      if (cleanDomain) {
        onAdd(cleanDomain);
        setDomain('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ejemplo.com"
        placeholderTextColor={colors.muted}
        value={domain}
        onChangeText={setDomain}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <PrimaryButton label="Agregar" onPress={handleAdd} disabled={!domain.trim()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.surfaceAlt,
  },
});


