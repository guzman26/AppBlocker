import React, { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppBlocker } from '../hooks/useAppBlocker';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing, typography } from '../theme';
import type { BlockSchedule } from '../native/AppBlockerModule';

const createSchedule = (start: Date, end: Date): BlockSchedule => ({
  identifier: 'daily-block',
  startDate: start.toISOString(),
  endDate: end.toISOString(),
  repeatsDaily: true,
});

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export const DashboardScreen: React.FC = () => {
  const [state, actions] = useAppBlocker();
  const [startTime, setStartTime] = useState(() => {
    const start = new Date();
    start.setHours(21, 0, 0, 0);
    return start;
  });
  const [endTime, setEndTime] = useState(() => {
    const end = new Date();
    end.setHours(7, 0, 0, 0);
    return end;
  });

  const hasSelection = state.selectedApps.length > 0;

  const description = useMemo(() => {
    if (!state.authorized) {
      return 'Necesitas habilitar permisos de Screen Time para gestionar bloqueos.';
    }

    if (!hasSelection) {
      return 'Selecciona las apps que quieras bloquear durante tus horarios de descanso.';
    }

    if (state.schedules.length === 0) {
      return 'Configura una rutina con el horario en el que deseas restringir el uso de las aplicaciones seleccionadas.';
    }

    return 'Los bloqueos están activos según tu programación. Si necesitas ajustar la rutina, modifica los horarios o elimina las restricciones.';
  }, [state.authorized, hasSelection, state.schedules.length]);

  const handleTimeChange = (setter: (date: Date) => void) => (
    _event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (date) {
      setter(date);
    }
  };

  const handleSchedule = async () => {
    const schedule = createSchedule(startTime, endTime);
    await actions.scheduleBlock(schedule);
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>AppBlocker</Text>
          <Text style={styles.subtitle}>{description}</Text>

          <Card>
            <Text style={styles.sectionTitle}>Permisos</Text>
            <Text style={styles.sectionDescription}>
              {state.authorized
                ? 'Los permisos de Screen Time están activos.'
                : 'Solicita acceso a Screen Time para continuar.'}
            </Text>
            <PrimaryButton
              label={state.authorized ? 'Refrescar estado' : 'Solicitar permisos'}
              onPress={actions.requestAuthorization}
            />
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Aplicaciones bloqueadas</Text>
            <Text style={styles.sectionDescription}>
              {hasSelection
                ? 'Estas apps serán bloqueadas durante la rutina.'
                : 'Aún no has elegido aplicaciones.'}
            </Text>
            <PrimaryButton label="Elegir aplicaciones" onPress={actions.pickApps} />
          </Card>

          {hasSelection && (
            <Card>
              <Text style={styles.sectionTitle}>Rutina diaria</Text>
              <Text style={styles.sectionDescription}>
                Define el intervalo en el que las apps permanecerán bloqueadas.
              </Text>
              <View style={styles.timeRow}>
                <View style={styles.timeColumn}>
                  <Text style={styles.caption}>Inicio</Text>
                  {Platform.OS === 'ios' ? (
                    <DateTimePicker
                      mode="time"
                      value={startTime}
                      onChange={handleTimeChange(setStartTime)}
                    />
                  ) : (
                    <Text style={styles.timeValue}>{formatTime(startTime)}</Text>
                  )}
                </View>
                <View style={styles.timeColumn}>
                  <Text style={styles.caption}>Fin</Text>
                  {Platform.OS === 'ios' ? (
                    <DateTimePicker mode="time" value={endTime} onChange={handleTimeChange(setEndTime)} />
                  ) : (
                    <Text style={styles.timeValue}>{formatTime(endTime)}</Text>
                  )}
                </View>
              </View>
              <PrimaryButton label="Guardar rutina" onPress={handleSchedule} />
              {state.schedules.length > 0 && (
                <PrimaryButton label="Eliminar restricciones" onPress={actions.removeAllBlocks} />
              )}
            </Card>
          )}
        </View>
      }
      data={state.selectedApps}
      keyExtractor={(item) => item.bundleIdentifier}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.appName}>{item.displayName}</Text>
          <Text style={styles.caption}>{item.bundleIdentifier}</Text>
          <Text style={styles.caption}>Categoría: {item.category}</Text>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  timeColumn: {
    flex: 1,
  },
  caption: {
    fontSize: typography.caption,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  timeValue: {
    fontSize: typography.subheading,
    color: colors.text,
    fontWeight: '600',
  },
  appName: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
});
