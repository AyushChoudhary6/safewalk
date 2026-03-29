# SafeWalk: End-to-End User Flow

This document outlines the complete end-to-end user flow of the SafeWalk application—from the moment the app icon is tapped to the completion of a journey or the handling of an emergency.

---

## 1. Launch & Authentication Flow

When the user opens the app, the `AuthContext` determines the application state.

* **Splash Screen & Hydration**: The app checks `AsyncStorage` for a persisted user token and hydrates the `AuthContext`.
* **Authentication Check**:
  * *If Unauthenticated*: User is directed to the Auth Stack (Onboarding → Login/Signup). Social login (Google/Apple) or Phone OTP is handled via Firebase Authentication.
  * *If Authenticated*: The `AppNavigator` switches to the Main Stack, landing the user on the `HomeScreen`.
* **Permission Sync**: On the first landing, the `LocationProvider` triggers a request for Foreground and Background location permissions.

---

## 2. Journey Initialization Flow

The core interaction begins on the `HomeScreen`, which renders the `react-native-maps` component.

* **Destination Selection**: The user interacts with a search bar powered by the Google Places API.
* **Route Calculation**: The `MapService` sends the origin and destination to the Google Directions API.
* **Safety Layering**: Before displaying routes, the app queries Firestore for `SafetyReports` within a bounding box of the coordinates.
* **Safety Scoring**: The app calculates a Safety Score for each route alternative based on lighting, crowd-sourced reports, and historical data.
* **Route Confirmation**: The user selects a route. The UI displays the estimated time of arrival (ETA) and the safety rating.

---

## 3. Active Journey & Real-time Tracking

Once the "Start Walk" button is pressed, the background services engage.

* **Session Creation**: A new document is created in the `activeJourneys` Firestore collection.
* **Background Tracking**: The `expo-location` service begins `watchPositionAsync`. Even if the user switches to a music app or locks their phone, the `LocationService` continues to run.
* **Real-time Sync**:
  * *Database*: Every 10–50 meters, the `currentLocation` is updated in Firestore.
  * *WebSockets*: For "Live Sharing" with contacts, `Socket.io` emits coordinates to a specific room ID, allowing trusted contacts to see a smooth, moving marker on their own devices.

---

## 4. The Notification & Alert System

The notification system acts as the "bridge" between the traveler and their safety net.

### A. Proactive Alerts (Geofencing)

* If the user deviates significantly from the calculated safe route, the `LocationProvider` detects a geofence breach.
* A Local Push Notification is sent: *"You're off your planned route. Are you okay?"*

### B. Trusted Contact Monitoring

* When a journey starts, the `NotificationService` triggers a Firebase Cloud Function.
* This function sends a Data Push Notification (via FCM/APNs) to all `trustedContacts`: *"[User] has started a walk to [Destination]. Tap to follow live."*

---

## 5. Emergency SOS Flow (The Critical Path)

If a user feels unsafe or the app detects an anomaly (like a long period of inactivity), the SOS flow is triggered.

* **Trigger**: User holds the "Emergency SOS" button for 3 seconds or triggers a voice command.
* **Immediate Local Action**: The phone vibrates (haptic feedback) and high-volume audio may play (if configured).
* **Backend Escalation**:
  * The `EmergencyService` updates the journey status to **emergency**.
  * A High-Priority Push Notification is sent to contacts: *"CRITICAL: [User] needs help! Last known location attached."*
* **Cloud Function Integration**: The backend can trigger secondary actions, such as sending an automated SMS via Twilio or alerting local community "SafeWalk Escorts" nearby.

---

## 6. Community Reporting & Journey Completion

SafeWalk relies on a feedback loop to improve future route suggestions.

* **Incident Reporting**: During or after a walk, users can drop a `SafetyMarker` on the map. They select a type (e.g., "Poor Lighting") and severity. This is saved to the `SafetyReports` collection with an `expiresAt` timestamp (TTL) to ensure data stays relevant.
* **Arrival**: When the user’s coordinates match the destination radius, the `LocationService` stops tracking.
* **Final Notification**: A final "Safe Arrival" notification is sent to the trusted contacts, and the `activeJourney` document is moved to a `journeyHistory` sub-collection for analytics.
