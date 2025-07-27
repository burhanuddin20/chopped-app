import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PremiumUpgradeModal } from '../components/PremiumUpgradeModal';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { isFeatureEnabled } from '../config/featureFlags';
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
  premium?: boolean;
}

export default function SettingsScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { isPremium, unlockPremium, isLoading } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Check if freemium features are enabled
  const freemiumEnabled = isFeatureEnabled('FREEMIUM_ENABLED');
  const upgradeModalEnabled = isFeatureEnabled('PREMIUM_UPGRADE_MODAL');
  const settingsRestrictionsEnabled = isFeatureEnabled('PREMIUM_SETTINGS_RESTRICTIONS');
  
  const [settings, setSettings] = useState({
    storeHistory: true,
    notifications: true,
    darkMode: true,
    analytics: false,
  });

  const profileData = {
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@example.com',
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
          onPress: async () => {
            await signOut();
            navigation.navigate('Welcome');
          }
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

  const handleUpgrade = async () => {
    setShowUpgradeModal(false);
    await unlockPremium();
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'subscription',
      title: isPremium ? 'Premium Active' : 'Upgrade to Premium',
      subtitle: isPremium ? 'You have access to all features' : 'Unlock detailed feedback and insights',
      type: 'button',
      icon: isPremium ? '👑' : '⭐',
      onPress: () => {
        if (!isPremium && freemiumEnabled && upgradeModalEnabled) {
          setShowUpgradeModal(true);
        }
      },
    },
    {
      id: 'profile',
      title: 'Edit Profile',
      subtitle: 'Update your name and photo',
      type: 'button',
      icon: '👤',
      onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
      premium: settingsRestrictionsEnabled,
    },
    {
      id: 'storeHistory',
      title: 'Store Analysis History',
      subtitle: 'Save your past analyses for progress tracking',
      type: 'toggle',
      value: settings.storeHistory,
      onToggle: (value) => handleToggle('storeHistory', value),
      premium: settingsRestrictionsEnabled,
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
      subtitle: 'Help us improve by sharing usage data',
      type: 'toggle',
      value: settings.analytics,
      onToggle: (value) => handleToggle('analytics', value),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      type: 'button',
      icon: '🔒',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy coming soon!'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      type: 'button',
      icon: '📄',
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
      id: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      type: 'button',
      icon: '🚪',
      onPress: handleLogout,
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    // If freemium is disabled, treat all features as available
    const isPremiumFeature = item.premium && !isPremium && freemiumEnabled && settingsRestrictionsEnabled;
    
    return (
      <Card key={item.id} style={[styles.settingCard, isPremiumFeature && styles.premiumCard]}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={item.onPress}
          disabled={item.type === 'toggle' || isPremiumFeature}
        >
          <View style={styles.settingContent}>
            {item.icon && <Text style={styles.settingIcon}>{item.icon}</Text>}
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, isPremiumFeature && styles.premiumTitle]}>
                {item.title}
                {isPremiumFeature && ' 🔒'}
              </Text>
              {item.subtitle && (
                <Text style={[styles.settingSubtitle, isPremiumFeature && styles.premiumSubtitle]}>
                  {item.subtitle}
                </Text>
              )}
            </View>
          </View>
          
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={theme.colors.text}
              disabled={isPremiumFeature}
            />
          )}
          
          {item.type === 'link' && (
            <Text style={styles.linkArrow}>›</Text>
          )}
          
          {item.type === 'button' && !isPremiumFeature && (
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
      <PremiumUpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        isLoading={isLoading}
      />
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
  premiumCard: {
    opacity: 0.7,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  premiumTitle: {
    color: theme.colors.textSecondary,
  },
  premiumSubtitle: {
    color: theme.colors.textMuted,
  },
});