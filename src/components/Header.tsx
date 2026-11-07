import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ViewStyle, TextStyle, Platform } from 'react-native';
import Svg, { Path, Polygon, Polyline, Rect, Line, Circle } from 'react-native-svg';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

export interface NavTab {
  name: string;
  label: string;
  icon: React.ReactNode;
  hidden?: boolean;
}

export interface HeaderProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
  tabs: NavTab[];
  style?: ViewStyle;
}

const HomeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const ShirtIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7" />
    <Line x1="10" y1="2" x2="10" y2="4" />
    <Line x1="14" y1="2" x2="14" y2="4" />
  </Svg>
);

const PersonIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabPress,
  tabs,
  style,
}) => {
  const visibleTabs = tabs.filter(t => !t.hidden);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.logoContainer} activeOpacity={0.8}>
            <Image
              source={require('../../assets/images/resized-512x512.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Chill Chum Hub</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navScroll}
          contentContainerStyle={styles.navContainer}
        >
          {visibleTabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.navBtn,
                activeTab === tab.name ? styles.navBtnActive : styles.navBtnInactive,
              ]}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.8}
            >
              <View style={styles.navIcon}>{tab.icon}</View>
                <Text style={[styles.navLabel, activeTab === tab.name && styles.navLabelActive]} numberOfLines={1}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export interface SectionHeaderProps {
  title: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  style,
  titleStyle,
}) => {
  return (
    <View style={[styles.sectionContainer, style]}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={action.onPress} activeOpacity={0.8}>
          <Text style={styles.sectionAction}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Exact CSS: .app-header { background: linear-gradient(135deg, #000 0%, #111 100%); border-bottom: 3px solid #FF6B00; padding: 1rem 0; }
  container: {
    backgroundColor: '#000000',
    borderBottomWidth: 3,
    borderBottomColor: '#FF6B00',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    }),
  },
  // Exact CSS: .header-content { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
  headerContent: {
    flexDirection: 'column',
    alignItems: 'stretch',
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  // Exact CSS: .logo { display: flex; align-items: center; gap: 0.75rem (12px); padding: 1rem 0 (16px); font-size: 1.5rem (24px); font-weight: 800; }
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  // Exact CSS: .main-nav { display: flex; gap: 0.5rem (8px); padding-bottom: 0.5rem (8px); overflow-x: auto; }
  navScroll: {
    width: '100%',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { touchAction: 'pan-x' } : {}),
  },
  navContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingBottom: 8,
    alignItems: 'center',
    flexGrow: 0,
  },
  // Exact CSS: .nav-btn { padding: 0.625rem 1rem (10px 16px); font-size: 0.875rem (14px); font-weight: 600; border-radius: 8px; }
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    flexShrink: 0,
    marginRight: 8,
  },
  navBtnActive: {
    backgroundColor: '#FF6B00',
  },
  navBtnInactive: {
    backgroundColor: 'transparent',
  },
  navIcon: {
    width: 20,
    height: 20,
  },
  // Exact CSS: .nav-btn { font-size: 0.875rem (14px); font-weight: 600; color: gray-300 #D1D5DB }
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
    color: '#D1D5DB',
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B00',
  },
});