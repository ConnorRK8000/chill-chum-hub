import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Post } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  style?: ViewStyle;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onReply,
  onShare,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.avatar}>{post.avatar}</View>
        <View style={styles.authorInfo}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.time}>{post.time}</Text>
        </View>
      </View>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.action} activeOpacity={0.7}>
          <Text style={styles.actionText}>👍 Like ({post.likes})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReply} style={styles.action} activeOpacity={0.7}>
          <Text style={styles.actionText}>💬 Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.action} activeOpacity={0.7}>
          <Text style={styles.actionText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: typography.fontSize.sm,
  },
  authorInfo: {
    flex: 1,
  },
  author: {
    fontWeight: '700',
    color: colors.gray900,
    fontSize: typography.fontSize.sm,
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
  },
  content: {
    color: colors.gray800,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.6,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  action: {
    paddingVertical: spacing.xs,
  },
  actionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray600,
  },
});