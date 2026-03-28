import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

export const triggerSOS = async (req: Request, res: Response) => {
  try {
    const { userId, userName, senderNumber, location, contacts } = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ error: 'Contacts array is required' });
    }

    const { lat, lng } = location || {};
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;

    let notificationsSent = 0;

    // Iterate through user's contacts and notify them
    for (const contact of contacts) {
      const { phone, pushToken } = contact;
      let notificationSuccess = false;

      // OPTION A: Firebase Push Notification (Preferred)
      if (pushToken) {
        notificationSuccess = await NotificationService.sendPushNotification(
          pushToken,
          "Emergency Alert 🚨",
          `${userName} needs help! Tap to view location.`,
          { lat: String(lat), lng: String(lng), url: mapsLink }
        );
      }

      // OPTION B: Twilio SMS (Fallback) if Push Token missing or Push failed
      if (!notificationSuccess && phone) {
        const message = `🚨 EMERGENCY! ${userName} needs help. Track location: ${mapsLink}`;
        notificationSuccess = await NotificationService.sendSMS(senderNumber, phone, message);
      }

      if (notificationSuccess) notificationsSent++;
    }

    return res.status(200).json({ 
      success: true, 
      message: `Emergency SOS triggered successfully to ${notificationsSent} contacts.` 
    });

  } catch (error: any) {
    console.error('Error in triggerSOS:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { userId, userName, location, contacts } = req.body;
    const { lat, lng } = location || {};

    // For silent background updates, we usually just update the DB so the web-tracking link shows the new coords.
    // However, if we strongly need to push a live notification update:
    for (const contact of contacts) {
      if (contact.pushToken) {
         // Silently update via data-only message (or background notification)
         await NotificationService.sendPushNotification(
            contact.pushToken,
            "SOS Location Update",
            `${userName}'s location has been updated.`,
            { lat: String(lat), lng: String(lng) }
         );
      }
    }

    return res.status(200).json({ success: true, message: 'Location updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const stopSOS = async (req: Request, res: Response) => {
  try {
    const { userId, userName, senderNumber, contacts } = req.body;

    for (const contact of contacts) {
      if (contact.pushToken) {
        await NotificationService.sendPushNotification(
          contact.pushToken,
          "SOS Cancelled",
          `✅ ${userName} is now safe. SOS has been turned off.`,
          {}
        );
      } else if (contact.phone) {
        await NotificationService.sendSMS(senderNumber, contact.phone, `✅ ${userName} is now safe. The emergency SOS has been cancelled.`);
      }
    }

    return res.status(200).json({ success: true, message: 'SOS stopped successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
