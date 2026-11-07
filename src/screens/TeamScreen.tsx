import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import {
  TeamCard,
  LoadingSpinner,
  SkeletonCard,
  Footer,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { mockTeam } from '../data/mockData';
import { TeamMember } from '../types';

export const TeamScreen: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTeam(mockTeam);
      setLoading(false);
    }, 300);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTeam(mockTeam);
      setRefreshing(false);
    }, 300);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />}>
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {team.map(member => (
            <TeamCard key={member.id} member={member} />
          ))}
        </View>
        <Text style={styles.disclaimer}>
          Biographical profiles and photography are presented for informational and commentary purposes under fair use. Chill Chum Hub is not endorsed by or affiliated with the individuals featured.
        </Text>
        <Footer />
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
    paddingBottom: 0,
  },
  grid: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  skeletonCard: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  disclaimer: {
    color: colors.gray500,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    lineHeight: 16,
  },
});
