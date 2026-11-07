import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './components/Toast';
import { MainTabNavigator } from './navigation/MainNavigator';
import { SplashScreen } from './components/SplashScreen';
import { colors } from './theme/colors';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <MainTabNavigator />
          )}
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};