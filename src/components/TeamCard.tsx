import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { TeamMember } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface TeamCardProps {
  member: TeamMember;
  onPress?: () => void;
  style?: ViewStyle;
}

export const TeamCard: React.FC<TeamCardProps> = ({ member, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.photoContainer}>
        <Image
          source={member.image}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.role}>{member.role}</Text>
        <Text style={styles.bio}>{member.bio}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  photoContainer: {
    width: '100%',
    height: 240,
    backgroundColor: colors.gray200,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    color: colors.gray900,
  },
  role: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bio: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: typography.fontSize.sm * 1.6,
  },
});