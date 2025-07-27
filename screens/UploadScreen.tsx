import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';

interface PhotoData {
  id: string;
  type: 'front' | 'side' | 'body';
  uri: string;
  label: string;
  description: string;
}

export default function UploadScreen({ navigation }) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);

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

  const pickImage = async (type: string) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Photos</Text>
          <Text style={styles.subtitle}>
            Upload 2-4 photos for the best analysis
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
            {photos.length}/4 photos uploaded
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((photos.length / 4) * 100, 100)}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for best results:</Text>
          <Text style={styles.tip}>• Good lighting and clear photos</Text>
          <Text style={styles.tip}>• Remove sunglasses and hats</Text>
          <Text style={styles.tip}>• Show your natural appearance</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => navigation.navigate('Analysis')}
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