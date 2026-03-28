import admin from 'firebase-admin';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin (Make sure to provide Google Application Credentials in env)
try {
  if (!admin.apps.length) {
    // Only initialize if not already done by standard index.ts backend setup
    admin.initializeApp({
      credential: admin.credential.applicationDefault() // Requires GOOGLE_APPLICATION_CREDENTIALS in env
    });
  }
} catch (e) {
  console.log('Firebase admin initialization deferred or skipped:', e);
}

// Initialize Twilio
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export class NotificationService {
  
  /**
   * Sends an Emergency Push Notification via Firebase FCM
   * @param pushToken The device FCM push token
   * @param title Notification title
   * @param body Notification body
   * @param data Optional payload data (e.g. coordinates, tracking URL)
   */
  static async sendPushNotification(pushToken: string, title: string, body: string, data: any = {}) {
    if (!admin.apps.length) return false;

    try {
      const message = {
        notification: { title, body },
        data: {
          ...data,
          lat: String(data.lat || ''),
          lng: String(data.lng || ''),
        },
        token: pushToken
      };

      await admin.messaging().send(message);
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  /**
   * Sends an SMS via Twilio as a fallback if Push Notifications fail or pushToken is absent
   * @param fromNumber The user's Twilio phone number
   * @param toNumber Destination phone number (include country code)
   * @param message Text message body
   */
  static async sendSMS(fromNumber: string, toNumber: string, message: string) {
    if (!twilioClient || !fromNumber) {
      console.warn('Twilio credentials missing or fromNumber not provided. Skipping SMS.');
      return false;
    }

    try {
      await twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: toNumber
      });
      return true;
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error);
      return false;
    }
  }
}
