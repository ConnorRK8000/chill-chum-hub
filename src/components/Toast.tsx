import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ViewStyle, Platform } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; anim: Animated.Value }>>([]);

  const showToast = useCallback((message: string, duration = 3000) => {
    const id = Date.now();
    const anim = new Animated.Value(0);

    setToasts(prev => [...prev, { id, message, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }).start(({ finished }) => {
        if (finished) {
          setToasts(prev => prev.filter(t => t.id !== id));
        }
      });
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container}>
        {toasts.map(toast => (
          <Animated.View
            key={toast.id}
            style={[
              styles.toast,
              {
                opacity: toast.anim,
                transform: [{ translateY: toast.anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
              },
            ]}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    backgroundColor: colors.black,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    } : shadows.lg),
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 200,
    maxWidth: '90%',
  },
  toastText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});