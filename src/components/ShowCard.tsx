import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Show } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { Button } from './Button';

export interface ShowCardProps {
  show: Show;
  showButton: boolean;
  onPress?: () => void;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, showButton, onPress, onButtonPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.day}>{show.day}</Text>
        <Text style={styles.month}>{show.month}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.venue}>{show.venue}</Text>
        <Text style={styles.city}>{show.city}</Text>
      </View>
      {showButton && (
        <Button
          title="Get Tickets"
          onPress={onButtonPress || (() => {})}
          variant="primary"
          size="sm"
          style={styles.ticketButton}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 70,
  },
  day: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '800',
    color: colors.white,
    lineHeight: typography.fontSize.xxl,
  },
  month: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  details: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  venue: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: colors.gray900,
  },
  city: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  ticketButton: {
    marginLeft: 'auto',
  },
});