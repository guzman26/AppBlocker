import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
  return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 0.5,
    borderColor: colors.separator,
  },
});
