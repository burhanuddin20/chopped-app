import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabNavigator } from '../components/BottomTabNavigator';
import ResultsScreen from './ResultsScreen';
import HistoryScreen from './HistoryScreen';
import UploadScreen from './UploadScreen';
import SettingsScreen from './SettingsScreen';
import { theme } from '../theme/theme';

interface MainAppScreenProps {
  navigation: any;
  route?: any;
}

export default function MainAppScreen({ navigation, route }: MainAppScreenProps) {
  const [activeTab, setActiveTab] = useState('home');

  // If we have analysis results from upload, ensure we're on the home tab
  useEffect(() => {
    if (route?.params?.analysisResult) {
      setActiveTab('home');
    }
  }, [route?.params?.analysisResult]);

  const handleTabPress = (screenName: string) => {
    setActiveTab(screenName === 'Results' ? 'home' : 
                 screenName === 'History' ? 'history' :
                 screenName === 'Upload' ? 'upload' : 'settings');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <ResultsScreen navigation={navigation} route={route} />;
      case 'history':
        return <HistoryScreen navigation={navigation} />;
      case 'upload':
        return <UploadScreen navigation={navigation} />;
      case 'settings':
        return <SettingsScreen navigation={navigation} />;
      default:
        return <ResultsScreen navigation={navigation} route={route} />;
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