import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const ANDROID_CHANNEL_ID = 'focus-guardian-alerts';

const NOTIFICATION_HANDLER: Notifications.NotificationHandler = {
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
};

const isProvisionalGranted = (
  settings: Notifications.NotificationPermissionsStatus
): boolean => {
  if (settings.granted) {
    return true;
  }

  if (settings.ios) {
    return (
      settings.ios.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
      settings.ios.status === Notifications.IosAuthorizationStatus.EPHEMERAL
    );
  }

  return false;
};

class FocusGuardianService {
  private initialized = false;

  private scheduledReminderId: string | null = null;

  async initializeAsync(): Promise<void> {
    if (this.initialized) {
      return;
    }

    Notifications.setNotificationHandler(NOTIFICATION_HANDLER);

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
          name: 'Focus Guardian',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 200, 250, 200],
          lightColor: '#5E5CE6',
          showBadge: false,
          enableLights: true,
          enableVibrate: true,
        });
      } catch (error) {
        console.error('Error configuring Android notification channel', error);
      }
    }

    this.initialized = true;
  }

  async ensurePermissionsAsync(): Promise<boolean> {
    try {
      await this.initializeAsync();

      if (!Device.isDevice) {
        console.warn('Las notificaciones requieren un dispositivo físico para funcionar.');
        return true;
      }

      let settings = await Notifications.getPermissionsAsync();
      let granted = settings.granted || isProvisionalGranted(settings);

      if (!granted) {
        settings = await Notifications.requestPermissionsAsync();
        granted = settings.granted || isProvisionalGranted(settings);
      }

      return granted;
    } catch (error) {
      console.error('Error al solicitar permisos de notificaciones', error);
      return false;
    }
  }

  async sendGuardianAlertAsync(sessionName: string): Promise<boolean> {
    try {
      const hasPermission = await this.ensurePermissionsAsync();
      if (!hasPermission) {
        return false;
      }

      await Notifications.presentNotificationAsync({
        title: 'Permanece enfocado',
        body: `Detectamos que saliste de ${sessionName}. Regresa para mantener el bloqueo activo.`,
        sound: Device.osName === 'iOS' ? 'default' : undefined,
        data: {
          type: 'guardian-warning',
          sessionName,
        },
      });

      return true;
    } catch (error) {
      console.error('Error enviando la alerta de guardian', error);
      return false;
    }
  }

  async scheduleReturnReminderAsync(
    minutes: number,
    sessionName: string
  ): Promise<boolean> {
    try {
      const hasPermission = await this.ensurePermissionsAsync();
      if (!hasPermission) {
        return false;
      }

      if (this.scheduledReminderId) {
        await Notifications.cancelScheduledNotificationAsync(this.scheduledReminderId);
      }

      const content: Notifications.NotificationContentInput = {
        title: 'Seguimos protegiendo tu enfoque',
        body: `Si vuelves a ${sessionName}, reforzaremos la sesión de bloqueo.`,
        sound: Device.osName === 'iOS' ? 'default' : undefined,
        data: {
          type: 'guardian-reminder',
          sessionName,
        },
      };

      const trigger: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: minutes * 60,
        repeats: false,
      };

      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });

      this.scheduledReminderId = id;

      return true;
    } catch (error) {
      console.error('Error programando el recordatorio del guardian', error);
      return false;
    }
  }

  async cancelScheduledRemindersAsync(): Promise<void> {
    try {
      if (this.scheduledReminderId) {
        await Notifications.cancelScheduledNotificationAsync(this.scheduledReminderId);
        this.scheduledReminderId = null;
      }
    } catch (error) {
      console.error('Error cancelando recordatorios del guardian', error);
    }
  }
}

export default new FocusGuardianService();

