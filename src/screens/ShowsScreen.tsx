import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Linking, RefreshControl } from 'react-native';
import {
  ShowCard,
  FilterChip,
  LoadingSpinner,
  Skeleton,
  SectionHeader,
  Footer,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { Show } from '../types';
import { showsService } from '../services/ShowsService';

export const ShowsScreen: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const loadShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await showsService.getShows();
        if (response.error) {
          console.warn('[ShowsScreen] Service error:', response.message);
          setShows([]);
        } else if (response.shows) {
          setShows(response.shows);
        }
      } catch (err) {
        console.error('[ShowsScreen] Fetch error:', err);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const shows = await showsService.forceRefresh();
      if (shows && shows.length > 0) {
        setShows(shows);
      } else {
        setShows([]);
      }
    } catch (err) {
      console.error('[ShowsScreen] Fetch error:', err);
      setShows([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let filtered = shows;

    if (filter === 'upcoming') {
      filtered = shows.filter(s => s.date >= today);
    } else if (filter === 'past') {
      filtered = shows.filter(s => s.date < today);
    }

    filtered.sort((a, b) => a.date.localeCompare(b.date));
    setFilteredShows(filtered);
  }, [shows, filter]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.filterContainer}>
            <Skeleton width="100%" height={40} />
          </View>
          <Skeleton width="100%" height={100} style={styles.skeletonShow} />
          <Skeleton width="100%" height={100} style={styles.skeletonShow} />
          <Skeleton width="100%" height={100} style={styles.skeletonShow} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleTicketPress = (ticketUrl: string) => {
    if (ticketUrl && ticketUrl !== '#') {
      Linking.openURL(ticketUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />}>
        {/* Filters */}
        <View style={styles.filterContainer}>
          <FilterChip
            label="Upcoming"
            selected={filter === 'upcoming'}
            onPress={() => setFilter('upcoming')}
          />
          <FilterChip
            label="Past Shows"
            selected={filter === 'past'}
            onPress={() => setFilter('past')}
          />
        </View>

        {/* Shows List */}
        <View style={styles.list}>
          {filteredShows.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {filter === 'upcoming'
                  ? 'No scheduled upcoming shows.'
                  : 'No past shows in database.'}
              </Text>
            </View>
          ) : (
            filteredShows.map(show => (
              <ShowCard
                key={show.id}
                show={show}
                showButton={filter === 'upcoming'}
                onButtonPress={() => handleTicketPress(show.ticketUrl)}
              />
            ))
          )}
        </View>
        <Text style={styles.disclaimer}>
          Tour dates, ticket availability, and event schedules are subject to change. Chill Chum Hub does not sell tickets, manage box office inventory, or process transactions. All ticketing links redirect to official primary ticketing partners (Ticketmaster, venue box offices).
        </Text>
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
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
  skeletonShow: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.gray600,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
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
