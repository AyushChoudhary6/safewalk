import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const CONTACTS_KEY = '@emergency_contacts';

// Ensure your backend URL is set up correctly (using direct local IP since this usually runs in emulator)    
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.13:3000/api';

export interface EmergencyContact {
  name: string;
  phone: string;
  isPrimary: boolean;
  pushToken?: string; // Appended for Firebase Push Notifications
}

/**
 * Helper to fetch local contacts
 */
export const getContacts = async (): Promise<EmergencyContact[]> => {
  try {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Initiates the SOS System.
 * Requests priority backend handling to dispatch Push/SMS to contacts via API.
 */
export const triggerSOS = async (userName: string, userTwilioSenderNumber: string, userId: string = 'guest_user') => {
  try {
    // 1. Get emergency contacts from local storage
    let contacts = await getContacts();
    if (!contacts || !contacts.length) {
      contacts = [{ name: 'Default Emergency', phone: '+918448410330', isPrimary: true }];
    }

    // 2. Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Location permission denied');

    // 3. Gather High-Accuracy Coordinates
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest
    });
    
    const locationPayload = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };

    // 4. Send the payload to Backend API
    const response = await fetch(`${BACKEND_URL}/sos/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        userName,
        senderNumber: userTwilioSenderNumber,
        location: locationPayload,
        contacts,
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Backend SOS rejection');

    return { success: true, location: locationPayload };
  } catch (error) {
    console.error('Frontend trigger SOS failure:', error);
    return { success: false, error: (error as Error).message };
  }
};

/**
 * Periodically issues tracking updates to the backend
 */
export const updateLiveLocation = async (userName: string, userTwilioSenderNumber: string, userId: string = 'guest_user') => {
  try {
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    let contacts = await getContacts();
    if (!contacts || !contacts.length) {
      contacts = [{ name: 'Default Emergency', phone: '+918448410330', isPrimary: true }];
    }

    await fetch(`${BACKEND_URL}/sos/update-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        userName,
        senderNumber: userTwilioSenderNumber,
        location: { lat: location.coords.latitude, lng: location.coords.longitude },
        contacts
      })
    });
  } catch (error) {
    console.warn('Failed to update live location to backend:', error);
  }
};

/**
 * Halts the active SOS state via warning backend dispatch API.
 */
export const cancelSOSAlert = async (userName: string, userTwilioSenderNumber: string, userId: string = 'guest_user') => {
  try {
    let contacts = await getContacts();
    if (!contacts || !contacts.length) {
      contacts = [{ name: 'Default Emergency', phone: '+918448410330', isPrimary: true }];
    }

    await fetch(`${BACKEND_URL}/sos/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        userName,
        senderNumber: userTwilioSenderNumber,
        contacts
      }),
    });
  } catch (error) {
    console.warn('Failed to dispatch stopSOS request:', error);
  }
};
