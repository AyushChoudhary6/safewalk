# SafeWalk — Profile Screen Improvement Context

> Paste this entire file into a Copilot chat session (or GitHub Copilot Workspace) and say:
> **"Follow this context file step by step and implement every change listed to improve the profile screen."**

---

## Project Snapshot

| Detail | Value |
|---|---|
| Framework | React Native + Expo |
| Primary File | `src/screens/ProfileScreen.tsx` |
| Goal | Make the static ProfileScreen fully functional and dynamic by plugging in real user data and button actions |
| Auth Service | `src/services/firebaseService.ts` |
| Theme System | `src/theme/` — Must strictly adhere to `COLORS`, `SPACING`, `TYPOGRAPHY` |

---

## Change 1 — Make the Profile Info Dynamic

### Context

Currently, the `<View style={styles.profileInfo}>` hardcodes the name "Alex Johnson" and email "<alex@example.com>". We need to hydrate this using the active Firebase user from `src/services/firebaseService.ts`.

### Step 1a — Import `auth` and Add State

Open `src/screens/ProfileScreen.tsx`.
At the top of the file, import `useEffect` and `useState` (if not already imported), and import `auth` alongside the default `FirebaseService`:

```tsx
import React, { useState, useEffect } from 'react';
import FirebaseService, { auth } from '../services/firebaseService';
```

Inside the `ProfileScreen` component, right after the other `useState` calls, add a handler to read the logged-in user:

```tsx
  const [userData, setUserData] = useState<{ name: string; email: string }>({
    name: 'SafeWalk User',
    email: 'Loading...',
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserData({
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'SafeWalk User',
        email: currentUser.email || 'user@example.com',
      });
    }
  }, []);
```

### Step 1b — Update the Header JSX

Find the hardcoded "Alex Johnson" and "<alex@example.com>" text nodes within `styles.profileInfo`:

```tsx
<View style={styles.profileInfo}>
  <Text style={styles.userName}>{userData.name}</Text>
  <Text style={styles.userEmail}>{userData.email}</Text>
  <View style={styles.trustBadge}>
...
```

Replace the hardcoded strings with `{userData.name}` and `{userData.email}`.

---

## Change 2 — Hook Up Empty "Account Options" Actions

### Context

Right now, the list options for **"Profile", "Timeline", "Location sharing", "Offline maps", and "Your data in maps"** are dead `<TouchableOpacity>` blocks with no feedback. We'll wire them up to a unified "Coming Soon" notification so the app feels robust during the MVP phase.

### Step 2a — Create a Global Feedback Handler

Inside the `ProfileScreen` component function (above `handleLogout`), create this handler:

```tsx
  const handleFeatureNotReady = (featureName: string) => {
    Alert.alert(
      featureName,
      'This feature is currently under development. Check back in a future update!',
      [{ text: 'Got it' }]
    );
  };
```

### Step 2b — Inject `onPress` Props into the UI

Scroll down to the `{/* Account Options */}` section. Add the `onPress` prop to each `<TouchableOpacity style={styles.settingItem}>`:

1. **Profile**:

   ```tsx
   <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Edit Profile')}>
   ```

2. **Timeline**:

   ```tsx
   <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Timeline History')}>
   ```

3. **Location sharing**:

   ```tsx
   <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Location Sharing')}>
   ```

4. **Offline maps**:

   ```tsx
   <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Offline Maps')}>
   ```

5. **Your data in maps**:

   ```tsx
   <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Your Data & Privacy')}>
   ```

---

## Change 3 — Implement "Help & Support"

### Context

In the `{/* About */}` section at the very bottom, "Help & Support" should act as an actual pipeline to contact the SafeWalk team.

### Step 3a — Import `Linking`

At the top of `ProfileScreen.tsx`, ensure `Linking` is imported from `react-native`:

```tsx
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
```

### Step 3b — Add Support Handler

Add the support handler right below your `handleFeatureNotReady` function:

```tsx
  const handleSupport = () => {
    Linking.openURL('mailto:support@safewalk.app?subject=SafeWalk Help & Support Request')
      .catch((err) => Alert.alert('Error', 'Unable to open email client.'));
  };
```

### Step 3c — Attach to the Support Button

Locate `{/* Help & Support */}` and add `onPress`:

```tsx
  {/* Help & Support */}
  <TouchableOpacity style={styles.settingItem} onPress={handleSupport}>
    <View style={styles.settingIcon}>
      <MaterialCommunityIcons name="help-circle-outline" size={20} color={COLORS.primary} />
    </View>
...
```

---

## Final Checklist for Copilot

Work through each item in order. After each change, save and run the Expo bundler to confirm no TypeScript errors.

```
[ ] 1. Import `useEffect`, `Linking`, and `{ auth }` from FirebaseService.
[ ] 2. Initialize `userData` state reading `auth.currentUser`.
[ ] 3. Update the hardcoded "Alex Johnson" UI block with `{userData.name}` and email.
[ ] 4. Add `handleFeatureNotReady(featureName)` logic.
[ ] 5. Add `onPress` to Profile, Timeline, Location Sharing, Offline Maps, and Your Data buttons, firing the "not ready" alert.
[ ] 6. Add `handleSupport()` logic utilizing `Linking.openURL(...)`.
[ ] 7. Add `onPress={handleSupport}` to the Help & Support button.
[ ] 8. Maintain perfect TypeScript and respect all imported styling/theme variables.
```
