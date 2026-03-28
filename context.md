# SafeWalk — Copilot Master Improvement Context

> Paste this entire file into a Copilot chat session (or GitHub Copilot Workspace) and say:
> **"Follow this context file step by step and implement every change listed."**

---

## Project Snapshot

| Detail | Value |
|---|---|
| Framework | React Native + Expo (managed workflow) |
| Language | TypeScript (100% coverage) |
| Navigation | React Navigation v7 (Stack + Bottom Tab) |
| Maps | `react-native-maps` via `src/components/Map/` wrapper |
| Theme system | `src/theme/` — `COLORS`, `SPACING`, `TYPOGRAPHY`, `SHADOWS`, `BORDER_RADIUS` |
| Backend | Node / Express / TypeORM / SQLite at `http://<LAN_IP>:5050/api` |
| Mock data | `src/data/mockIncidents.ts` (10 incidents, Delhi coordinates) |

The **primary file to edit** for map-related UI is:
```
src/screens/HomeScreen.tsx
```
Supporting files that may need edits:
```
src/components/IncidentMarker.tsx        ← simple wrapper, re-used by HomeScreen
src/components/Markers/IncidentMarker.tsx ← richer component (tooltip style), NOT currently used by HomeScreen
src/data/mockIncidents.ts               ← mock crime data source
```

---

## Change 1 — Remove the "Central Park" and "City Coffee" Demo Markers

### What to do
Open `src/screens/HomeScreen.tsx`.

Find this entire block inside the `<MapView>` JSX (it sits right after the `{location && (` guard):

```tsx
{location && (
  <>
    <Marker
      coordinate={{ latitude: location.latitude + 0.005, longitude: location.longitude + 0.005 }}
      title="Central Park"
      pinColor="green"
      onPress={() => setSelectedPlace({
        id: '1',
        name: 'Central Park',
        ...
      })}
    />
    <Marker
      coordinate={{ latitude: location.latitude - 0.005, longitude: location.longitude - 0.005 }}
      title="City Coffee"
      pinColor="orange"
      onPress={() => setSelectedPlace({
        id: '2',
        name: 'City Coffee',
        ...
      })}
    />
  </>
)}
```

**Delete it completely.** Do not replace it with anything.

Also find the blue user-location marker immediately below it:

```tsx
{location && (
  <Marker
    coordinate={location}
    title="You are here"
    pinColor="blue"
  />
)}
```

**Delete this too.** The map already shows the real GPS dot because `showsUserLocation={true}` is set on `<MapView>`. Showing a manual blue pin on top is redundant and looks messy.

### Also remove the now-unused `selectedPlace` state and `PlaceDrawer`

Since the two POI markers that triggered `setSelectedPlace` are gone, the `PlaceDrawer` that appears only when `!routeParams` is no longer needed for POI purposes. Remove the following block near the bottom of the JSX:

```tsx
{!routeParams && (
  <PlaceDrawer
    place={selectedPlace}
    onClose={() => setSelectedPlace(null)}
    onDirections={(place) => {
      if (location) {
        calculateRoute({ ... }, routeMode);
      }
    }}
  />
)}
```

Remove the import:
```tsx
import { PlaceData, PlaceDrawer } from '../components/PlaceDrawer';
```

And remove the state declaration:
```tsx
const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
```

---

## Change 2 — Replace Default Pin Icons with Custom Professional Markers

### Context
`react-native-maps` `<Marker>` accepts a `children` prop that renders any React Native view as the map pin. We will replace all `pinColor` strings with clean, branded `<View>` components.

### Step 2a — Create a reusable `CustomMapPin` component

Create a new file: `src/components/Map/CustomMapPin.tsx`

```tsx
/**
 * CustomMapPin
 * Branded map marker that replaces the default react-native-maps pin.
 * Pass `type` to get the right icon and color automatically.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme';

export type PinType =
  | 'user'         // current user location
  | 'destination'  // route end point
  | 'THEFT'
  | 'HARASSMENT'
  | 'POOR_LIGHTING'
  | 'ASSAULT'
  | 'SUSPICIOUS_ACTIVITY';

interface PinConfig {
  emoji: string;
  bg: string;
  border: string;
}

const PIN_CONFIG: Record<PinType, PinConfig> = {
  user: { emoji: '🔵', bg: '#EFF6FF', border: '#2563EB' },
  destination: { emoji: '📍', bg: '#FFF1F2', border: '#EF4444' },
  THEFT: { emoji: '🔓', bg: '#FFF7ED', border: '#F97316' },
  HARASSMENT: { emoji: '⚠️', bg: '#FFF7ED', border: '#F97316' },
  POOR_LIGHTING: { emoji: '💡', bg: '#FEFCE8', border: '#EAB308' },
  ASSAULT: { emoji: '🚨', bg: '#FFF1F2', border: '#EF4444' },
  SUSPICIOUS_ACTIVITY: { emoji: '👁', bg: '#F5F3FF', border: '#7C3AED' },
};

interface Props {
  type: PinType;
  /** Shown below the pin bubble — keep short, e.g. "Theft" */
  label?: string;
}

export const CustomMapPin: React.FC<Props> = ({ type, label }) => {
  const cfg = PIN_CONFIG[type] ?? PIN_CONFIG['destination'];

  return (
    <View style={styles.wrapper}>
      {/* Pin bubble */}
      <View style={[styles.bubble, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        <Text style={styles.emoji}>{cfg.emoji}</Text>
      </View>
      {/* Tail */}
      <View style={[styles.tail, { borderTopColor: cfg.border }]} />
      {/* Optional label */}
      {label ? (
        <View style={[styles.labelBadge, { borderColor: cfg.border }]}>
          <Text style={[styles.labelText, { color: cfg.border }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  emoji: {
    fontSize: 18,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  labelBadge: {
    marginTop: 2,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  labelText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
```

### Step 2b — Update the destination marker in `HomeScreen.tsx`

Find:
```tsx
{destination && (
  <Marker
    coordinate={destination}
    title="Destination"
    pinColor="red"
  />
)}
```

Replace with:
```tsx
{destination && (
  <Marker coordinate={destination} anchor={{ x: 0.5, y: 1 }}>
    <CustomMapPin type="destination" label="Dest" />
  </Marker>
)}
```

Add the import at the top of `HomeScreen.tsx`:
```tsx
import { CustomMapPin } from '../components/Map/CustomMapPin';
```

---

## Change 3 — Verify the Report Incident Section is Working

### How to test (manual steps — do this yourself before/after coding)

**Step 1 — Start the backend**
```bash
cd safewalk-backend
npm run dev
# Expected output:
# ✓ Database connected
# 🛡️  SafeWalk Backend running on http://0.0.0.0:5050
```

**Step 2 — Confirm the port**
Open `src/services/apiService.ts` and check:
```ts
return 'http://192.168.10.3:5050/api';
```
Replace `192.168.10.3` with your actual machine's Wi-Fi IP (`ipconfig` on Windows, look for IPv4 under Wi-Fi adapter). The port **must match** `PORT=` in `safewalk-backend/.env` (default `3000`, but your config shows `5050`).

**Step 3 — Smoke test with curl**
```bash
curl -s -X POST http://192.168.10.3:5050/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "THEFT",
    "latitude": 28.614018,
    "longitude": 77.079051,
    "severity": 3,
    "description": "Test from curl",
    "isAnonymous": true
  }' | python -m json.tool
```
Expected response:
```json
{
  "success": true,
  "data": { "id": "...", "type": "THEFT", ... },
  "statusCode": 201
}
```

**Step 4 — Test from the app**
1. Open the app on your phone/emulator.
2. Tap the **Report** tab (flag icon in the bottom tab bar).
3. Tap an incident type (e.g., "Harassment").
4. Set severity.
5. Tap **Submit Report**.
6. Check your backend terminal for `POST /incidents 201`.

### Code assessment — is the Report screen correctly wired?

**Answer: YES — the logic is correct end-to-end.**

Here is the verified call chain:

| Layer | File | Key code |
|---|---|---|
| UI | `ReportIncidentScreen.tsx` | `handleSubmit()` → calls `apiService.reportIncident(...)` |
| Service | `apiService.ts` | `POST /incidents` with `type`, `latitude`, `longitude`, `severity`, `isAnonymous` |
| Route | `safewalk-backend/src/routes/incidents.ts` | `router.post('/incidents', optionalAuthMiddleware, reportIncidentController)` |
| Controller | `incidentController.ts` | Validates fields, calls `incidentService.reportIncident(...)` |
| DB | `IncidentService.ts` | `this.incidentRepository.create({...})` + `.save()` |

**The only failure mode is a wrong IP/port** in `apiService.ts`. Everything else is production-ready.

### One code fix to make the error message more helpful

In `src/screens/ReportIncidentScreen.tsx`, find the catch block in `handleSubmit`:
```tsx
} catch (error: any) {
  Alert.alert('Error', error.message || 'Failed to submit report...');
```

Replace with:
```tsx
} catch (error: any) {
  const msg =
    error?.response?.data?.error ||
    error?.message ||
    'Network error — make sure the SafeWalk backend is running.';
  Alert.alert('Submission Failed', msg);
```

---

## Change 4 — Sleeker, Professional Crime Data Display on the Map

### Goal
Replace the current raw `Circle` + default `pinColor` incident rendering with:
- A clean custom pin per incident type (reusing `CustomMapPin` from Change 2).
- No giant translucent red circles — instead a small, subtle pulsing ring only for high-severity incidents.
- A compact bottom-sheet callout when tapping a marker (no full alert).

### Step 4a — Update `src/components/IncidentMarker.tsx`

This is the component imported directly by `HomeScreen`. Rewrite it entirely:

```tsx
/**
 * IncidentMarker
 * Renders a single incident as a branded custom map pin.
 * Imported by HomeScreen and placed inside <MapView>.
 */

import React from 'react';
import { Marker } from './Map'; // re-export from src/components/Map/index.ts
import { Incident } from '../data/mockIncidents';
import { CustomMapPin, PinType } from './Map/CustomMapPin';

interface Props {
  incident: Incident;
  onPress?: () => void;
}

// Map backend enum strings → PinType
const TYPE_MAP: Record<string, PinType> = {
  THEFT: 'THEFT',
  HARASSMENT: 'HARASSMENT',
  POOR_LIGHTING: 'POOR_LIGHTING',
  ASSAULT: 'ASSAULT',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
};

// Short labels shown below the pin bubble
const LABEL_MAP: Record<string, string> = {
  THEFT: 'Theft',
  HARASSMENT: 'Harass.',
  POOR_LIGHTING: 'Lighting',
  ASSAULT: 'Assault',
  SUSPICIOUS_ACTIVITY: 'Suspic.',
};

export const IncidentMarker: React.FC<Props> = ({ incident, onPress }) => {
  const pinType: PinType = TYPE_MAP[incident.type] ?? 'SUSPICIOUS_ACTIVITY';
  const label = LABEL_MAP[incident.type] ?? 'Incident';

  return (
    <Marker
      coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false} // important for performance — prevents re-render on every map frame
    >
      <CustomMapPin type={pinType} label={label} />
    </Marker>
  );
};
```

### Step 4b — Replace the map rendering block in `HomeScreen.tsx`

Find the current incident rendering block:
```tsx
{/* Detected Crime Incidents */}
{(activeIncidents.length > 0 ? activeIncidents : mockIncidents).map((incident) => (
  <React.Fragment key={`incident-${incident.id}`}>
    <Circle
      center={{ latitude: incident.latitude, longitude: incident.longitude }}
      radius={200}
      fillColor="rgba(239, 68, 68, 0.15)"
      strokeColor="rgba(239, 68, 68, 0.5)"
      strokeWidth={1}
    />
    <IncidentMarker incident={incident} />
  </React.Fragment>
))}
```

Replace with:
```tsx
{/* Crime Incident Markers — professional branded pins */}
{(activeIncidents.length > 0 ? activeIncidents : mockIncidents).map((incident) => (
  <React.Fragment key={`incident-${incident.id}`}>
    {/* Subtle danger ring only for high-severity (4+) incidents */}
    {incident.severity >= 4 && (
      <Circle
        center={{ latitude: incident.latitude, longitude: incident.longitude }}
        radius={120}
        fillColor="rgba(239, 68, 68, 0.08)"
        strokeColor="rgba(239, 68, 68, 0.30)"
        strokeWidth={1}
      />
    )}
    <IncidentMarker
      incident={incident}
      onPress={() => {
        // Animate camera to the tapped incident for context
        if (mapRef.current) {
          mapRef.current.animateCamera(
            { center: { latitude: incident.latitude, longitude: incident.longitude }, zoom: 16 },
            { duration: 600 }
          );
        }
      }}
    />
  </React.Fragment>
))}
```

### Step 4c — Remove the now-unused `Circle` import from `HomeScreen.tsx`

Find:
```tsx
import MapView, { Circle, Marker, Polyline } from '../components/Map';
```
Change to:
```tsx
import MapView, { Marker, Polyline } from '../components/Map';
```

`Circle` is still imported inside the `React.Fragment` block above — but it comes from `react-native-maps` via the Map wrapper. Make sure `src/components/Map/index.ts` still exports `Circle`:
```ts
export { default, Marker, Polyline, Circle } from './MapView';
```

If `Circle` is missing from that export, add it. Then update the HomeScreen import:
```tsx
import MapView, { Circle, Marker, Polyline } from '../components/Map';
```

---

## Final Checklist for Copilot

Work through each item in order. After each change, save and run the Expo bundler to confirm no TypeScript errors.

```
[ ] 1. Delete Central Park marker block from HomeScreen.tsx
[ ] 2. Delete City Coffee marker block from HomeScreen.tsx  
[ ] 3. Delete the duplicate manual "You are here" blue Marker from HomeScreen.tsx
[ ] 4. Delete the <PlaceDrawer> JSX block (the one gated by !routeParams)
[ ] 5. Remove PlaceDrawer import from HomeScreen.tsx
[ ] 6. Remove selectedPlace useState declaration from HomeScreen.tsx
[ ] 7. Create src/components/Map/CustomMapPin.tsx with full content above
[ ] 8. Update destination <Marker> in HomeScreen.tsx to use <CustomMapPin type="destination">
[ ] 9. Add CustomMapPin import to HomeScreen.tsx
[10. Report screen: update catch block error message for clearer network failure UX
[11. Rewrite src/components/IncidentMarker.tsx with branded CustomMapPin version
[12. Replace old Circle+IncidentMarker block in HomeScreen.tsx with the new slim version
[13. Ensure Circle is still exported from src/components/Map/index.ts
[14. Set tracksViewChanges={false} on all Marker instances for map render performance
[ ] 15. Run: npx tsc --noEmit  → confirm 0 errors
[ ] 16. Run: npm start → test on device
```

---

## Files Changed Summary

| File | Type of change |
|---|---|
| `src/screens/HomeScreen.tsx` | Delete demo markers, update destination pin, update incident rendering |
| `src/components/Map/CustomMapPin.tsx` | **CREATE NEW** — reusable branded pin component |
| `src/components/IncidentMarker.tsx` | Full rewrite — use CustomMapPin instead of pinColor |
| `src/components/Map/index.ts` | Verify Circle is exported |
| `src/screens/ReportIncidentScreen.tsx` | Improve error message in catch block |

**No changes required to:**
- `src/data/mockIncidents.ts` (data is fine as-is)
- `src/services/apiService.ts` (only update if your LAN IP has changed)
- `safewalk-backend/` (backend code is correct)
- Any navigation or theme files