import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';

interface HistoryItem {
  id: string;
  date: string;
  overallScore: number;
  sections: {
    name: string;
    score: number;
    maxScore: number;
    icon: string;
  }[];
  improvement: number; // percentage improvement from previous
}

export default function HistoryScreen({ navigation }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Mock history data - replace with real data later
  const historyData: HistoryItem[] = [
    {
      id: '1',
      date: '2024-01-15',
      overallScore: 78,
      improvement: 12,
      sections: [
        { name: 'Face Harmony', score: 18, maxScore: 25, icon: '😊' },
        { name: 'Hair & Beard', score: 16, maxScore: 25, icon: '💇‍♂️' },
        { name: 'Skin', score: 15, maxScore: 20, icon: '✨' },
        { name: 'Outfit & Style', score: 14, maxScore: 20, icon: '👔' },
        { name: 'Posture & Body', score: 15, maxScore: 20, icon: '💪' },
      ]
    },
    {
      id: '2',
      date: '2024-01-08',
      overallScore: 66,
      improvement: 8,
      sections: [
        { name: 'Face Harmony', score: 15, maxScore: 25, icon: '😊' },
        { name: 'Hair & Beard', score: 14, maxScore: 25, icon: '💇‍♂️' },
        { name: 'Skin', score: 13, maxScore: 20, icon: '✨' },
        { name: 'Outfit & Style', score: 12, maxScore: 20, icon: '👔' },
        { name: 'Posture & Body', score: 12, maxScore: 20, icon: '💪' },
      ]
    },
    {
      id: '3',
      date: '2024-01-01',
      overallScore: 58,
      improvement: 0,
      sections: [
        { name: 'Face Harmony', score: 13, maxScore: 25, icon: '😊' },
        { name: 'Hair & Beard', score: 12, maxScore: 25, icon: '💇‍♂️' },
        { name: 'Skin', score: 11, maxScore: 20, icon: '✨' },
        { name: 'Outfit & Style', score: 10, maxScore: 20, icon: '👔' },
        { name: 'Posture & Body', score: 12, maxScore: 20, icon: '💪' },
      ]
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🔥';
    if (score >= 70) return '😎';
    if (score >= 60) return '👍';
    if (score >= 50) return '😐';
    return '😅';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 70) return theme.colors.accent;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const isExpanded = selectedItem === item.id;
    
    return (
      <Card style={styles.historyCard}>
        <TouchableOpacity
          style={styles.historyHeader}
          onPress={() => setSelectedItem(isExpanded ? null : item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.historyInfo}>
            <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreEmoji}>{getScoreEmoji(item.overallScore)}</Text>
              <Text style={[styles.overallScore, { color: getScoreColor(item.overallScore) }]}>
                {item.overallScore}
              </Text>
            </View>
          </View>
          
          <View style={styles.improvementContainer}>
            {item.improvement > 0 && (
              <Text style={styles.improvementText}>+{item.improvement}%</Text>
            )}
            <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.sectionsContainer}>
              {item.sections.map((section, index) => (
                <View key={index} style={styles.sectionItem}>
                  <Text style={styles.sectionIcon}>{section.icon}</Text>
                  <View style={styles.sectionInfo}>
                    <Text style={styles.sectionName}>{section.name}</Text>
                    <Text style={styles.sectionScore}>
                      {section.score}/{section.maxScore}
                    </Text>
                  </View>
                  <View style={styles.sectionProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${(section.score / section.maxScore) * 100}%`,
                            backgroundColor: getScoreColor(section.score),
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.actionButtons}>
              <Button
                title="View Details"
                onPress={() => navigation.navigate('Feedback', { sectionId: 'face' })}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Compare"
                onPress={() => {}}
                variant="secondary"
                size="small"
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress History</Text>
        <Text style={styles.subtitle}>Track your improvement over time</Text>
      </View>

      {historyData.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Complete your first analysis to start tracking your progress
          </Text>
          <Button
            title="Start Analysis"
            onPress={() => navigation.navigate('Upload')}
            variant="primary"
            size="large"
            style={styles.startButton}
          />
        </View>
      ) : (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <Button
          title="New Analysis"
          onPress={() => navigation.navigate('Upload')}
          variant="primary"
          size="large"
          style={styles.footerButton}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  startButton: {
    width: 200,
  },
  listContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  historyCard: {
    marginBottom: theme.spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyDate: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginRight: theme.spacing.lg,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreEmoji: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  overallScore: {
    ...theme.typography.h2,
    fontWeight: 'bold',
  },
  improvementContainer: {
    alignItems: 'flex-end',
  },
  improvementText: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  expandIcon: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  expandedContent: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  sectionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionScore: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  sectionProgress: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  footerButton: {
    width: '100%',
  },
});