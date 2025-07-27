import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { analyzeImages, getUserStatus, UserStatus } from '../services/analysisService';

interface PhotoData {
  id: string;
  type: 'front' | 'side' | 'body';
  uri: string;
  label: string;
  description: string;
}

export default function UploadScreen({ navigation }) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const photoTypes: Omit<PhotoData, 'id' | 'uri'>[] = [
    {
      type: 'front',
      label: 'Front Face',
      description: 'Clear front view of your face',
    },
    {
      type: 'side',
      label: 'Side Profile',
      description: 'Side view of your face',
    },
    {
      type: 'body',
      label: 'Full Body',
      description: 'Full body shot from head to toe',
    },
  ];

  useEffect(() => {
    loadUserStatus();
  }, []);

  const loadUserStatus = async () => {
    try {
      const status = await getUserStatus();
      setUserStatus(status);
    } catch (error) {
      console.error('Error loading user status:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const pickImage = async (type: string) => {
    if (!userStatus) return;

    // Check if user can add more images
    const currentPhotoCount = photos.length;
    const maxImages = userStatus.limits.maxImagesPerAnalysis;
    
    if (currentPhotoCount >= maxImages) {
      Alert.alert(
        'Image Limit Reached',
        `You can upload up to ${maxImages} images with your ${userStatus.subscription} plan. Upgrade to Premium for up to 4 images.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Upgrade') }
        ]
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // Check file size limit
      const fileSizeMB = result.assets[0].fileSize ? result.assets[0].fileSize / (1024 * 1024) : 0;
      if (fileSizeMB > userStatus.limits.maxImageSizeMB) {
        Alert.alert(
          'File Too Large',
          `File size (${fileSizeMB.toFixed(1)}MB) exceeds the ${userStatus.limits.maxImageSizeMB}MB limit for your ${userStatus.subscription} plan. Upgrade to Premium for larger files.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade', onPress: () => navigation.navigate('Upgrade') }
          ]
        );
        return;
      }

      const newPhoto: PhotoData = {
        id: Date.now().toString(),
        type: type as 'front' | 'side' | 'body',
        uri: result.assets[0].uri,
        label: photoTypes.find(p => p.type === type)?.label || '',
        description: photoTypes.find(p => p.type === type)?.description || '',
      };

      setPhotos(prev => {
        const filtered = prev.filter(p => p.type !== type);
        return [...filtered, newPhoto];
      });
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const getPhotoForType = (type: string) => {
    return photos.find(p => p.type === type);
  };

  const canContinue = photos.length >= 2;

  const handleSubmit = async () => {
    if (!canContinue || !userStatus) return;

    // Check if user has remaining analyses
    if (userStatus.usage.remainingAnalyses <= 0) {
      Alert.alert(
        'Monthly Limit Reached',
        `You've used all ${userStatus.usage.maxAnalysesPerMonth} analyses this month. Upgrade to Premium for 50 analyses per month.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Upgrade') }
        ]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      photos.forEach((photo, index) => {
        const photoFile = {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `${photo.type}_${index}.jpg`,
        } as any;
        
        formData.append('images', photoFile);
        formData.append('imageTypes', photo.type);
      });

      const result = await analyzeImages(formData, userStatus.userId);
      
      // Navigate to results with the analysis data
      navigation.navigate('Results', { analysisResult: result });
      
    } catch (error) {
      console.error('Error analyzing images:', error);
      
      // Handle specific freemium errors
      if (error.message.includes('upgradeRequired')) {
        Alert.alert(
          'Upgrade Required',
          'This feature requires a Premium subscription. Would you like to upgrade?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade', onPress: () => navigation.navigate('Upgrade') }
          ]
        );
      } else {
        Alert.alert(
          'Analysis Failed',
          'There was an error analyzing your photos. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading your account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Analyzing your photos...</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Status Header */}
        {userStatus && (
          <Card style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>
                  {userStatus.subscription === 'premium' ? '🌟 Premium' : '📱 Free'}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {userStatus.usage.remainingAnalyses} of {userStatus.usage.maxAnalysesPerMonth} analyses remaining
                </Text>
              </View>
              {userStatus.subscription === 'free' && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => navigation.navigate('Upgrade')}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.usageBar}>
              <View 
                style={[
                  styles.usageFill, 
                  { 
                    width: `${((userStatus.usage.maxAnalysesPerMonth - userStatus.usage.remainingAnalyses) / userStatus.usage.maxAnalysesPerMonth) * 100}%`,
                    backgroundColor: userStatus.subscription === 'premium' ? theme.colors.success : theme.colors.accent
                  }
                ]} 
              />
            </View>
          </Card>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>Upload Photos</Text>
          <Text style={styles.subtitle}>
            Upload {userStatus?.limits.maxImagesPerAnalysis || 2}-{userStatus?.limits.maxImagesPerAnalysis || 2} photos for the best analysis
          </Text>
        </View>

        <View style={styles.photoGrid}>
          {photoTypes.map((photoType) => {
            const photo = getPhotoForType(photoType.type);
            
            return (
              <Card key={photoType.type} style={styles.photoCard}>
                {photo ? (
                  <View style={styles.photoContainer}>
                    <Image source={{ uri: photo.uri }} style={styles.photo} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePhoto(photo.id)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoLabel}>{photo.label}</Text>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadPlaceholder}
                    onPress={() => pickImage(photoType.type)}
                  >
                    <Text style={styles.uploadIcon}>📷</Text>
                    <Text style={styles.uploadLabel}>{photoType.label}</Text>
                    <Text style={styles.uploadDescription}>{photoType.description}</Text>
                  </TouchableOpacity>
                )}
              </Card>
            );
          })}
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {photos.length}/{userStatus?.limits.maxImagesPerAnalysis || 2} photos uploaded
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((photos.length / (userStatus?.limits.maxImagesPerAnalysis || 2)) * 100, 100)}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for best results:</Text>
          <Text style={styles.tip}>• Good lighting and clear photos</Text>
          <Text style={styles.tip}>• Remove sunglasses and hats</Text>
          <Text style={styles.tip}>• Show your natural appearance</Text>
          {userStatus?.subscription === 'free' && (
            <Text style={styles.tip}>• Upgrade to Premium for detailed insights</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Analyze Photos"
          onPress={handleSubmit}
          disabled={!canContinue}
          size="large"
          style={styles.continueButton}
        />
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  loadingSubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statusCard: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  upgradeButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  upgradeButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  usageBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  usageFill: {
    height: '100%',
    borderRadius: 2,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  photoGrid: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  photoCard: {
    marginBottom: theme.spacing.md,
  },
  photoContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing.sm,
  },
  photoLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  uploadPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  uploadLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  uploadDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  progressSection: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
  tipsSection: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  tipsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tip: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  continueButton: {
    width: '100%',
  },
});