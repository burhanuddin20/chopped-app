import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabNavigator } from '../components/BottomTabNavigator';
import ResultsScreen from './ResultsScreen';
import HistoryScreen from './HistoryScreen';
import UploadScreen from './UploadScreen';
import SettingsScreen from './SettingsScreen';
import { theme } from '../theme/theme';

export default function MainAppScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (screenName: string) => {
    setActiveTab(screenName === 'Results' ? 'home' : 
                 screenName === 'History' ? 'history' :
                 screenName === 'Upload' ? 'upload' : 'settings');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <ResultsScreen navigation={navigation} />;
      case 'history':
        return <HistoryScreen navigation={navigation} />;
      case 'upload':
        return <UploadScreen navigation={navigation} />;
      case 'settings':
        return <SettingsScreen navigation={navigation} />;
      default:
        return <ResultsScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <BottomTabNavigator
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});