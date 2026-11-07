import { ImageSourcePropType } from 'react-native';

export interface Video {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  duration: string;
  views: string;
  date: string;
  thumbnail: string;
  videoId?: string;
  platforms?: Platform[];
}

export type VideoCategory = 'all' | 'clips' | 'full-episodes' | 'behind-scenes' | 'interviews';

export interface Platform {
  name: string;
  url: string;
  icon: string;
}

export interface Show {
  id: string;
  date: string;
  day: string;
  month: string;
  venue: string;
  city: string;
  ticketUrl: string;
}

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: MerchCategory;
  url?: string;
}

export type MerchCategory = 'all' | 'apparel' | 'accessories' | 'collectibles';

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
}

export interface FanArt {
  id: string;
  title: string;
  author: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: ImageSourcePropType;
}

export interface Sponsor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  url: string;
}

export interface VideoResponse {
    videoId?: string;
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnail?: string;
    thumbnailUrl?: string;
    error?: boolean;
    message?: string;
    _stale?: boolean;
}

export interface ShowsResponse {
  shows?: Show[];
  error?: boolean;
  message?: string;
  _stale?: boolean;
}

export interface MerchResponse {
  products?: MerchItem[];
  error?: boolean;
  message?: string;
  _stale?: boolean;
}

export type TabName = 'home' | 'videos' | 'shows' | 'merch' | 'community' | 'team';

export interface NavigationProps {
  navigation: any;
  route: any;
}