import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';

const icons: Record<string, { active: string; inactive: string }> = {
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  AppBlocker: { active: 'lock-closed', inactive: 'lock-closed-outline' },
  Schedule: { active: 'calendar', inactive: 'calendar-outline' },
  Insights: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  HowItWorks: { active: 'book', inactive: 'book-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

const labels: Record<string, string> = {
  Dashboard: 'Resumen',
  AppBlocker: 'Bloqueo',
  Schedule: 'Horarios',
  Insights: 'Insights',
  HowItWorks: 'Guía',
  Settings: 'Ajustes',
};

export const CupertinoTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
      <View style={styles.separator} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = labels[route.name] || route.name;
        const isFocused = state.index === index;
        const iconSet = icons[route.name] || { active: 'square', inactive: 'square-outline' };
        const iconName = isFocused ? iconSet.active : iconSet.inactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName as any}
              size={24}
              color={isFocused ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? colors.primary : colors.textSecondary },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingTop: 8,
  },
  separator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.separator,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    ...typography.footnote,
    fontSize: 10,
    marginTop: 2,
  },
});


