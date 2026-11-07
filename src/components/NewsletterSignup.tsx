import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { useToast } from './Toast';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (email.trim()) {
      showToast('Thanks for subscribing to Team Coco updates!');
      setEmail('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stay in the Loop</Text>
      <Text style={styles.subtitle}>Get Team Coco updates straight to your inbox</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.gray400}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.gray300,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  form: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
    maxWidth: 400,
  },
  input: {
    flex: 1,
    minWidth: 200,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: 'System',
    fontSize: typography.fontSize.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    color: colors.gray900,
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '600',
  },
});