import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import {
  Header,
  TeamCard,
  LoadingSpinner,
  SkeletonCard,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { mockTeam } from '../data/mockData';
import { TeamMember } from '../types';

export const TeamScreen: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTeam(mockTeam);
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Meet Team Coco" />
        <ScrollView contentContainerStyle={styles.content}>
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Meet Team Coco" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {team.map(member => (
            <TeamCard key={member.id} member={member} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  skeletonCard: {
    width: '100%',
    marginBottom: spacing.lg,
  },
});