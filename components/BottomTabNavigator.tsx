import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface TabItem {
  key: string;
  title: string;
  icon: string;
  screen: string;
}

interface BottomTabNavigatorProps {
  activeTab: string;
  onTabPress: (tabKey: string) => void;
}

export const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  activeTab,
  onTabPress,
}) => {
  const tabs: TabItem[] = [
    {
      key: 'home',
      title: 'Home',
      icon: '🏠',
      screen: 'Results',
    },
    {
      key: 'history',
      title: 'History',
      icon: '📊',
      screen: 'History',
    },
    {
      key: 'upload',
      title: 'Analyze',
      icon: '📷',
      screen: 'Upload',
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: '⚙️',
      screen: 'Settings',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
          ]}
          onPress={() => onTabPress(tab.screen)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.tabIcon,
            activeTab === tab.key && styles.activeTabIcon,
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.tabTitle,
            activeTab === tab.key && styles.activeTabTitle,
          ]}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20, // For safe area
    paddingTop: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  activeTab: {
    // Active state styling
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
  },
  tabTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  activeTabTitle: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});