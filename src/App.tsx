import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { DashboardScreen } from './screens/DashboardScreen';
import { colors } from './theme';

type RootStackParamList = {
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
