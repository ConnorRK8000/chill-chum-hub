import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  style?: any;
}

export const Select: React.FC<SelectProps> = ({ label, value, options, onChange, style }) => {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(o => o.value === value);

  if (Platform.OS === 'web') {
    const selectStyle: any = {
      padding: '8px 12px',
      fontSize: 14,
      fontFamily: 'inherit',
      border: '1px solid #D1D5DB',
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      color: '#111827',
      cursor: 'pointer',
      width: '100%',
      ...style,
    };
    const SelectTag: any = 'select';
    const OptionTag: any = 'option';
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <SelectTag
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          style={selectStyle}
        >
          {options.map(opt => (
            <OptionTag key={opt.value} value={opt.value}>{opt.label}</OptionTag>
          ))}
        </SelectTag>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={[styles.select, style]} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.selectText}>{selected?.label}</Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={styles.dropdown}>
            <ScrollView>
              {options.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.option, opt.value === value && styles.optionSelected]}
                  onPress={() => { onChange(opt.value); setOpen(false); }}
                >
                  <Text style={[styles.optionText, opt.value === value && styles.optionTextSelected]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  selectText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  chevron: {
    fontSize: 12,
    color: colors.gray500,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    width: '80%',
    maxHeight: 300,
    ...shadows.lg,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  optionSelected: {
    backgroundColor: colors.gray100,
  },
  optionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
});
