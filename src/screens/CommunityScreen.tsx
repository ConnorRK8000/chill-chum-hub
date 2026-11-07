import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TextInput, Keyboard, RefreshControl } from 'react-native';
import {
  TabButton,
  PostCard,
  FanArtCard,
  Input,
  Button,
  LoadingSpinner,
  Skeleton,
  Card,
  useToast,
  Footer,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { mockPosts, mockFanArt } from '../data/mockData';
import { Post, FanArt } from '../types';

export const CommunityScreen: React.FC = () => {
  const [tab, setTab] = useState<'discussions' | 'fan-art'>('discussions');
  const [posts, setPosts] = useState<Post[]>([]);
  const [fanArt] = useState<FanArt[]>(mockFanArt);
  const [newPostText, setNewPostText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const maxChars = 500;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 300);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setRefreshing(false);
    }, 300);
  };

  const handlePostChange = useCallback((text: string) => {
    setNewPostText(text);
    setCharCount(text.length);
  }, []);

  const handleSubmitPost = useCallback(() => {
    if (!newPostText.trim() || newPostText.length > maxChars || submitting) return;

    setSubmitting(true);
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'YOU',
      content: newPostText.trim(),
      time: 'Just now',
      likes: 0,
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setCharCount(0);
    setSubmitting(false);
    showToast('Post created!');
  }, [newPostText, submitting, showToast]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
    showToast('Liked post!');
  };

  const handleReply = () => {
    showToast('Reply coming soon!');
  };

  const handleShare = () => {
    showToast('Link copied!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.tabContainer}>
            <Skeleton width="100%" height={50} />
          </View>
          <Card style={styles.formCard}>
            <Skeleton width="100%" height={100} />
          </Card>
          <Skeleton width="100%" height={120} style={styles.skeletonPost} />
          <Skeleton width="100%" height={120} style={styles.skeletonPost} />
      </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />}
      >
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TabButton
            label="Discussions"
            selected={tab === 'discussions'}
            onPress={() => setTab('discussions')}
          />
          <TabButton
            label="Fan Art"
            selected={tab === 'fan-art'}
            onPress={() => setTab('fan-art')}
          />
        </View>

        <View style={styles.tabContent}>
        {tab === 'discussions' && (
          <>
            {/* New Post Form */}
            <Card variant="outlined" style={styles.formCard}>
              <TextInput
                style={styles.textArea}
                placeholder="What's on your mind?"
                value={newPostText}
                onChangeText={handlePostChange}
                multiline
                numberOfLines={4}
                maxLength={maxChars}
                placeholderTextColor={colors.gray400}
              />
              <View style={styles.formActions}>
                <Text style={[
                  styles.charCount,
                  charCount > maxChars ? styles.charCountError : {}
                ]}>
                  {charCount}/{maxChars}
                </Text>
                <Button
                  title="Post"
                  onPress={handleSubmitPost}
                  variant="primary"
                  size="sm"
                  disabled={newPostText.trim().length === 0 || newPostText.length > maxChars || submitting}
                  loading={submitting}
                />
              </View>
            </Card>

            {/* Posts Feed */}
            <View style={styles.postsFeed}>
              {posts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No posts yet. Be the first to post!</Text>
                </View>
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => handleLike(post.id)}
                    onReply={handleReply}
                    onShare={handleShare}
                  />
                ))
              )}
            </View>
          </>
        )}

        {tab === 'fan-art' && (
          <View style={styles.fanArtGrid}>
            {fanArt.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No fan art yet.</Text>
              </View>
            ) : (
              fanArt.map(art => (
                <FanArtCard key={art.id} art={art} />
              ))
            )}
          </View>
        )}
        </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  tabContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
    minHeight: 400,
  },
  formCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
  },
  textArea: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginBottom: 12,
    minHeight: 80,
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  charCountError: {
    color: colors.error,
  },
  postsFeed: {
    gap: spacing.md,
  },
  fanArtGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  skeletonPost: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray600,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
});