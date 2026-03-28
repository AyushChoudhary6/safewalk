import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { sendSOSEmail, generateLocationLink } from '../services/emailService';

// Simple SOS implementation with EmailJS
export const useBackendSOS = (userName = 'Riya', userPhoneNumber = '') => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const startSOS = () => {
    if (isSOSActive || isCountingDown) return;
    
    setIsCountingDown(true);
    setCountdown(5);
    setStatusMsg('Initiating SOS in...');
    
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current) clearInterval(countdownInterval.current);
          executeEmergencyTrigger();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const executeEmergencyTrigger = async () => {
    try {
      setIsCountingDown(false);
      setIsSOSActive(true);
      setStatusMsg('Sending SOS Email...');

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const locationLink = generateLocationLink(latitude, longitude);

      // Send SOS email
      const emailResponse = await sendSOSEmail(userName, locationLink);

      if (!emailResponse.success) {
        Alert.alert('SOS Error', emailResponse.error || 'Failed to send SOS email');
        setStatusMsg('SOS Failed');
        setIsSOSActive(false);
        return;
      }

      setStatusMsg('✓ SOS Alert Sent Successfully!');
      Alert.alert(
        'SOS Activated',
        `Emergency alert sent to safewalk team.\nYour location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        [{ text: 'OK', onPress: () => cancelSOS() }]
      );

      // Auto-cancel after 30 seconds
      setTimeout(() => {
        if (isSOSActive) {
          cancelSOS();
        }
      }, 30000);

    } catch (error) {
      console.error('SOS Error:', error);
      setStatusMsg('SOS Failed');
      setIsSOSActive(false);
      Alert.alert('Error', 'Failed to send SOS: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Automatically shut off after ~30 seconds
  // (emails are sent immediately, no need for background tracking)

  const cancelSOS = async () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setIsSOSActive(false);
    setIsCountingDown(false);
    setStatusMsg('SOS Cancelled');
    setCountdown(5);
  };

  // Global cleaner
  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  return {
    isCountingDown,
    countdown,
    isSOSActive,
    statusMsg,
    startSOS,
    cancelSOS
  };
};
