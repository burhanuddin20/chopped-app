import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'button' | 'link';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  icon?: string;
}

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    storeHistory: true,
    notifications: true,
    darkMode: true,
    analytics: false,
  });

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024',
    analysesCompleted: 3,
  };

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => navigation.navigate('Welcome')
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            navigation.navigate('Welcome');
          }
        },
      ]
    );
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'profile',
      title: 'Edit Profile',
      subtitle: 'Update your name and photo',
      type: 'button',
      icon: '👤',
      onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
    },
    {
      id: 'storeHistory',
      title: 'Store Analysis History',
      subtitle: 'Save your past analyses for progress tracking',
      type: 'toggle',
      value: settings.storeHistory,
      onToggle: (value) => handleToggle('storeHistory', value),
    },
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Get reminders and updates',
      type: 'toggle',
      value: settings.notifications,
      onToggle: (value) => handleToggle('notifications', value),
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      subtitle: 'Use dark theme (always enabled)',
      type: 'toggle',
      value: settings.darkMode,
      onToggle: (value) => handleToggle('darkMode', value),
    },
    {
      id: 'analytics',
      title: 'Analytics',
      subtitle: 'Help improve the app with anonymous data',
      type: 'toggle',
      value: settings.analytics,
      onToggle: (value) => handleToggle('analytics', value),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      type: 'link',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy coming soon!'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      type: 'link',
      onPress: () => Alert.alert('Terms of Service', 'Terms of service coming soon!'),
    },
    {
      id: 'support',
      title: 'Support',
      subtitle: 'Get help and contact us',
      type: 'button',
      icon: '💬',
      onPress: () => Alert.alert('Support', 'Support coming soon!'),
    },
    {
      id: 'about',
      title: 'About Chopped',
      subtitle: 'Version 1.0.0',
      type: 'button',
      icon: 'ℹ️',
      onPress: () => Alert.alert('About', 'Chopped v1.0.0\nAI-powered appearance analysis'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <Card key={item.id} style={styles.settingCard}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={item.onPress}
          disabled={item.type === 'toggle'}
        >
          <View style={styles.settingContent}>
            {item.icon && <Text style={styles.settingIcon}>{item.icon}</Text>}
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
          
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={theme.colors.text}
            />
          )}
          
          {item.type === 'link' && (
            <Text style={styles.linkArrow}>›</Text>
          )}
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>
                {profileData.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profileData.name}</Text>
              <Text style={styles.profileEmail}>{profileData.email}</Text>
              <Text style={styles.profileStats}>
                Member since {profileData.memberSince} • {profileData.analysesCompleted} analyses
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {settingsItems.slice(0, 1).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settingsItems.slice(1, 5).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          {settingsItems.slice(5, 9).map(renderSettingItem)}
        </View>

        {/* Danger Zone */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Card style={[styles.settingCard, styles.dangerCard]}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              size="medium"
              style={styles.dangerButton}
            />
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="outline"
              size="medium"
              style={[styles.dangerButton, styles.deleteButton]}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  profileCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    ...theme.typography.h2,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  profileStats: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  settingsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  settingCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  linkArrow: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
  },
  dangerCard: {
    borderColor: theme.colors.error,
  },
  dangerButton: {
    marginBottom: theme.spacing.sm,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});