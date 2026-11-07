import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Linking, RefreshControl } from 'react-native';
import {
  MerchCard,
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  Footer,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { MerchItem } from '../types';
import { merchService, fallbackMerchData } from '../services/MerchService';

export const MerchScreen: React.FC = () => {
  const [products, setProducts] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadMerch = async () => {
      setLoading(true);
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const products = await merchService.forceRefresh();
      if (products && products.length > 0) {
        setProducts(products);
      } else {
        setProducts(fallbackMerchData);
      }
    } catch {
      setProducts(fallbackMerchData);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />}>
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
          <SkeletonCard aspectRatio={1} style={styles.skeletonCard} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Merch Grid */}
        <View style={styles.grid}>
          {products.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No merch available.</Text>
            </View>
          ) : (
            products.map(product => (
              <View key={product.id} style={styles.gridItem}>
                <MerchCard
                  item={product}
                  onPress={() => product.url && Linking.openURL(product.url)}
                />
              </View>
            ))
          )}
        </View>
        <Text style={styles.disclaimer}>
          All merchandise and product imagery are copyright © PodSwag / Team Coco. Chill Chum Hub does not sell products, process transactions, or receive affiliate commissions. All purchase links redirect to official storefronts.
        </Text>
        <Footer />
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
    paddingTop: spacing.md,
    paddingBottom: 0,
  },
  grid: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  gridItem: {
    width: '100%',
    marginBottom: spacing.md,
  },
  skeletonCard: {
    width: '100%',
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
  disclaimer: {
    color: colors.gray500,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    lineHeight: 16,
  },
});