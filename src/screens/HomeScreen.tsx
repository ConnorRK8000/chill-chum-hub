import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, SafeAreaView, Platform, RefreshControl } from 'react-native';
import Svg, { Path, Line, Circle, Rect, Polyline, Text as SvgText } from 'react-native-svg';
import { VideoService, videoService } from '../services';
import { Header, SectionHeader, Card, LoadingSpinner, Skeleton, SkeletonCard, 
Footer } from '../components';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { VideoResponse } from '../types';

// Platform icon SVGs - exact size from CSS (30px)
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

// HBO Max icon using SVG text (matching HTML exactly)
const HBOIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 60 50" fill={color}>
    <SvgText x="30" y="20" fontFamily="Arial Black, sans-serif" fontSize={26} fontWeight="bold" textAnchor="middle" fill={color}>HBO</SvgText>
    <SvgText x="30" y="42" fontFamily="Arial Black, sans-serif" fontSize={26} fontWeight="bold" textAnchor="middle" fill={color}>Max</SvgText>
  </Svg>
);

const PlayButton: React.FC<{ size: number; color?: string }> = ({ size, color = 'rgba(255,107,0,0.9)' }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size * 0.55,
        borderTopWidth: size * 0.32,
        borderBottomWidth: size * 0.32,
        borderLeftColor: 'white',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        marginLeft: size * 0.1,
      }}
    />
  </View>
);

export const HomeScreen: React.FC = () => {
  const [latestVideo, setLatestVideo] = useState<VideoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const video = await videoService.forceRefresh();
      setLatestVideo(video);
      setError(null);
    } catch (err) {
      setError('Failed to load latest video');
    } finally {
      setRefreshing(false);
    }
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />}
      >
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
        {/* Latest Clip Label - exact CSS: font-size: 0.875rem (14px), margin-bottom: 0.75rem (12px) */}
        <View style={styles.clipLabel}>
          <Text style={styles.clipLabelText}>
            {video?.publishedAt
              ? `Latest Upload • ${VideoService.formatVideoDate(video.publishedAt)}`
              : 'Latest Upload'}
          </Text>
        </View>

        {/* Video Clip Card - exact CSS: height: 280px for thumbnail, border-radius: 12px, margin-bottom: 1.5rem (24px) */}
        <Card variant="elevated" style={styles.clipCard}>
          {hasVideo && video?.videoId ? (
            <>
              <View style={styles.videoContainer}>
                <TouchableOpacity
                  style={styles.thumbnailContainer}
                  onPress={() => handleWatchOnYouTube(video.videoId!)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: video.thumbnailUrl || VideoService.getThumbnailUrl(video.videoId) }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
                    <PlayButton size={72} />
                  </View>
                </TouchableOpacity>
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

        {/* Platforms - exact CSS: gap: 1rem (16px), margin-bottom: 1rem (16px) */}
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

        {/* SiriusXM - exact CSS: margin: 1rem 0 (16px) */}
        <View style={styles.sirius}>
          <Text style={styles.siriusText}>Also on SiriusXM Channel 104</Text>
        </View>

        {/* HBO Max Show - exact CSS: padding: 1rem (16px), gap: 1rem (16px) */}
        <View style={styles.showContainer}>
          <TouchableOpacity
            style={styles.showLink}
            onPress={() => handlePlatformPress('https://www.max.com/')}
            activeOpacity={0.8}
          >
             <View style={styles.showIcon}>
               <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <Rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                 <Polyline points="17 2 12 7 7 2" />
               </Svg>
             </View>
            <View style={styles.showInfo}>
              <Text style={styles.showTitle}>Conan O&apos;Brien Must Go</Text>
              <Text style={styles.showSubtitle}>Now streaming on Max</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Section - exact CSS: margin-top: 2rem (32px), padding: 1.5rem (24px) */}
        <Card variant="outlined" style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Info</Text>

          <View style={styles.contactItem}>
            <Text style={styles.contactText}>
              <Text style={styles.contactStrong}>Conan O&apos;Brien Needs a Friend Voicemail:</Text>{' '}
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
              <Text style={styles.contactStrong}>Conan O&apos;Brien Needs A Fan Application:</Text>{' '}
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

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // Exact CSS: .home-container { max-width: 500px; margin: 0 auto; padding: 1rem 0; }
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 0,
  },
  // Exact CSS: .home-brand { font-size: 2.5rem (40px); font-weight: 900; margin-bottom: 1.5rem (24px); }
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.8,
    textTransform: 'uppercase',
  },
  // Exact CSS: .home-clip-label { font-size: 0.875rem (14px); margin-bottom: 0.75rem (12px); }
  clipLabel: {
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 16,
  },
  clipLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  // Exact CSS: .home-clip-card { border-radius: 12px; margin-bottom: 1.5rem (24px); border: 2px solid primary; }
  clipCard: {
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF6B00',
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#000000',
  },
  // Exact CSS: .home-clip-thumbnail { height: 280px; }
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  thumbnailContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  // Watch button positioning
  watchButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    ...shadows.lg,
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  placeholderImage: {
    width: '80%',
    maxWidth: 300,
    marginTop: 16,
  },
  // Exact CSS: .home-platforms-label { margin-bottom: 0.75rem (12px); font-size: 0.875rem (14px); }
  platformsLabel: {
    alignItems: 'center',
    marginBottom: 12,
  },
  platformsLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  // Exact CSS: .home-platforms { gap: 1rem (16px); margin-bottom: 1rem (16px); }
  platforms: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  // Exact CSS: .home-platform { width: 56px; height: 56px; border-radius: 50%; }
  platform: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Exact CSS: .home-sirius { margin: 1rem 0 (16px); font-size: 0.875rem (14px); }
  sirius: {
    alignItems: 'center',
    marginVertical: 16,
  },
  siriusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  // Exact CSS: .home-show-link { padding: 1rem (16px); gap: 1rem (16px); }
  showContainer: {
    marginVertical: 24,
  },
  showLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  // Exact CSS: .home-show-icon { width: 48px; height: 48px; border-radius: 50%; }
  showIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showInfo: {
    flex: 1,
  },
  showTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  showSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  // Exact CSS: .home-contact { margin-top: 2rem (32px); padding: 1.5rem (24px); }
  contactCard: {
    marginTop: 32,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactItem: {
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  contactStrong: {
    color: '#111827',
    fontWeight: '700',
  },
  contactLink: {},
  contactLinkText: {
    color: '#FF6B00',
    fontWeight: '600',
  },
  brandSkeleton: {
    borderRadius: 8,
  },
});