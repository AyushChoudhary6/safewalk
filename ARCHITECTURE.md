<!-- SafeWalk Project Documentation -->

# SafeWalk 🛡️

**SafeWalk** is a community-powered safety navigation app that helps users choose safer walking routes, report safety incidents, receive alerts when entering risk zones, request escorts, and trigger emergency safety checks.

## Vision

SafeWalk feels trustworthy, calm, minimal, and map-first—similar to Google Maps or Uber. The app informs users without causing panic, with safety signals that are visual and subtle.

---

## 🏗️ Project Architecture

### Folder Structure

```
safewalk/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button/          # Primary, Secondary, Text buttons
│   │   ├── Cards/           # RouteCard, SafetyBadge
│   │   ├── Map/             # SafeWalkMapView, SearchBar
│   │   ├── Alerts/          # AlertModal
│   │   ├── Markers/         # IncidentMarker
│   │   └── index.ts         # Component exports
│   │
│   ├── screens/             # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx          # Main map interface
│   │   ├── NavigationModeScreen.tsx # Active walk interface
│   │   ├── ReportIncidentScreen.tsx
│   │   ├── EscortScreen.tsx
│   │   ├── ActivityScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PremiumScreen.tsx
│   │   └── index.ts
│   │
│   ├── navigation/          # Navigation setup
│   │   ├── RootNavigator.tsx       # Stack navigation orchestration
│   │   ├── TabNavigator.tsx        # Bottom tab navigation
│   │   └── index.ts
│   │
│   ├── theme/               # Design system
│   │   ├── colors.ts               # Color palette
│   │   ├── typography.ts           # Typography scale
│   │   ├── spacing.ts              # Spacing & shadows
│   │   └── index.ts
│   │
│   ├── services/            # Business logic & APIs
│   │   ├── mapsService.ts          # Map utilities & route calculation
│   │   ├── firebaseService.ts      # Firebase integration (placeholder)
│   │   └── index.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── safetyScore.ts          # Safety score calculation
│   │   ├── routeUtils.ts           # Route analysis utilities
│   │   └── index.ts
│   │
│   └── constants/           # App constants
│       ├── incidentTypes.ts        # Incident type definitions
│       ├── riskLevels.ts           # Risk level definitions
│       └── index.ts
│
├── App.tsx                  # Root component & entry point
├── app.json                 # Expo configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## 🎨 Design System

### Color Palette

| Color      | Hex       | Usage                  |
| ---------- | --------- | ---------------------- |
| Primary    | #2563EB   | Main actions, focus    |
| Safe       | #22C55E   | Low risk, success      |
| Warning    | #F59E0B   | Moderate risk, alerts  |
| Danger     | #EF4444   | High risk, emergencies |
| Background | #F9FAFB   | App background         |
| Card       | #FFFFFF   | Component backgrounds  |
| Primary Text | #111827  | Main content           |
| Secondary Text | #6B7280 | Supporting text       |
| Border     | #E5E7EB   | Dividers, outlines     |

### Typography Scale

| Level     | Size | Weight | Usage                  |
| --------- | ---- | ------ | ---------------------- |
| H1        | 28   | 700    | Page titles            |
| H2        | 22   | 600    | Section headers        |
| H3        | 18   | 600    | Subsection headers     |
| Body      | 16   | 400    | Body text              |
| Small     | 14   | 400    | Secondary text         |
| Caption   | 12   | 400    | Helper text, captions  |

### Spacing System

| Token | Value |
| ----- | ----- |
| xs    | 4px   |
| sm    | 8px   |
| md    | 12px  |
| base  | 16px  |
| lg    | 20px  |
| xl    | 24px  |
| xxl   | 32px  |

---

## 📱 Screen Specifications

### 1. Splash Screen
- Centered logo with shield icon
- App name "SafeWalk"
- Tagline: "Safer routes powered by community"
- Blue gradient background
- 2-second animation

### 2. Login Screen
- Email & password fields
- Continue button
- "Login with Google" option
- Sign up link
- Privacy policy & terms links

### 3. Home Screen (Main Map Interface)
- Full-screen map with user location
- Top search bar: "Where are you going?"
- Route information card (floating)
- Safety colored route segments (green/yellow/red)
- Incident markers on map
- Floating SOS button (bottom-right)
- Floating Report button (secondary, bottom-right)

### 4. Navigation Mode Screen
- Full-screen map during active walk
- Top bar: Back button, distance, ETA, help
- Progress indicator
- Safety alert notifications
- Bottom control bar: Call, Share, Check-in, Emergency

### 5. Report Incident Screen
- Modal overlay with mini map
- Incident type selector (5 types)
- Optional description field
- Anonymous submission guarantee
- Cancel & Submit buttons

### 6. Escort Screen
- Mini map showing nearby escorts
- List of available escorts with ratings
- Distance & verification badges
- Request button with ETA
- Selected escort details panel

### 7. Activity Screen
- User statistics cards
- Recent walks section
- Reported incidents
- Triggered alerts
- Timeline view with filtering

### 8. Profile Screen
- User avatar & info
- Premium upgrade card
- Safety & privacy settings
- Emergency contacts
- Notification toggles
- App info & terms
- Logout button

### 9. Premium Screen
- Monthly vs Annual plan comparison
- Feature list with locked/unlocked states
- Free trial offer
- Benefit cards
- Subscribe button

---

## 🛠️ Tech Stack

### Core Dependencies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform & managed services
- **React Navigation**: Navigation routing (v7+)
- **React Native Maps**: Interactive map display
- **Expo Location**: GPS & location services
- **Expo Notifications**: Push notifications
- **Expo Linear Gradient**: Linear gradient backgrounds

### Development
- **TypeScript**: Type-safe development
- **React Native Vector Icons**: Icon library

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Install dependencies
npm install

# Install additional Expo modules
npx expo install expo-location expo-notifications

# For macOS with M1/M2
npx expo install --fix
```

### Running the App

```bash
# Start Expo development server
npm start

# iOS (macOS only)
i

# Android
a

# Web
w
```

### Running on Physical Device

1. Download Expo Go from App Store / Google Play
2. Scan QR code from terminal using camera app (iOS) or Expo Go (Android)
3. App loads on device

---

## 📋 Component Usage Examples

### Using the PrimaryButton Component

```typescript
import { PrimaryButton } from '../components';

<PrimaryButton
  title="Start Walk"
  onPress={() => console.log('Started walk')}
  loading={isLoading}
  disabled={isDisabled}
/>
```

### Using the SafeWalkMapView Component

```typescript
import { SafeWalkMapView } from '../components';

<SafeWalkMapView
  initialRegion={{
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
  markers={incidents}
  routePath={routeWaypoints}
  routeColor={COLORS.safe}
/>
```

### Using Safety Score Utility

```typescript
import { calculateSafetyScore, getSafetyLevel } from '../utils';

const score = calculateSafetyScore({
  incidentCount: 2,
  averageIncidentSeverity: 0.3,
  lightingQuality: 0.8,
  trafficVolume: 0.5,
  policePresence: 0.6,
  communityRating: 0.75,
});

const level = getSafetyLevel(score); // 'low' | 'moderate' | 'high'
```

---

## 🔐 Security & Privacy

- Anonymous incident reporting
- End-to-end encrypted emergency alerts
- Location data only shared during active walks
- GDPR & privacy-first design
- No third-party ad tracking
- Placeholder Firebase integration ready for real backend

---

## 🎯 Key Features Implemented

✅ **Map-First Interface** - Intuitive navigation with interactive maps
✅ **Route Safety Scoring** - Color-coded routes (green/yellow/red)
✅ **Incident Reporting** - Community-driven safety data
✅ **Escort Requests** - Connect with verified volunteers
✅ **Emergency SOS** - One-tap emergency alerts with countdown
✅ **Activity Tracking** - User safety journey history
✅ **Premium Features** - Subscription model UI
✅ **Responsive Design** - Works on all phone sizes
✅ **Accessible UI** - 44px minimum tap targets, readable fonts
✅ **Polish Animations** - Subtle transitions & interactions

---

## 📊 Placeholder Logic

The app includes placeholder implementations for:

1. **Safety Score Calculation** - Mock algorithm in `safetyScore.ts`
2. **Incident Fetching** - Returns mock incident data in `mapsService.ts`
3. **Route Segmentation** - Mock safety-scored segments in `routeUtils.ts`
4. **Firebase Integration** - Placeholder methods in `firebaseService.ts`
5. **User Authentication** - Mock login flow in `LoginScreen.tsx`

These are production-ready code structures that connect to a real backend API.

---

## 🔄 Redux / State Management

For production, integrate with:
- **Redux Toolkit** for app state
- **Redux Persist** for offline capability
- **Redux Saga** for side effects

Current implementation uses React hooks and context (scalable up).

---

## 🧪 Testing

To add testing:

```bash
npm install --save-dev @testing-library/react-native jest
```

Example test structure:

```typescript
import { render } from '@testing-library/react-native';
import { PrimaryButton } from '../components';

describe('PrimaryButton', () => {
  it('calls onPress when tapped', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Test" onPress={mockPress} />
    );
    fireEvent.press(getByText('Test'));
    expect(mockPress).toHaveBeenCalled();
  });
});
```

---

## 🚢 Deployment

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

### Configuration

Create `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "ios": { "buildType": "simulator" }
    },
    "preview2": {
      "android": { "buildType": "apk" },
      "ios": { "buildType": "simulator" }
    },
    "preview3": {
      "android": { "buildType": "apk" },
      "ios": { "buildType": "simulator" }
    },
    "production": {}
  }
}
```

---

## 🤝 Contributing

1. Follow the existing component structure
2. Use the centralized theme system
3. All components must be responsive
4. Add TypeScript types
5. Test on both iOS & Android

---

## 📝 License

SafeWalk © 2026. All rights reserved.

---

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [React Navigation Docs](https://reactnavigation.org)
- [Expo Docs](https://docs.expo.dev)
- [TypeScript in React Native](https://www.typescriptlang.org/docs/handbook/react.html)

---

## 💡 Next Steps

1. **Connect Backend**: Replace Firebase placeholders with real APIs
2. **Add State Management**: Implement Redux for complex state
3. **Offline Support**: Add local storage & sync
4. **Analytics**: Integrate crash & event tracking
5. **Push Notifications**: Configure Firebase Cloud Messaging
6. **Maps Provider**: Choose Google Maps or Mapbox
7. **Testing**: Add Jest & React Testing Library
8. **CI/CD**: Setup GitHub Actions for builds
9. **App Store**: Submit to Apple App Store & Google Play
10. **Community Features**: Real-time incident updates, ratings system

---

## 📞 Support

For issues or questions, refer to the individual component documentation or the tech stack guides above.

---

**SafeWalk: Safer routes powered by community** 🛡️
