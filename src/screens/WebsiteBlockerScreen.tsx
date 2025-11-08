import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useWebsiteBlocker } from '../hooks/useWebsiteBlocker';
import { Card } from '../components/Card';
import { WebsiteInput } from '../components/WebsiteInput';
import { colors, spacing, typography } from '../theme';

export const WebsiteBlockerScreen: React.FC = () => {
  const { websites, addWebsite, removeWebsite, loading } = useWebsiteBlocker();

  const handleAddWebsite = async (domain: string) => {
    try {
      await addWebsite(domain);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el sitio web');
    }
  };

  const handleRemoveWebsite = (domain: string) => {
    Alert.alert('Eliminar sitio web', `¿Deseas dejar de bloquear ${domain}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeWebsite(domain);
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el sitio web');
          }
        },
      },
    ]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Bloqueo de sitios web</Text>
            <Text style={styles.subtitle}>
              Los sitios web bloqueados no serán accesibles durante los horarios de tu rutina
            </Text>

            <Card>
              <Text style={styles.sectionTitle}>Agregar sitio web</Text>
              <Text style={styles.sectionDescription}>
                Ingresa el dominio del sitio que quieras bloquear (ej: facebook.com, twitter.com)
              </Text>
              <WebsiteInput onAdd={handleAddWebsite} />
            </Card>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Sitios bloqueados ({websites.length})</Text>
            </View>
          </View>
        }
        data={websites}
        keyExtractor={(item) => item.domain}
        renderItem={({ item }) => (
          <Pressable onLongPress={() => handleRemoveWebsite(item.domain)}>
            <Card>
              <View style={styles.websiteRow}>
                <View style={styles.websiteInfo}>
                  <Text style={styles.websiteDomain}>{item.domain}</Text>
                  <Text style={styles.websiteDate}>Agregado el {formatDate(item.addedAt)}</Text>
                </View>
                <Pressable style={styles.deleteButton} onPress={() => handleRemoveWebsite(item.domain)}>
                  <Text style={styles.deleteIcon}>✕</Text>
                </Pressable>
              </View>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <Card>
              <Text style={styles.emptyText}>No has bloqueado ningún sitio web todavía</Text>
              <Text style={styles.emptySubtext}>Agrega un dominio arriba para comenzar</Text>
            </Card>
          ) : null
        }
        contentContainerStyle={styles.listContent}
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
  },
  sectionTitle: {
    fontSize: typography.subheading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.md,
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
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  websiteInfo: {
    flex: 1,
  },
  websiteDomain: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  websiteDate: {
    fontSize: typography.caption,
    color: colors.muted,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 18,
    color: colors.muted,
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


