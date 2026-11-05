import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'link' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const baseStyles = styles.base;
  const variantStyles = styles[variant];
  const sizeStyles = styles[size];
  const variantTextStyles = styles[`${variant}Text`];
  const sizeTextStyles = styles[`${size}Text`];
  const widthStyle = fullWidth ? styles.fullWidth : {};

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        baseStyles,
        variantStyles,
        sizeStyles,
        widthStyle,
        isDisabled ? styles.disabled : {},
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={styles.spinnerContainer}>
          <Text style={styles.spinner}>⏳</Text>
        </View>
      ) : (
        <Text style={[styles.text, variantTextStyles, sizeTextStyles, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 0,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.gray200,
  },
  link: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: spacing.xs,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontWeight: '600' as const,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.gray900,
  },
  linkText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  smText: {
    fontSize: typography.fontSize.sm,
  },
  mdText: {
    fontSize: typography.fontSize.md,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
  },
  spinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    fontSize: typography.fontSize.md,
  },
});