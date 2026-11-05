import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TextInput, Keyboard } from 'react-native';
import {
  Header,
  TabButton,
  PostCard,
  FanArtCard,
  Input,
  Button,
  LoadingSpinner,
  Skeleton,
  Card,
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
  const [submitting, setSubmitting] = useState(false);

  const maxChars = 500;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 300);
  }, []);

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
  }, [newPostText, submitting]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleReply = () => {
    console.log('Reply pressed');
  };

  const handleShare = () => {
    console.log('Share pressed');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Community" />
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
      <Header title="Community" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.xs,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  formCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  textArea: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginBottom: spacing.md,
    minHeight: 80,
    padding: spacing.md,
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
    fontSize: typography.fontSize.xs,
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