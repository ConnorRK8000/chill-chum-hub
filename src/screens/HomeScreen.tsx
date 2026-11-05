import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { VideoService, videoService } from '../services';
import {
  Header,
  Button,
  Card,
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
} from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { VideoResponse } from '../types';

// Platform icon SVGs using react-native-svg
const YouTubeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 30, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
  </Svg>
);

const ApplePodcastsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 30, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.5c4.694 0 8.5 3.806 8.5 8.5 0 4.694-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12c0-4.694 3.806-8.5 8.5-8.5zm0 2.5a6 6 0 100 12 6 6 0 000-12zm0 3a3 3 0 110 6 3 3 0 010-6z" />
  </Svg>
);

const SpotifyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 30, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </Svg>
);

const WebIcon: React.FC<{ size?: number; color?: string }> = ({ size = 30, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

export const HomeScreen: React.FC = () => {
  const [latestVideo, setLatestVideo] = useState<VideoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLatestVideo();
  }, []);

  const loadLatestVideo = async () => {
    try {
      setLoading(true);
      const video = await videoService.getLatestVideo();
      setLatestVideo(video);
      setError(null);
    } catch (err) {
      setError('Failed to load latest video');
      console.error('Error loading latest video:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views: string): string => {
    const num = parseInt(views, 10);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleWatchOnYouTube = (videoId: string) => {
    const url = VideoService.getDeepLink(videoId);
    Linking.openURL(url);
  };

  const handlePlatformPress = (url: string) => {
    Linking.openURL(url);
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebPress = (url: string) => {
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSpacer} />
          <View style={styles.brandContainer}>
            <Skeleton width="60%" height={40} style={styles.brandSkeleton} />
          </View>
          <View style={styles.clipLabel}>
            <Skeleton width="40%" height={16} />
          </View>
          <SkeletonCard aspectRatio={16/9} style={styles.clipCard} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const hasVideo = latestVideo && latestVideo.videoId && !latestVideo.error;
  const video = latestVideo;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSpacer} />

        {/* Brand */}
        <View style={styles.brandContainer}>
          <Text style={styles.brand}>Team Coco</Text>
        </View>

        {/* Latest Clip Label */}
        <View style={styles.clipLabel}>
          <Text style={styles.clipLabelText}>
            {video?.publishedAt
              ? `Latest Upload • ${VideoService.formatVideoDate(video.publishedAt)}`
              : 'Latest Upload'}
          </Text>
        </View>

        {/* Video Clip Card */}
        <Card variant="elevated" style={styles.clipCard}>
          {hasVideo && video?.videoId ? (
            <>
              <View style={styles.videoContainer}>
                <WebView
                  source={{ uri: VideoService.getEmbedUrl(video.videoId) }}
                  style={styles.webView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  mediaPlaybackRequiresUserAction={false}
                  allowsInlineMediaPlayback={true}
                />
              </View>
              <TouchableOpacity
                style={styles.watchButton}
                onPress={() => handleWatchOnYouTube(video.videoId!)}
                activeOpacity={0.8}
              >
                <Text style={styles.watchButtonText}>▶ Watch on YouTube</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <PlayButton size={72} />
              <Image
                source={{
                  uri: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 16 9\'%3E%3Crect fill=\'%23000\' width=\'16\' height=\'9\'/%3E%3Ctext x=\'8\' y=\'24.5\' font-family=\'Arial Black\' font-size=\'1.8\' fill=\'%23FF6B00\' text-anchor=\'middle\'%3ECONAN%3C/text%3E%3Ctext x=\'8\' y=\'26.5\' font-family=\'Arial\' font-size=\'0.9\' fill=\'white\' text-anchor=\'middle\'%3ENEEDS A FRIEND%3C/text%3E%3C/svg%3E'
                }}
                style={styles.placeholderImage}
                resizeMode="contain"
              />
            </View>
          )}
        </Card>

        {/* Platforms */}
        <View style={styles.platformsLabel}>
          <Text style={styles.platformsLabelText}>Watch/Listen Now On...</Text>
        </View>

        <View style={styles.platforms}>
          <TouchableOpacity
            style={styles.platform}
            onPress={() => handlePlatformPress('https://www.youtube.com/@TeamCoco')}
            activeOpacity={0.8}
          >
            <YouTubeIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.platform}
            onPress={() => handlePlatformPress('https://podcasts.apple.com/us/podcast/conan-obrien-needs-a-friend/id1438054347')}
            activeOpacity={0.8}
          >
            <ApplePodcastsIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.platform}
            onPress={() => handlePlatformPress('https://open.spotify.com/show/3u26tlz7A3WyWRtXliX9a9')}
            activeOpacity={0.8}
          >
            <SpotifyIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.platform}
            onPress={() => handlePlatformPress('https://teamcoco.com/')}
            activeOpacity={0.8}
          >
            <WebIcon />
          </TouchableOpacity>
        </View>

        {/* SiriusXM */}
        <View style={styles.sirius}>
          <Text style={styles.siriusText}>Also on SiriusXM Channel 104</Text>
        </View>

        {/* HBO Max Show */}
        <View style={styles.showContainer}>
          <TouchableOpacity
            style={styles.showLink}
            onPress={() => handlePlatformPress('https://www.max.com/')}
            activeOpacity={0.8}
          >
            <View style={styles.showIcon}>
              <Text style={styles.showIconText}>
                HBO\nMax
              </Text>
            </View>
            <View style={styles.showInfo}>
              <Text style={styles.showTitle}>Conan O'Brien Must Go</Text>
              <Text style={styles.showSubtitle}>Now streaming on Max</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Section */}
        <Card variant="outlined" style={styles.contactCard}>
          <Text style={styles.contactTitle}>Reach Out To Us</Text>

          <View style={styles.contactItem}>
            <Text style={styles.contactText}>
              <Text style={styles.contactStrong}>Conan O'Brien Needs a Friend Voicemail:</Text>{' '}
              Call{' '}
              <TouchableOpacity
                onPress={() => handlePhonePress('+13233622295')}
                style={styles.contactLink}
              >
                <Text style={styles.contactLinkText}>(323) 362-2295</Text>
              </TouchableOpacity>
              {' '}to leave a question or message for the podcast.
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Text style={styles.contactText}>
              <Text style={styles.contactStrong}>Inside Conan Voicemail & Email:</Text>{' '}
              Call{' '}
              <TouchableOpacity
                onPress={() => handlePhonePress('+13232091079')}
                style={styles.contactLink}
              >
                <Text style={styles.contactLinkText}>(323) 209-1079</Text>
              </TouchableOpacity>
              {' '}or email{' '}
              <TouchableOpacity
                onPress={() => handleEmailPress('insideconanpod@gmail.com')}
                style={styles.contactLink}
              >
                <Text style={styles.contactLinkText}>insideconanpod@gmail.com</Text>
              </TouchableOpacity>
              {' '}.
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Text style={styles.contactText}>
              <Text style={styles.contactStrong}>Conan O'Brien Needs A Fan Application:</Text>{' '}
              Wanna talk to Conan? Click{' '}
              <TouchableOpacity
                onPress={() => handleWebPress('https://conanobrien.com/apply')}
                style={styles.contactLink}
              >
                <Text style={styles.contactLinkText}>here</Text>
              </TouchableOpacity>
              {' '}to apply!
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const PlayButton: React.FC<{ size: number }> = ({ size }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.primary + 'E6',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.45,
        borderTopWidth: size * 0.26,
        borderBottomWidth: size * 0.26,
        borderLeftColor: colors.white,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        marginLeft: size * 0.08,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  headerSpacer: {
    height: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  brand: {
    fontSize: typography.fontSize.hero,
    fontWeight: '900',
    color: colors.black,
    textAlign: 'center',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  clipLabel: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clipLabelText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clipCard: {
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.black,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  watchButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    zIndex: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  watchButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  placeholderImage: {
    width: '80%',
    maxWidth: 300,
    marginTop: spacing.md,
  },
  platformsLabel: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  platformsLabelText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  platforms: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  platform: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sirius: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  siriusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  showContainer: {
    marginVertical: spacing.lg,
  },
  showLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.black,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  showIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showIconText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'Arial Black',
  },
  showInfo: {
    flex: 1,
  },
  showTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.xs / 2,
  },
  showSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray300,
  },
  contactCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  contactTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  contactItem: {
    marginBottom: spacing.md,
  },
  contactText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    lineHeight: 22,
  },
  contactStrong: {
    color: colors.gray900,
    fontWeight: '700',
  },
  contactLink: {},
  contactLinkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  brandSkeleton: {
    borderRadius: borderRadius.md,
  },
});