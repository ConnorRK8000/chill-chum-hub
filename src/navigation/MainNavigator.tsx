import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Polygon, Polyline, Rect, Line, Circle } from 'react-native-svg';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '../components/Toast';
import { Header, NavTab } from '../components/Header';
import { colors, spacing } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { VideosScreen } from '../screens/VideosScreen';
import { ShowsScreen } from '../screens/ShowsScreen';
import { MerchScreen } from '../screens/MerchScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { TeamScreen } from '../screens/TeamScreen';
import { CocktailScreen } from '../screens/CocktailScreen';

const HomeIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const VideosIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="23 7 16 12 23 17 23 7" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </Svg>
);

const ShowsIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const MerchIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="9" cy="21" r="1" />
    <Circle cx="20" cy="21" r="1" />
    <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Svg>
);

const PeopleIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const CocktailIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8 2h8l-1 7H9L8 2z" />
    <Path d="M6 9h12l-1.5 5.5A4 4 0 0 1 12.64 18H11.36a4 4 0 0 1-3.86-3.5L6 9z" />
    <Line x1="12" y1="18" x2="12" y2="22" />
    <Line x1="8" y1="22" x2="16" y2="22" />
  </Svg>
);

const tabs: NavTab[] = [
  {
    name: 'home',
    label: 'Home',
    icon: <HomeIcon />,
  },
  {
    name: 'videos',
    label: 'Videos',
    icon: <VideosIcon />,
    hidden: true,
  },
  {
    name: 'shows',
    label: 'Upcoming Shows',
    icon: <ShowsIcon />,
  },
  {
    name: 'merch',
    label: 'Merch',
    icon: <MerchIcon />,
  },
  {
    name: 'community',
    label: 'Community',
    icon: <PeopleIcon />,
    hidden: true,
  },
  {
    name: 'cocktails',
    label: 'Cocktails',
    icon: <CocktailIcon />,
  },
  {
    name: 'team',
    label: 'Meet The Chums',
    icon: <PeopleIcon />,
  },
];

const screenComponents = {
  home: HomeScreen,
  videos: VideosScreen,
  shows: ShowsScreen,
  merch: MerchScreen,
  community: CommunityScreen,
  cocktails: CocktailScreen,
  team: TeamScreen,
};

export const MainTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'shows' | 'merch' | 'community' | 'cocktails' | 'team'>('home');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName as any);
  };

  const ActiveScreen = screenComponents[activeTab];

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <View style={styles.container}>
          <Header
            activeTab={activeTab}
            onTabPress={handleTabPress}
            tabs={tabs}
          />
          <View style={styles.content}>
            <ActiveScreen />
          </View>
        </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  footerWrapper: {
    marginTop: 'auto',
  },
});