import React from 'react';
import { View, Text, StyleSheet, Modal as RNModal, TouchableOpacity, ViewStyle, TextStyle, Animated, Easing } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { VideoService } from '../services/VideoService';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  title,
  style,
  contentStyle,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Animation complete
      });
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!visible) {
    return null;
  }

  return (
    <RNModal
      visible={true}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim },
        ]}
        onStartShouldSetResponder={() => true}
        onResponderGrant={onClose}
      />
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.content, contentStyle]}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          {children}
        </View>
      </Animated.View>
    </RNModal>
  );
};

export interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  video?: {
    title: string;
    description: string;
    views: string;
    date: string;
    duration: string;
    videoId: string;
  };
}

export const VideoModal: React.FC<VideoModalProps> = ({
  visible,
  onClose,
  video,
}) => {
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

  const videoUrl = video ? VideoService.getEmbedUrl(video.videoId) : '';

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      contentStyle={styles.videoModalContent}
    >
      {video && (
        <>
          <View style={styles.videoPlayer}>
            <WebView
              source={{ uri: videoUrl }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              originWhitelist={['*']}
            />
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoDescription}>{video.description}</Text>
            <Text style={styles.videoMeta}>
              {formatViews(video.views)} views • {formatDate(video.date)} • {video.duration}
            </Text>
          </View>
        </>
      )}
    </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 900,
    maxHeight: '90%',
  },
  content: {
    backgroundColor: colors.black,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.white,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: colors.white,
    lineHeight: 28,
  },
  videoModalContent: {
    maxHeight: '90%',
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray900,
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  videoInfo: {
    padding: spacing.lg,
    color: colors.white,
  },
  videoTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  videoDescription: {
    fontSize: typography.fontSize.md,
    color: colors.gray300,
    marginBottom: spacing.md,
  },
  videoMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.gray400,
  },
});