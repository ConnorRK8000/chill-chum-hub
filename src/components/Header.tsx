import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface HeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  showLogo?: boolean;
  onLogoPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  showLogo = true,
  onLogoPress,
  style,
  titleStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {leftComponent || (showLogo && (
          <TouchableOpacity onPress={onLogoPress} style={styles.logoContainer} activeOpacity={0.8}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Team Coco</Text>
          </TouchableOpacity>
        ))}
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
        {rightComponent}
      </View>
    </View>
  );
};

export interface SectionHeaderProps {
  title: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  style,
  titleStyle,
}) => {
  return (
    <View style={[styles.sectionContainer, style]}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={action.onPress} activeOpacity={0.8}>
          <Text style={styles.sectionAction}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
  },
  logoText: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '800',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.gray900,
    letterSpacing: -0.3,
  },
  sectionAction: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
});