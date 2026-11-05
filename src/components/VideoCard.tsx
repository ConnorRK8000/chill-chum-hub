import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Video } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface VideoCardProps {
  video: Video;
  onPress: () => void;
  style?: ViewStyle;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playButtonOverlay}>
          <PlayButton size={48} />
        </View>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
        <Text style={styles.meta}>
          {formatViews(video.views)} views • {formatDate(video.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface PlayButtonProps {
  size: number;
  color?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ size, color = colors.primary }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color + 'E6',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.45,
        borderTopWidth: size * 0.26,
        borderBottomWidth: size * 0.26,
        borderLeftColor: colors.white,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        marginLeft: size * 0.08,
      }}
    />
  </View>
);

const formatViews = (views: string): string => {
  const num = parseInt(views, 10);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  duration: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  durationText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.white,
  },
  info: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.xs,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  meta: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
  },
});