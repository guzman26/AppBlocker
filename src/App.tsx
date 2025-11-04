import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { DashboardScreen } from './screens/DashboardScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { WebsiteBlockerScreen } from './screens/WebsiteBlockerScreen';
import { FocusModeScreen } from './screens/FocusModeScreen';
import { BottomTabBar } from './components/BottomTabBar';
import { colors } from './theme';

type RootTabParamList = {
  Dashboard: undefined;
  Analytics: undefined;
  Websites: undefined;
  Focus: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    text: colors.text,
    border: colors.surface,
    notification: colors.accent,
  },
};

const App: React.FC = () => {
  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar barStyle="light-content" />
      <Tab.Navigator
        tabBar={(props) => <BottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="Websites" component={WebsiteBlockerScreen} />
        <Tab.Screen name="Focus" component={FocusModeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
