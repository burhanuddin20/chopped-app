import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionContextType {
  isPremium: boolean;
  hasUploadedPhoto: boolean;
  updateHasUploadedPhoto: (hasUploaded: boolean) => void;
  unlockPremium: () => Promise<void>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [hasUploadedPhoto, setHasUploadedPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionState();
  }, []);

  const loadSubscriptionState = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      const uploadedStatus = await AsyncStorage.getItem('hasUploadedPhoto');
      
      setIsPremium(premiumStatus === 'true');
      setHasUploadedPhoto(uploadedStatus === 'true');
    } catch (error) {
      console.error('Error loading subscription state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unlockPremium = async () => {
    try {
      setIsLoading(true);
      // Here you would integrate with your in-app purchase system
      // For now, we'll simulate a successful purchase
      await AsyncStorage.setItem('isPremium', 'true');
      setIsPremium(true);
    } catch (error) {
      console.error('Error unlocking premium:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHasUploadedPhoto = async (hasUploaded: boolean) => {
    try {
      await AsyncStorage.setItem('hasUploadedPhoto', hasUploaded.toString());
      setHasUploadedPhoto(hasUploaded);
    } catch (error) {
      console.error('Error saving upload status:', error);
    }
  };

  const value: SubscriptionContextType = {
    isPremium,
    hasUploadedPhoto,
    updateHasUploadedPhoto,
    unlockPremium,
    isLoading,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 