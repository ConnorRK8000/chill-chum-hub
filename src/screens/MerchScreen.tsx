import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Linking } from 'react-native';
import {
  Header,
  MerchCard,
  FilterChip,
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  SectionHeader,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { MerchItem } from '../types';
import { merchService, fallbackMerchData } from '../services/MerchService';

export const MerchScreen: React.FC = () => {
  const [products, setProducts] = useState<MerchItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMerch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await merchService.getMerch();
        if (response.error) {
          console.warn('[MerchScreen] Service error, using fallback:', response.message);
          setProducts(fallbackMerchData);
        } else if (response.products && response.products.length > 0) {
          setProducts(response.products);
        } else {
          console.warn('[MerchScreen] Empty products, using fallback');
          setProducts(fallbackMerchData);
        }
      } catch (err) {
        console.error('[MerchScreen] Fetch error, using fallback:', err);
        setProducts(fallbackMerchData);
      } finally {
        setLoading(false);
      }
    };

    loadMerch();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Merch Store" />
        <ScrollView contentContainerStyle={styles.content}>
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Merch Store" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Merch Grid */}
        <View style={styles.grid}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No merch available.</Text>
            </View>
          ) : (
            filteredProducts.map(product => (
              <View key={product.id} style={styles.gridItem}>
                <MerchCard
                  item={product}
                  onPress={() => product.url && Linking.openURL(product.url)}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  skeletonCard: {
    width: '48%',
    marginBottom: spacing.md,
  },
  emptyState: {
    width: '100%',
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray600,
    fontSize: typography.fontSize.md,
  },
});