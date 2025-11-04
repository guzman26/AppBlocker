import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './theme';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AppBlocker</Text>
      <Text style={styles.subtitle}>La app está funcionando ✅</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.muted,
  },
});

export default App;

