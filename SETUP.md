# SafeWalk - Setup & Getting Started Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd d:/projects/safewalk
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

### Step 3: Choose Your Platform
When the QR code appears, press:
- `i` for iOS simulator (macOS only)
- `a` for Android emulator
- `w` for web browser

---

## 📱 Running on Physical Device

### iOS
1. Download **Expo Go** from App Store
2. Scan QR code shown in terminal
3. App opens automatically

### Android
1. Download **Expo Go** from Google Play
2. Tap the QR code scanner
3. Scan code from terminal

---

## 🔍 Code Tour

### Start Here: Entry Point
**File**: `App.tsx`
- Main app component
- Navigation setup
- Splash screen initialization

### Main Navigation
**File**: `src/navigation/RootNavigator.tsx`
- Stack navigation (auth flow, modals)
- Screen routing logic

**File**: `src/navigation/TabNavigator.tsx`
- Bottom tab navigation
- 5 main tabs (Home, Report, Escort, Activity, Profile)

### Home Screen (Most Complex)
**File**: `src/screens/HomeScreen.tsx`
- Map display
- Search functionality
- Floating action buttons
- Route information card

### Theme System
**files**: `src/theme/colors.ts`, `typography.ts`, `spacing.ts`
- All design tokens defined here
- Used by all components
- Easy to modify for branding

---

## 🛠️ Making Your First Change

### Change the Primary Color
1. Open `src/theme/colors.ts`
2. Change `primary: '#2563EB'` to your color
3. Save file
4. App hot-reloads automatically

### Add a New Screen
1. Create `src/screens/MyNewScreen.tsx`
2. Export from `src/screens/index.ts`
3. Add to navigation in `src/navigation/RootNavigator.tsx`
4. Add to tab in `src/navigation/TabNavigator.tsx` (if needed)

### Create a New Component
1. Create folder `src/components/[Type]/[ComponentName].tsx`
2. Copy structure from similar component
3. Use theme tokens
4. Export from `src/components/index.ts`

---

## 📊 File Organization Principles

### Components
- One component per file
- Props interface always defined
- Use theme tokens, never hardcode colors/sizes
- Export from parent `index.ts`

### Screens
- Import theme at top: `import { COLORS, SPACING } from '../theme'`
- Use `StyleSheet.create()` for styles
- Handle navigation props properly
- Export from `screens/index.ts`

### Services
- Async functions for API calls
- Placeholder methods ready for real backend
- Exported as default class

### Utils
- Pure functions (no side effects)
- Fully typed with TypeScript
- Tested independently

---

## 🎨 Using the Design System

### Import Theme
```typescript
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
```

### Access Color
```typescript
backgroundColor: COLORS.primary           // Main blue
backgroundColor: COLORS.riskLevel.safe    // Green
backgroundColor: COLORS.text.primary      // Text color
```

### Access Typography
```typescript
fontSize: TYPOGRAPHY.sizes.base           // 16px
fontWeight: TYPOGRAPHY.weights.bold       // '700'
...TYPOGRAPHY.styles.h2                   // Full style object
```

### Access Spacing
```typescript
padding: SPACING.lg                       // 20px
marginVertical: SPACING.md                // 12px
...SHADOWS.md                             // Box shadow
borderRadius: BORDER_RADIUS.lg            // 16px
```

---

## 🚀 Running on Android Emulator

### First Time Setup
```bash
# Install Android emulator (via Android Studio)
# Or use command line:
sdkmanager "system-images;android-34;google_apis_playstore;x86_64"
avdmanager create avd -n Pixel_5 -k "system-images;android-34;google_apis_playstore;x86_64"
```

### Start Emulator
```bash
emulator -avd Pixel_5
```

### Run App
```bash
npm start
# Press: a
```

---

## 🍎 Running on iOS Simulator

### Prerequisites
- macOS only
- Xcode Command Line Tools: `xcode-select --install`

### Start Simulator
```bash
ios-sim start --devicetype "iPhone 15"
```

### Run App
```bash
npm start
# Press: i
```

---

## 🌐 Running on Web

### Start Web Version
```bash
npm start
# Press: w
```

Browser opens with your app running. Hot reload works here too!

---

## 📲 Debugging

### React Native Debugger
```bash
npm install --save-dev react-native-debugger
```

### View Console Logs
```bash
npm start
# Logs appear in terminal
```

### Inspect Network Requests
1. Open React Native Debugger
2. Press `Cmd+D` (iOS) or `Cmd+M` (Android)
3. Select "Debug"

---

## 🔧 Common Tasks

### Clear Cache
```bash
npm start -- --clear
```

### Reinstall Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

### Run Linter
```bash
npm run lint
```

---

## 🐛 Troubleshooting

### Issue: "Module not found: react-native-maps"
**Solution**:
```bash
expo install react-native-maps
```

### Issue: "Cannot find module 'expo-location'"
**Solution**:
```bash
npm install expo-location
```

### Issue: App stuck on splash screen
**Solution**:
```bash
npm start -- --clear
```

### Issue: Port 8081 already in use
**Solution**:
```bash
npm start -- --port 8090
```

### Issue: Module cache errors
**Solution**:
```bash
watchman watch-del-all
npm start -- --clear
```

---

## 📝 Development Tips

### Hot Reload
- Save a file and press `R` on iOS/Android
- Or shake device and select "Reload"

### Debug Messages
```typescript
console.log('Value:', someVariable);     // Always printed
console.warn('Warning!');                 // Yellow warning
console.error('Error!');                  // Red error
```

### Performance Check
- Android: Press `Cmd+M` → Performance Monitor
- iOS: Press `Cmd+D` → Perf Monitor

### Inspect Element (Web)
- Right-click → Inspect
- Use Chrome DevTools as normal

---

## 🚀 Next Steps After Setup

1. **Understand the Flow**
   - Start with `App.tsx`
   - Trace through `RootNavigator` → `TabNavigator`
   - Open `HomeScreen.tsx` and understand map display

2. **Modify Design**
   - Change colors in `src/theme/colors.ts`
   - See changes instantly
   - Experiment with spacing & typography

3. **Create Your First Component**
   - Copy `Button.tsx` structure
   - Create new component in `src/components/`
   - Use it in a screen

4. **Connect Backend**
   - Update `firebaseService.ts` with real API
   - Test with mock data first
   - Then integrate real endpoints

5. **Add State Management**
   - Install Redux: `npm install redux react-redux`
   - Create store & slices
   - Connect screens to Redux

---

## 📚 Learn More

- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## ✅ You're All Set!

Your SafeWalk development environment is ready. 

**Next**: Open `App.tsx` and start exploring! 🚀

---

**Questions?** Check [ARCHITECTURE.md](./ARCHITECTURE.md) for comprehensive documentation.
