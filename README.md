# Team Coco App - React Native

A React Native conversion of the Team Coco web app, built with Expo.

## Features

- **Home Screen**: Latest video clip, platform links, HBO Max show, contact info
- **Videos Screen**: Filterable and sortable video library
- **Shows Screen**: Upcoming and past tour dates
- **Merch Screen**: Merchandise store with category filters
- **Community Screen**: Discussions with posting, fan art gallery
- **Team Screen**: Meet the Team Coco members

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (Bottom Tabs)
- **Storage**: AsyncStorage (for caching API responses)
- **Icons**: React Native Vector Icons (Ionicons)
- **Styling**: StyleSheet with centralized theme

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Header.tsx
│   ├── VideoCard.tsx
│   ├── ShowCard.tsx
│   ├── MerchCard.tsx
│   ├── TeamCard.tsx
│   ├── PostCard.tsx
│   ├── FanArtCard.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   └── LoadingSpinner.tsx
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   ├── VideosScreen.tsx
│   ├── ShowsScreen.tsx
│   ├── MerchScreen.tsx
│   ├── CommunityScreen.tsx
│   └── TeamScreen.tsx
├── services/         # Data services with caching
│   ├── BaseDataService.ts
│   ├── VideoService.ts
│   ├── ShowsService.ts
│   └── MerchService.ts
├── data/             # Mock data
│   └── mockData.ts
├── theme/            # Theme configuration
│   └── colors.ts
├── navigation/       # Navigation setup
│   └── MainNavigator.tsx
├── types/            # TypeScript types
│   └── index.ts
└── App.tsx           # Main app component
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Data Services

The app uses a caching strategy for API calls:

1. **First load**: Checks AsyncStorage for cached data
2. **Cache hit**: Returns cached data immediately, triggers background refresh
3. **Cache miss**: Fetches from Cloudflare Worker proxies with 8s timeout
4. **Error handling**: Falls back to stale cache if available, otherwise shows error state

### API Endpoints (via Cloudflare Workers)

- Videos: `https://teamcoco-youtube-proxy.eam--oco--pp.workers.dev/latest`
- Shows: `https://teamcoco-shows-proxy.eam--oco--pp.workers.dev/shows`
- Merch: `https://teamcoco-merch-proxy.eam--oco--pp.workers.dev/merch`

### Cache Configuration

- Videos: 24 hours
- Shows: 24 hours
- Merch: 6 hours

## Key Features Implemented

### Home Screen
- Latest YouTube video embedded via iframe (with WebView fallback)
- "Watch on YouTube" deep link button
- Platform links (YouTube, Apple Podcasts, Spotify, TeamCoco.com)
- HBO Max show promotion
- Contact information with clickable phone/email links

### Videos Screen
- Category filter: All, Clips, Full Episodes, Behind the Scenes, Interviews
- Sort options: Newest, Oldest, Most Popular
- Responsive grid layout

### Shows Screen
- Toggle between Upcoming and Past shows
- Date-based filtering
- Ticket links for upcoming shows

### Merch Screen
- Category filter: All, Apparel, Accessories, Collectibles
- Product cards with images, prices, and buy buttons

### Community Screen
- Discussions tab with new post form (500 char limit)
- Like/Reply/Share actions on posts
- Fan Art tab with image grid

### Team Screen
- Team member cards with photos, roles, and bios

## Styling

The app uses a centralized theme system in `src/theme/colors.ts`:

- **Primary Color**: #FF6B00 (Team Coco Orange)
- **Typography**: System fonts with consistent sizing
- **Spacing**: 4px base unit
- **Border Radius**: 4px, 8px, 12px, 16px
- **Shadows**: Small, Medium, Large elevations

## Platform-Specific Notes

### iOS
- Uses safe area insets automatically
- Status bar styled for dark content

### Android
- Edge-to-edge rendering
- Hardware back button handled by React Navigation

### Web
- Responsive design up to 500px max width
- Touch-friendly interactions

## Adding Real Images

Replace placeholder images in `assets/images/`:
- `logo.png` - App icon/logo
- `Conan.png`, `Sona.png`, `Gourley.png` - Team member photos
- `platforms/*.svg` - Platform icons (YouTube, Apple Podcasts, Spotify, Web)

## License

MIT