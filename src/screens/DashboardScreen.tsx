import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppBlocker, type BlockingPlan } from '../hooks/useAppBlocker';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { WeekdaySelector } from '../components/WeekdaySelector';
import { colors, spacing, typography } from '../theme';

const FOCUS_OPTIONS = [15, 25, 45, 60];

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const sortWeekdays = (days: number[]) => [...days].sort((a, b) => a - b);

export const DashboardScreen: React.FC = () => {
  const [state, actions] = useAppBlocker();
  const [startTime, setStartTime] = useState(() => new Date(state.plan.startTimeISO));
  const [endTime, setEndTime] = useState(() => new Date(state.plan.endTimeISO));
  const [selectedDays, setSelectedDays] = useState<number[]>(state.plan.weekdays);

  useEffect(() => {
    setStartTime(new Date(state.plan.startTimeISO));
    setEndTime(new Date(state.plan.endTimeISO));
    setSelectedDays(sortWeekdays(state.plan.weekdays));
  }, [state.plan]);

  const hasSelection = state.selectedApps.length > 0;
  const canSchedule = hasSelection && state.authorized && selectedDays.length > 0;
  const canStartFocus = state.authorized && hasSelection;

  const description = useMemo(() => {
    if (!state.authorized) {
      return 'Necesitas habilitar permisos de Screen Time para gestionar bloqueos.';
    }

    if (!hasSelection) {
      return 'Selecciona las apps que quieras bloquear y diseña una rutina que se adapte a tu estilo de vida.';
    }

    if (selectedDays.length === 0) {
      return 'Elige al menos un día para que el plan nocturno quede guardado.';
    }

    if (state.schedules.length === 0) {
      return 'Define una rutina diaria y actívala para que los bloqueos se enciendan automáticamente.';
    }

    return 'Tus bloqueos están activos y se sincronizan con la rutina configurada. Ajusta horarios o activa un foco instantáneo cuando lo necesites.';
  }, [state.authorized, hasSelection, selectedDays.length, state.schedules.length]);

  const handleTimeChange = (setter: (date: Date) => void) => (
    _event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (date) {
      setter(date);
    }
  };

  const handleToggleDay = (weekday: number) => {
    setSelectedDays((prev) => {
      const next = prev.includes(weekday) ? prev.filter((value) => value !== weekday) : [...prev, weekday];
      return sortWeekdays(next);
    });
  };

  const handleSchedulePlan = async () => {
    const plan: BlockingPlan = {
      startTimeISO: startTime.toISOString(),
      endTimeISO: endTime.toISOString(),
      weekdays: sortWeekdays(selectedDays),
    };

    await actions.schedulePlan(plan);
  };

  const planSummary = useMemo(() => {
    if (selectedDays.length === 0) {
      return 'Sin días seleccionados';
    }

    const dayNames = selectedDays
      .map((day) =>
        (
          {
            1: 'Domingo',
            2: 'Lunes',
            3: 'Martes',
            4: 'Miércoles',
            5: 'Jueves',
            6: 'Viernes',
            7: 'Sábado',
          } as const
        )[day],
      )
      .join(', ');

    return `${formatTime(startTime)} a ${formatTime(endTime)} · ${dayNames}`;
  }, [selectedDays, startTime, endTime]);

  const focusEndsAt = useMemo(() => {
    if (!state.focusSession) {
      return undefined;
    }

    return formatTime(new Date(state.focusSession.endsAtISO));
  }, [state.focusSession]);

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>AppBlocker</Text>
          <Text style={styles.subtitle}>{description}</Text>

          {state.lastEvent && (
            <Card>
              <Text style={styles.caption}>Último evento</Text>
              <Text style={styles.sectionDescription}>{state.lastEvent.message}</Text>
            </Card>
          )}

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

          <Card>
            <Text style={styles.sectionTitle}>Rutina inteligente</Text>
            <Text style={styles.sectionDescription}>
              Define el intervalo y los días en los que quieres desconectarte.
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
            <Text style={[styles.caption, styles.captionSpacing]}>Días activos</Text>
            <WeekdaySelector selected={selectedDays} onToggle={handleToggleDay} />
            <Text style={[styles.planSummary, styles.sectionDescription]}>{planSummary}</Text>
            <PrimaryButton
              label={state.schedules.length > 0 ? 'Actualizar rutina' : 'Guardar rutina'}
              onPress={handleSchedulePlan}
              disabled={!canSchedule}
            />
            {state.schedules.length > 0 && (
              <PrimaryButton label="Eliminar restricciones" onPress={actions.removeAllBlocks} />
            )}
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Bloqueo de foco inmediato</Text>
            <Text style={styles.sectionDescription}>
              Activa un bloqueo temporal cuando necesites máxima concentración.
            </Text>
            {focusEndsAt ? (
              <View style={styles.focusActiveContainer}>
                <Text style={styles.focusActiveLabel}>
                  Bloqueo activo hasta las {focusEndsAt}.
                </Text>
                <PrimaryButton label="Finalizar bloqueo" onPress={actions.cancelFocusSession} />
              </View>
            ) : (
              <View style={styles.focusOptionsRow}>
                {FOCUS_OPTIONS.map((minutes) => (
                  <Pressable
                    key={minutes}
                    style={[styles.focusOption, !canStartFocus && styles.focusOptionDisabled]}
                    onPress={() => actions.startFocusSession(minutes)}
                    disabled={!canStartFocus}
                  >
                    <Text style={styles.focusOptionLabel}>{minutes} min</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Card>
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
  captionSpacing: {
    marginBottom: spacing.sm,
  },
  timeValue: {
    fontSize: typography.subheading,
    color: colors.text,
    fontWeight: '600',
  },
  planSummary: {
    marginTop: spacing.md,
  },
  appName: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  focusOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  focusOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
  },
  focusOptionDisabled: {
    opacity: 0.4,
  },
  focusOptionLabel: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  focusActiveContainer: {
    gap: spacing.md,
  },
  focusActiveLabel: {
    fontSize: typography.body,
    color: colors.accent,
  },
});
