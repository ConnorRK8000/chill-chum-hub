import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { colors, spacing } from '../theme/colors';

export interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setVisible(false);
        onComplete();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onComplete]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.text}>
          There was talk... of Coco
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  text: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '400',
    fontStyle: 'italic',
    color: colors.white,
    lineHeight: 36,
    textAlign: 'center',
    textShadowColor: Platform.OS === 'web' ? undefined : 'rgba(0,0,0,0.2)',
    textShadowOffset: Platform.OS === 'web' ? undefined : { width: 0, height: 2 },
    textShadowRadius: Platform.OS === 'web' ? undefined : 4,
  },
});