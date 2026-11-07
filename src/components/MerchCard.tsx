import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle, Linking } from 'react-native';
import { MerchItem } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { Button } from './Button';

export interface MerchCardProps {
  item: MerchItem;
  onPress?: () => void;
  style?: ViewStyle;
}

export const MerchCard: React.FC<MerchCardProps> = ({ item, onPress, style }) => {
  const handleBuyPress = () => {
    if (item.url) {
      Linking.openURL(item.url);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Button
          title="Buy on PodSwag"
          onPress={handleBuyPress}
          variant="primary"
          size="sm"
          fullWidth
          style={styles.buyButton}
        />
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.gray200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.gray900,
    lineHeight: typography.fontSize.sm * 1.4,
  },
  price: {
    fontSize: typography.fontSize.md,
    fontWeight: '800',
    color: colors.primary,
  },
  buyButton: {
    marginTop: spacing.xs,
  },
});