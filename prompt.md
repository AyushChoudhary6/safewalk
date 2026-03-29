---
name: emergency-escalation
description: AI instructions for implementing the Emergency Escalation & Safety Check Logic handling Geofencing, Foreground Services, and Emergency Dispatching.
---

# Emergency Escalation & Safety Check Logic

## 1. Feature Overview

The Emergency Escalation System is a fail-safe mechanism designed to protect users when entering high-risk areas. It operates on a "Check-in First, Alert Second" principle, ensuring that help is only summoned when genuinely needed or when the user is unable to respond.

## 2. Technical Architecture

The system relies on three core pillars:

1. **Geofencing (Trigger)**: Detects when a user enters a predefined "Danger/Crime Zone."
2. **Foreground Service (Monitoring)**: Manages the countdown timer and UI overlays even if the app is minimized.
3. **FCM & Backend (Action)**: Dispatches high-priority alerts to the user's designated emergency contacts.

## 3. Step-by-Step Implementation

### Step 1: Permission & Contact Initialization

- **Permissions**: Ensure `ACCESS_BACKGROUND_LOCATION` and `POST_NOTIFICATIONS` are granted.
- **Contact Data**: Query the `trustedContacts` array from the User's Firestore profile. Each contact must have a valid phone number or `fcmToken`.

### Step 2: Geofence Entry Trigger

- Register geofences for all active "Danger Zones" fetched from the `safetyReports` collection.
- Upon `GEOFENCE_TRANSITION_ENTER`:
  - Wake the device via a high-priority notification.
  - Initialize the `SafetyCheckService`.

### Step 3: The "Are You Safe?" Pop-Up

When the service starts, display a Heads-up Notification and a Full-Screen Modal (if the app is in the foreground):

- **Message**: "You've entered a flagged area. Are you safe?"
- **Action Buttons**:
  - `[YES, I AM SAFE]`: Dismisses everything and stops the service.
  - `[NO, HELP ME]`: Immediately triggers Step 5.
- **Visual Element**: A circular progress bar or digital countdown timer (default: 120 seconds).

### Step 4: The Countdown & Timeout Logic

- Implement a `CountDownTimer` within a persistent Foreground Service.
- If the timer reaches **00:00 without user interaction**:
  - Interpret the silence as an emergency (e.g., user is incapacitated or phone was taken).
  - Automatically proceed to Step 5.

### Step 5: Emergency Escalation (FCM + SMS)

- **Server Call**: The app sends the current `lat/lng` and a `status: "unresponsive"` flag to a Firebase Cloud Function.
- **Notification Dispatch**: The backend sends an FCM Data Message to all trusted contacts.
  - **Priority**: `high`
  - **Payload**: `{"type": "EMERGENCY_SOS", "user": "User_Name", "location": {"lat": ..., "lng": ...}}`
- **SMS Fallback**: If the user's device detects "Low/No Network," use the native `SmsManager` (via `expo-sms`) to send a direct text message to the contacts' phone numbers.

## 4. UI/UX Requirements

- **Audio**: Use a distinct "Pulse" sound during the countdown to grab the user's attention without causing immediate panic.
- **The "Safety Shield"**: Once "Safe" is clicked, show a brief confirmation ("Location sharing paused. Stay alert!") to provide closure to the user.
- **Critical Alerts**: Configure the Android Notification Channel with `IMPORTANCE_HIGH` to bypass "Do Not Disturb" settings if possible.

## 5. Success Metrics & Error Handling

| Scenario | System Response |
| :--- | :--- |
| **User moves out of zone** | The geofence exit event clears any active countdowns. |
| **No Internet** | App triggers the SMS Fallback module immediately. |
| **App is Killed** | The `GeofenceBroadcastReceiver` restarts the `SafetyCheckService` upon the next location update. |

## Implementation To-Do List

- [ ] Create `SafetyCheckModal.tsx` component.
- [ ] Implement `GeofenceBroadcastReceiver` for transition detection.
- [ ] Set up the `CountDownTimer` logic in `LocationService.ts` (or `sosService.ts`).
- [ ] Write the Firebase Cloud Function to handle the multi-contact FCM dispatch.
- [ ] Add the `expo-sms` bridge for offline alerts.
