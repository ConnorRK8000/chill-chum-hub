import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          hasError ? styles.inputError : {},
          inputStyle,
        ]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

export interface TextAreaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  label?: string;
  error?: string;
  helperText?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  style,
  inputStyle,
  containerStyle,
  rows = 4,
  ...props
}) => {
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>}
      <TextInput
        multiline
        numberOfLines={rows}
        style={[
          styles.textArea,
          hasError ? styles.inputError : {},
          inputStyle,
        ]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelError: {
    color: colors.error,
  },
  input: {
    height: 48,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray900,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  textArea: {
    minHeight: 100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray900,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    textAlignVertical: 'top',
    ...shadows.sm,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  helperText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
});