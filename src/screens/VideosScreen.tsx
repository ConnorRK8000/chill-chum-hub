import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import {
  Header,
  VideoCard,
  FilterChip,
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  SectionHeader,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { mockVideos } from '../data/mockData';
import { Video } from '../types';

export const VideosScreen: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'all' | 'clips' | 'full-episodes' | 'behind-scenes' | 'interviews'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const filterAndSort = useCallback((videosList: Video[]) => {
    let result = [...videosList];

    if (category !== 'all') {
      result = result.filter(v => v.category === category);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => parseInt(b.views) - parseInt(a.views));
    }

    setFilteredVideos(result);
  }, [category, sortBy]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVideos(mockVideos);
      filterAndSort(mockVideos);
      setLoading(false);
    }, 500);
  }, [filterAndSort]);

  useEffect(() => {
    filterAndSort(videos);
  }, [category, sortBy, filterAndSort]);

  const handleVideoPress = (video: Video) => {
    console.log('Play video:', video.id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Video Library" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.filterContainer}>
            <Skeleton width="100%" height={50} />
          </View>
          <SkeletonCard aspectRatio={16/9} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={16/9} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={16/9} style={styles.skeletonCard} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Video Library" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Filters */}
        <View style={styles.filterContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.filterChips}>
              {(['all', 'clips', 'full-episodes', 'behind-scenes', 'interviews'] as const).map(cat => (
                <FilterChip
                  key={cat}
                  label={cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                />
              ))}
            </View>
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort</Text>
            <View style={styles.filterChips}>
              {(['newest', 'oldest', 'popular'] as const).map(sort => (
                <FilterChip
                  key={sort}
                  label={sort.charAt(0).toUpperCase() + sort.slice(1)}
                  selected={sortBy === sort}
                  onPress={() => setSortBy(sort)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Video Grid */}
        <View style={styles.grid}>
          {filteredVideos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No videos found.</Text>
            </View>
          ) : (
            filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onPress={() => handleVideoPress(video)}
              />
            ))
          )}
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
  filterContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
    gap: spacing.md,
  },
  filterGroup: {
    gap: spacing.sm,
  },
  filterLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  skeletonCard: {
    width: '48%',
    marginBottom: spacing.md,
  },
  emptyState: {
    width: '100%',
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray600,
    fontSize: typography.fontSize.md,
  },
});