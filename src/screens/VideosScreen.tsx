import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import {
  VideoCard,
  Select,
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  SectionHeader,
  VideoModal,
  Footer,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { mockVideos } from '../data/mockData';
import { Video } from '../types';

export const VideosScreen: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<'all' | 'clips' | 'full-episodes' | 'behind-scenes' | 'interviews'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setVideos(mockVideos);
      filterAndSort(mockVideos);
      setRefreshing(false);
    }, 500);
  };

  const handleVideoPress = (video: Video) => {
    setSelectedVideo(video);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />}>
          <View style={styles.filterBar}>
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
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />}>
        {/* Filters */}
        <View style={styles.filterBar}>
          <Select
            label="Category"
            value={category}
            options={[
              { label: 'All Categories', value: 'all' },
              { label: 'Clips', value: 'clips' },
              { label: 'Full Episodes', value: 'full-episodes' },
              { label: 'Behind the Scenes', value: 'behind-scenes' },
              { label: 'Interviews', value: 'interviews' },
            ]}
            onChange={(v) => setCategory(v as any)}
          />
          <Select
            label="Sort"
            value={sortBy}
            options={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' },
              { label: 'Most Popular', value: 'popular' },
            ]}
            onChange={(v) => setSortBy(v as any)}
          />
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
        <Footer />
      </ScrollView>

      <VideoModal
        visible={modalVisible}
        onClose={closeModal}
        video={selectedVideo ? {
          title: selectedVideo.title,
          description: selectedVideo.description,
          views: selectedVideo.views,
          date: selectedVideo.date,
          duration: selectedVideo.duration,
          videoId: selectedVideo.videoId || '',
        } : undefined}
      />
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
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
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
