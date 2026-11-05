import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'outline';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const variantStyles = styles[variant];
  const sizeStyles = styles[size];
  const variantTextStyles = styles[`${variant}Text`];
  const sizeTextStyles = styles[`${size}Text`];

  return (
    <View style={[styles.base, variantStyles, sizeStyles, style]}>
      <Text style={[styles.text, variantTextStyles, sizeTextStyles, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

export interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chipBase,
        selected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export interface TabButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const TabButton: React.FC<TabButtonProps> = ({
  label,
  selected,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabBase,
        selected ? styles.tabSelected : styles.tabUnselected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : styles.tabTextUnselected, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  default: {
    backgroundColor: colors.gray200,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontWeight: '600' as const,
  },
  defaultText: {
    color: colors.gray900,
  },
  primaryText: {
    color: colors.white,
  },
  successText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.gray700,
  },
  smText: {
    fontSize: typography.fontSize.xs,
  },
  mdText: {
    fontSize: typography.fontSize.sm,
  },
  chipBase: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.gray200,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semibold,
  },
  chipTextSelected: {
    color: colors.white,
  },
  chipTextUnselected: {
    color: colors.gray900,
  },
  tabBase: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  tabSelected: {
    backgroundColor: colors.primary,
  },
  tabUnselected: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semibold,
    textAlign: 'center',
  },
  tabTextSelected: {
    color: colors.white,
  },
  tabTextUnselected: {
    color: colors.gray700,
  },
});