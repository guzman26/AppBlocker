import React from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusMode } from '../hooks/useFocusMode';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, typography } from '../theme';
import type { FocusMode } from '../types';

export const FocusModeScreen: React.FC = () => {
  const { focusModes, activeFocusMode, loading, syncWithFocusMode, refresh } = useFocusMode();

  const handleSync = async (focusMode: FocusMode) => {
    try {
      await syncWithFocusMode(focusMode.id);
      Alert.alert(
        'Sincronizado',
        `Tus bloqueos ahora se activarán automáticamente cuando uses el Focus Mode "${focusMode.name}"`,
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo sincronizar con el Focus Mode');
    }
  };

  const renderFocusMode = ({ item }: { item: FocusMode }) => {
    const isActive = item.id === activeFocusMode;

    return (
      <Card>
        <View style={styles.focusModeContainer}>
          <View style={styles.focusModeInfo}>
            <Text style={styles.focusModeName}>{item.name}</Text>
            {isActive && <Text style={styles.activeLabel}>Sincronizado</Text>}
          </View>
          <PrimaryButton
            label={isActive ? 'Activo' : 'Sincronizar'}
            onPress={() => handleSync(item)}
            disabled={isActive}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Focus Modes</Text>
            <Text style={styles.subtitle}>
              Sincroniza tus bloqueos con los Focus Modes de iOS para una experiencia integrada
            </Text>

            <Card>
              <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
              <Text style={styles.infoText}>
                Cuando sincronizas un Focus Mode, tus aplicaciones bloqueadas se activarán automáticamente cuando ese
                modo esté activo en iOS.
              </Text>
              <Text style={styles.infoText}>
                Esto te permite coordinar tus bloqueos con las configuraciones nativas de tu iPhone para mayor
                consistencia.
              </Text>
            </Card>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Focus Modes disponibles</Text>
            </View>
          </View>
        }
        data={focusModes}
        keyExtractor={(item) => item.id}
        renderItem={renderFocusMode}
        ListEmptyComponent={
          !loading ? (
            <Card>
              <Text style={styles.emptyText}>No hay Focus Modes disponibles</Text>
              <Text style={styles.emptySubtext}>Configura Focus Modes en la configuración de iOS primero</Text>
            </Card>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  infoTitle: {
    fontSize: typography.subheading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  listHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  listTitle: {
    fontSize: typography.subheading,
    fontWeight: '600',
    color: colors.text,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  focusModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focusModeInfo: {
    flex: 1,
  },
  focusModeName: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activeLabel: {
    fontSize: typography.caption,
    color: colors.accent,
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.caption,
    color: colors.muted,
    textAlign: 'center',
  },
});


