import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, spacing, typography } from '../theme';

// iOS-style icon components using unicode symbols
const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Dashboard':
        return focused ? '●' : '○';
      case 'Analytics':
        return '▇';
      case 'Websites':
        return '◐';
      case 'Focus':
        return '◉';
      default:
        return '·';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconFocused]}>{getIcon()}</Text>
    </View>
  );
};

const getTabLabel = (routeName: string): string => {
  switch (routeName) {
    case 'Dashboard':
      return 'Inicio';
    case 'Analytics':
      return 'Análisis';
    case 'Websites':
      return 'Sitios';
    case 'Focus':
      return 'Focus';
    default:
      return routeName;
  }
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

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
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <TabIcon name={route.name} focused={isFocused} />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>{getTabLabel(route.name)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.separator,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 2,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: colors.muted,
    fontWeight: '400',
  },
  iconFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
  label: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
});


