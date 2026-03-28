// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_9kuf4dd';
const EMAILJS_TEMPLATE_ID = 'template_iaeoluj';
const EMAILJS_PUBLIC_KEY = 'cg7USvvDL4nzAwdxU';
const EMAILJS_PRIVATE_KEY = 'ZYlcp1zV4CKAxuPaLCq8E';

/**
 * Send SOS emergency email with location link
 * @param userName - Name of the person sending SOS
 * @param locationLink - Google Maps or location link with coordinates
 * @param recipientEmail - Email address to send to (default: hardcoded recipient)
 */
export const sendSOSEmail = async (
  userName: string,
  locationLink: string,
  recipientEmail: string = 'riyam12426@gmail.com'
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    const timestamp = new Date().toLocaleString();
    
    // Send email using EmailJS REST API directly for React Native compatibility
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          user_name: userName,
          location_link: locationLink,
          timestamp: timestamp,
          recipient_email: recipientEmail,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS Error: ${errorText}`);
    }
    
    console.log('SOS Email sent successfully');
    
    return {
      success: true,
      messageId: 'Email Sent via REST API',
    };
  } catch (error) {
    console.error('Failed to send SOS email:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Generate Google Maps link from coordinates
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 */
export const generateLocationLink = (latitude: number, longitude: number): string => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};
