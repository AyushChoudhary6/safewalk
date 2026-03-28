# SafeWalk Design System Style Guide

## Quick Start Guide

### Color Usage

```typescript
import { COLORS, SEMANTIC_COLORS } from '../theme/colors';

// Primary actions
backgroundColor: COLORS.accent // #2563EB (Blue)

// Text
color: COLORS.text.primary    // #111827 (Dark gray)
color: COLORS.text.secondary  // #6B7280 (Medium gray)
color: COLORS.text.tertiary   // #9CA3AF (Light gray)

// Risk indicators
color: COLORS.riskLevel.low      // Green #10B981
color: COLORS.riskLevel.moderate // Orange #F59E0B
color: COLORS.riskLevel.high     // Red #EF4444
color: COLORS.riskLevel.critical // Dark Red #DC2626

// Semantic usage
backgroundColor: SEMANTIC_COLORS.success  // Green
backgroundColor: SEMANTIC_COLORS.error    // Red
backgroundColor: SEMANTIC_COLORS.warning  // Orange
```

### Spacing System

```typescript
import { SPACING, PADDING, BORDER_RADIUS } from '../theme/spacing';

// Use 8px base unit
marginVertical: SPACING.md      // 12px
paddingHorizontal: SPACING.lg   // 20px
gap: SPACING.base               // 16px

// Border radius
borderRadius: BORDER_RADIUS.md  // 12px
borderRadius: BORDER_RADIUS.lg  // 16px (cards)
borderRadius: BORDER_RADIUS.full // 9999px (circles)
```

### Typography

```typescript
import { TYPOGRAPHY } from '../theme/typography';

// Sizes
fontSize: TYPOGRAPHY.sizes.xs   // 12px (captions)
fontSize: TYPOGRAPHY.sizes.base // 16px (body)
fontSize: TYPOGRAPHY.sizes.h1   // 28px (headings)

// Weights
fontWeight: TYPOGRAPHY.weights.medium    // 500
fontWeight: TYPOGRAPHY.weights.semibold  // 600
fontWeight: TYPOGRAPHY.weights.bold      // 700

// Predefined styles
...TYPOGRAPHY.styles.h1        // h1 with size, weight, spacing
...TYPOGRAPHY.styles.body      // body text
...TYPOGRAPHY.styles.caption   // small text
```

### Shadows

```typescript
import { SHADOWS } from '../theme/spacing';

// Light shadow (cards)
...SHADOWS.xs  // Very subtle

// Medium shadow
...SHADOWS.md  // Standard cards

// Large shadow (floating)
...SHADOWS.lg  // Bottom sheets, modals

// Extra large
...SHADOWS.xl  // Full-screen modals
```

### Animations

```typescript
import { ANIMATION_TIMING } from '../theme/spacing';
import { createFadeScaleAnimation } from '../utils/animations';

// Quick interactions
duration: ANIMATION_TIMING.xs  // 150ms

// Standard transitions
duration: ANIMATION_TIMING.md  // 300ms

// Smooth animations
duration: ANIMATION_TIMING.lg  // 500ms

// Use reusable animation helpers
const { opacity, scale, start } = createFadeScaleAnimation(300);
```

## Component Examples

### Using Design System Patterns

```typescript
import { cardStyles, containerStyles, badgeStyles } from '../theme/patterns';

// Create a card
<View style={cardStyles.elevated}>
  <Text>Content</Text>
</View>

// Create a badge
<View style={badgeStyles.success}>
  <Text>Success</Text>
</View>

// Create a centered container
<View style={containerStyles.centered}>
  <Text>Centered content</Text>
</View>
```

### Professional Button Usage

```typescript
import { PrimaryButton, SecondaryButton, DangerButton } from '../components/Button/Button';

// Main action
<PrimaryButton
  title="Start Navigation"
  icon="play-circle"
  onPress={handleStart}
  size="lg"
/>

// Alternative action
<SecondaryButton
  title="Choose Route"
  icon="map-search"
  onPress={handleChoose}
/>

// Destructive action
<DangerButton
  title="Cancel SOS"
  icon="alert-off"
  onPress={handleCancel}
/>
```

### SearchBar with Animations

```typescript
import { SearchBar } from '../components/Map/SearchBar';

<SearchBar
  placeholder="Search location..."
  value={searchQuery}
  onChangeText={setSearchQuery}
  onClear={() => setSearchQuery('')}
  onFocus={handleFocus}
/>
// Automatically animates on focus!
```

### IncidentCard with Rich Info

```typescript
import { IncidentCard } from '../components/IncidentCard';

<IncidentCard
  incident={incident}
  onPress={() => navigation.navigate('IncidentDetail', { incident })}
/>
// Automatically:
// - Shows severity color
// - Scales on press
// - Displays icons
// - Shows verification status
```

### RouteInfoCard - Professional Bottom Sheet

```typescript
import { RouteInfoCard } from '../components/RouteInfoCard';

<RouteInfoCard
  distance={5.2}
  duration={1200} // seconds
  trafficLevel="low"
  mode="driving-car"
  onStart={handleStart}
  onCancel={handleCancel}
/>
// Features:
// - Smooth entrance animation
// - Professional layout
// - Icon-based info cards
// - Tabbed content
// - Animated buttons
```

## Design Patterns

### Risk Level Color Coding

```typescript
const getRiskColor = (severity: number) => {
  if (severity >= 5) return COLORS.riskLevel.critical;
  if (severity >= 4) return COLORS.riskLevel.high;
  if (severity >= 3) return COLORS.riskLevel.moderate;
  return COLORS.riskLevel.low;
};

// Usage
<View style={{ backgroundColor: getRiskColor(incident.severity) + '15' }}>
  {/* Content */}
</View>
```

### Card Container Pattern

```typescript
import { cardStyles } from '../theme/patterns';

// Elevated (with shadow)
<View style={cardStyles.elevated}>
  {/* Main content */}
</View>

// Subtle (light shadow + border)
<View style={cardStyles.subtle}>
  {/* Secondary content */}
</View>

// Filled (surface color)
<View style={cardStyles.filled}>
  {/* Grouped content */}
</View>
```

### Icon Container Pattern

```typescript
import { iconContainerStyles, COLORS } from '../theme';

<View style={[iconContainerStyles.medium, { backgroundColor: COLORS.accent + '15' }]}>
  <MaterialCommunityIcons name="map-marker" color={COLORS.accent} />
</View>
```

## Responsive Design

### Mobile First Approach

```typescript
// Base styles for mobile
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  // For larger screens, override using a separate component or hook
});
```

### Safe Area Handling

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={containerStyles.screen}>
  {/* Content automatically respects notches */}
</SafeAreaView>
```

## Accessibility Best Practices

### Touch Targets
- Minimum 44x44 points (iOS) / 48x48 dips (Android)
- All buttons and interactive elements meet this

### Color Contrast
- Text: 4.5:1 ratio (AA compliant)
- Graphics: 3:1 ratio
- Status indicators: All colors pass WCAG AA

### Screen Reader Support

```typescript
// Add accessibility labels
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Start navigation button"
  accessibilityRole="button"
  onPress={handleStart}
>
  <Text>Start</Text>
</TouchableOpacity>
```

## Performance Tips

### Animation Best Practices

```typescript
// ✅ Good - Uses native driver
Animated.timing(anim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,  // GPU acceleration
}).start();

// ❌ Avoid - No native driver
Animated.timing(anim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: false,  // CPU calculation
}).start();
```

### Rendering Optimization

```typescript
// Use useMemo for expensive calculations
const colors = useMemo(() => ({
  primary: COLORS.accent,
  secondary: COLORS.text.secondary,
}), []);

// Use useCallback for event handlers
const handlePress = useCallback(() => {
  // Do something
}, []);
```

## Common Patterns

### Loading State

```typescript
<View style={stateIndicatorStyles.loading}>
  <ActivityIndicator color={COLORS.primary} />
  <Text style={{ marginLeft: SPACING.md }}>Loading...</Text>
</View>
```

### Success State

```typescript
<View style={stateIndicatorStyles.success}>
  <MaterialCommunityIcons name="check-circle" color={COLORS.safe} />
  <Text style={{ color: COLORS.safe, marginLeft: SPACING.md }}>
    Success!
  </Text>
</View>
```

### Error State

```typescript
<View style={stateIndicatorStyles.error}>
  <MaterialCommunityIcons name="alert-circle" color={COLORS.danger} />
  <Text style={{ color: COLORS.danger, marginLeft: SPACING.md }}>
    Error occurred
  </Text>
</View>
```

## Theming

The system is currently light-mode focused. To add dark mode in the future:

```typescript
// Create light and dark theme objects
const lightTheme = { ... };
const darkTheme = { ... };

// Provide via context
const ThemeContext = createContext(lightTheme);
```

## File Organization

```
src/
├── theme/
│   ├── colors.ts        // Color definitions
│   ├── spacing.ts       // Spacing, shadows, timing
│   ├── typography.ts    // Typography system
│   ├── patterns.ts      // Reusable style patterns
│   └── index.ts         // Exports
├── utils/
│   └── animations.ts    // Animation utilities
└── components/
    ├── Button/
    ├── Map/
    └── ...
```

## Reference

- **Colors**: 60+ predefined colors with semantic aliases
- **Spacing**: 8px base unit with 10 levels (4-48px)
- **Typography**: 7 font sizes + 5 weights
- **Shadows**: 5-tier elevation system
- **Animations**: 5 preset durations + 7 reusable helpers
- **Components**: 8+ professionally styled components
- **Patterns**: 15+ reusable style patterns

---

Last Updated: March 28, 2026
