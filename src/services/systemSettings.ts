import { Linking, Platform } from 'react-native';

const IOS_SCREEN_TIME_URL = 'App-Prefs:SCREEN_TIME';

export const openUsageAccessSettings = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      if (typeof Linking.openSettings === 'function') {
        await Linking.openSettings();
        return true;
      }
      return false;
    }

    if (Platform.OS === 'ios') {
      const canOpen = await Linking.canOpenURL(IOS_SCREEN_TIME_URL);
      if (canOpen) {
        await Linking.openURL(IOS_SCREEN_TIME_URL);
        return true;
      }
      return false;
    }

    return false;
  } catch (error) {
    console.error('Error abriendo la configuración de uso de apps', error);
    return false;
  }
};

export const openNotificationPreferences = async (): Promise<boolean> => {
  try {
    const settingsUrl = Platform.OS === 'ios' ? 'app-settings:' : undefined;
    if (Platform.OS === 'android') {
      if (typeof Linking.openSettings === 'function') {
        await Linking.openSettings();
        return true;
      }
      return false;
    }

    if (settingsUrl) {
      const canOpen = await Linking.canOpenURL(settingsUrl);
      if (!canOpen) {
        return false;
      }

      await Linking.openURL(settingsUrl);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error abriendo los ajustes de notificaciones', error);
    return false;
  }
};

