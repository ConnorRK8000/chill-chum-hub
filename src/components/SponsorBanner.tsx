import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Sponsor } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface SponsorBannerProps {
  sponsor: Sponsor;
  onPress?: () => void;
}

export const SponsorBanner: React.FC<SponsorBannerProps> = ({ sponsor, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (sponsor.url) {
      Linking.openURL(sponsor.url);
    }
  };

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.tag}><Text>{sponsor.tagline}</Text></View>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: sponsor.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{sponsor.name}</Text>
          <Text style={styles.description}>{sponsor.description}</Text>
        </View>
        <Text style={styles.cta}>Learn More →</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  imageContainer: {
    width: 80,
    height: 56,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  cta: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderRadius: borderRadius.md,
    alignSelf: 'flex-end',
  },
});