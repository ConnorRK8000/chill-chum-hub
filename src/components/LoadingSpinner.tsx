import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../theme/colors';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = colors.primary,
  message,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[styles.message, textStyle]}>{message}</Text>
      )}
    </View>
  );
};

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        { width: width as any, height: height as any, borderRadius },
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC<{ aspectRatio?: number; style?: ViewStyle }> = ({
  aspectRatio = 16 / 9,
  style,
}) => {
  return (
    <View style={[styles.skeletonCard, { aspectRatio }, style]}>
      <Skeleton width="100%" height="100%" />
      <View style={styles.skeletonContent}>
        <Skeleton width="80%" height={16} style={styles.skeletonTitle} />
        <Skeleton width="60%" height={12} style={styles.skeletonMeta} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  skeleton: {
    backgroundColor: colors.gray200,
    overflow: 'hidden',
  },
  skeletonCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
  },
  skeletonContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  skeletonTitle: {
    borderRadius: 4,
  },
  skeletonMeta: {
    borderRadius: 4,
  },
});