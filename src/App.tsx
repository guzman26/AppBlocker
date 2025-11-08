import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './screens/HomeScreen';
import { InterventionSettingsScreen } from './screens/InterventionSettingsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { CupertinoTabBar } from './components/CupertinoTabBar';
import { colors } from './theme';

type RootTabParamList = {
  Home: undefined;
  Interventions: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.secondaryBackground,
    text: colors.textPrimary,
    border: colors.separator,
    notification: colors.primary,
  },
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          backgroundColor={colors.background}
        />
        <Tab.Navigator
          tabBar={(props) => <CupertinoTabBar {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Interventions" component={InterventionSettingsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
