import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as SMS from 'expo-sms';
import { Alert } from 'react-native';

const CONTACTS_KEY = '@emergency_contacts';

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  twilioSender?: string; 
  isPrimary: boolean;
}

/**
 * Retrieves all saved emergency contacts from AsyncStorage.
 */
export const getContacts = async (): Promise<EmergencyContact[]> => {
  try {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load contacts:', error);
    return [];
  }
};

/**
 * Saves a new emergency contact. If marked as primary, unsets the current primary.
 */
export const saveContact = async (contact: EmergencyContact) => {
  try {
    const contacts = await getContacts();
    
    if (contact.isPrimary) {
      contacts.forEach(c => c.isPrimary = false);
    }
    
    contacts.push(contact);
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Failed to save contact:', error);
  }
};

/**
 * Removes a contact by ID
 */
export const removeContact = async (id: string) => {
  try {
    const contacts = await getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove contact:', error);
  }
};

/**
 * Returns the primary emergency contact or the first saved contact if none explicitly marked.
 */
export const getPrimaryContact = async (): Promise<EmergencyContact | null> => {
  const contacts = await getContacts();
  if (contacts.length === 0) return null;
  
  return contacts.find(c => c.isPrimary) || contacts[0];
};

/**
 * Initiates a phone call to the provided number using the device's native dialer.
 */
export const makePhoneCall = async (phone: string): Promise<boolean> => {
  const url = `tel:${phone}`;
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Error', 'Unable to initiate a phone call on this device.');
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Error opening dialer:', error);
    Alert.alert('Error', 'Failed to open the phone dialer.');
    return false;
  }
};

/**
 * Sends an SMS message using Expo SMS.
 */
export const sendSOSMessage = async (phone: string, locationLink: string): Promise<boolean> => {
  try {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'SMS is not available on this device');
      return false;
    }
    
    // Note: Expo SMS opens the native device modal for final submission on Android/iOS
    const message = `🚨 EMERGENCY! I need help. My current location: ${locationLink}`;
    const { result } = await SMS.sendSMSAsync([phone], message);
    
    return result === 'sent';
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};
import { apiService } from './apiService';
import { getCurrentLocation } from './locationService';

export const sendEmergencyAlerts = async ({ triggerReason }: { triggerReason: string }) => {
  try {
    const contacts = await getContacts();
    if (contacts.length === 0) {
      console.warn('No emergency contacts found to alert.');
      return false;
    }

    const loc = await getCurrentLocation();
    const lat = loc?.latitude || 0;
    const lng = loc?.longitude || 0;
    
    const locationLink = "https://maps.google.com/?q=${lat},${lng}";

    // 1. Try FCM Backend Route first (Step 5 in Prompt)
    try {
      await apiService.post('/sos/escalate', {
        status: triggerReason,
        location: { lat, lng }
      });
      // If it succeeds, the backend handles notifying FCM/Trusted Contacts
      console.log('Successfully dispatched FCM via backend.');
    } catch (networkError) {
      console.warn('Network unavailable or server failed. Dropping to offline SMS Fallback.');
      
      // 2. Offline SMS Fallback using expo-sms
      const phoneNumbers = contacts.map(c => c.phone);
      const isAvailable = await SMS.isAvailableAsync();
      
      if (isAvailable) {
        const message = "?? EMERGENCY! SafeWalk auto-escalation triggered. User may be unresponsive. Last location: ${locationLink}";
        await SMS.sendSMSAsync(phoneNumbers, message);
      } else {
        Alert.alert('Fatal Error', 'No network to reach backend and SMS is unavailable on this device.');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error escalating emergency:', error);
    return false;
  }
};
