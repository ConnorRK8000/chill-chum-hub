import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Toast';
import { MainTabNavigator } from '@/navigation/MainNavigator';
import { colors, spacing, typography } from '@/theme/colors';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.splashLogo}
        resizeMode="contain"
      />
      <Text style={styles.splashText}>There was talk... of Coco</Text>
    </View>
  );
};

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
          {showSplash ? (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          ) : (
            <MainTabNavigator />
          )}
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 150,
    height: 150,
    marginBottom: spacing.lg,
  },
  splashText: {
    fontFamily: 'Georgia',
    fontSize: typography.fontSize.xxl,
    fontWeight: '400',
    fontStyle: 'italic',
    color: colors.white,
    lineHeight: typography.fontSize.xxl * 1.4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
  },
});