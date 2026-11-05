import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ViewStyle, ImageStyle, ImageSourcePropType } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
}) => {
  const variantStyles = styles[variant];

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.base,
          variantStyles,
          styles.interactive,
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.base,
        variantStyles,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export interface CardImageProps {
  source: ImageSourcePropType;
  style?: ImageStyle;
  aspectRatio?: number;
  borderRadius?: number;
}

export const CardImage: React.FC<CardImageProps> = ({
  source,
  style,
  aspectRatio = 16 / 9,
  borderRadius: customBorderRadius,
}) => (
  <View style={[styles.imageContainer, { aspectRatio }, style]}>
    <Image
      source={source}
      style={[
        styles.image,
        { borderTopLeftRadius: customBorderRadius ?? borderRadius.md, borderTopRightRadius: customBorderRadius ?? borderRadius.md },
      ]}
      resizeMode="cover"
    />
  </View>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  default: {
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  elevated: {
    ...shadows.md,
    borderWidth: 0,
  },
  outlined: {
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  interactive: {
    ...shadows.sm,
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.gray200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});