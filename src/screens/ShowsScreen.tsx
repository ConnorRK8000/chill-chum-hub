import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Linking } from 'react-native';
import {
  Header,
  ShowCard,
  FilterChip,
  LoadingSpinner,
  Skeleton,
  SectionHeader,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { Show } from '../types';
import { showsService } from '../services/ShowsService';

export const ShowsScreen: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
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
        <Header title="Upcoming Shows" />
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
        <Header title="Upcoming Shows" />
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
      <Header title="Upcoming Shows" />
      <ScrollView contentContainerStyle={styles.content}>
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
});