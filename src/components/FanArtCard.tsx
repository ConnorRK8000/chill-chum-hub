import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { FanArt } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface FanArtCardProps {
  art: FanArt;
  onPress?: () => void;
  style?: ViewStyle;
}

export const FanArtCard: React.FC<FanArtCardProps> = ({ art, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: art.image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{art.title}</Text>
        <Text style={styles.author}>by {art.author}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.gray200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs / 2,
  },
  author: {
    fontSize: 10,
    color: colors.gray600,
  },
});