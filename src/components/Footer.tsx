import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';

export interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.line}>Chill Chum Hub v1.0 • Built by Aarav Mehta</Text>
        <Text style={styles.copyright}>Unofficial Fan Project. Not affiliated with Team Coco</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderTopWidth: 3,
    borderTopColor: '#FF6B00',
    marginHorizontal: -16,
    marginTop: 24,
    width: 'auto',
  },
  content: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%',
  },
  line: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4,
  },
  copyright: {
    color: '#6B7280',
    fontSize: 12,
  },
});