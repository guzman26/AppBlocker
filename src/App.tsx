import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NewDashboardScreen } from './screens/NewDashboardScreen';
import { NewScheduleScreen } from './screens/NewScheduleScreen';
import { NewInsightsScreen } from './screens/NewInsightsScreen';
import { NewSettingsScreen } from './screens/NewSettingsScreen';
import { AppBlockerScreen } from './screens/AppBlockerScreen';
import { HowItWorksScreen } from './screens/HowItWorksScreen';
import { CupertinoTabBar } from './components/CupertinoTabBar';
import { colors } from './theme';

type RootTabParamList = {
  Dashboard: undefined;
  AppBlocker: undefined;
  Schedule: undefined;
  Insights: undefined;
  HowItWorks: undefined;
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
          <Tab.Screen name="Dashboard" component={NewDashboardScreen} />
          <Tab.Screen name="AppBlocker" component={AppBlockerScreen} />
          <Tab.Screen name="Schedule" component={NewScheduleScreen} />
          <Tab.Screen name="Insights" component={NewInsightsScreen} />
          <Tab.Screen name="HowItWorks" component={HowItWorksScreen} />
          <Tab.Screen name="Settings" component={NewSettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
