import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import * as sosService from '../services/sosService';
import { getCurrentLocationString } from '../utils/location';

export const useSOS = () => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Refs for tracking active JS intervals so they can be cleaned up
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Track consecutive location updates
  const updatesCount = useRef(0);
  const MAX_UPDATES = 30; // Maximum of 30 updates at 10 seconds apiece (5 minutes)

  /**
   * Initializes the SOS protocol via a 5-second countdown timer.
   * Can be safely interrupted by calling cancelSOS().
   */
  const handleSOSPress = () => {
    if (isActive || isCountingDown) return;
    
    setIsCountingDown(true);
    setCountdown(5);
    
    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current) clearInterval(countdownInterval.current);
          executeSOS(); // Trigger emergency sequence
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Performs the actual emergency contact sequence after countdown finishes.
   */
  const executeSOS = async () => {
    setIsCountingDown(false);
    setIsActive(true);
    
    try {
      setStatusMsg('Fetching emergency contacts...');
      const contact = await sosService.getPrimaryContact();
      
      if (!contact) {
        Alert.alert(
          'No Contacts Found', 
          'You need to add an emergency contact in settings first.',
          [{ text: 'OK', onPress: () => cancelSOS() }]
        );
        return;
      }

      // Step 1: Automatically try to call user
      setStatusMsg('Calling emergency contact...');
      await sosService.makePhoneCall(contact.phone);

      // Step 2 & 3: Gather live location and prep SMS string
      setStatusMsg('Sending location...');
      const locationLink = await getCurrentLocationString();
      
      if (!locationLink) {
        Alert.alert('Location Error', 'Unable to fetch your coordinates for the SOS message.');
      } else {
        await sosService.sendSOSMessage(contact.phone, locationLink);
      }

      // Step 4: Begin iterative background live-tracking
      setStatusMsg('Live tracking active');
      startLiveTracking(contact.phone);
      
    } catch (error) {
      console.error('Failed executing SOS sequence:', error);
      cancelSOS();
    }
  };

  /**
   * Periodically attempts to fetch and dispatch new live location updates.
   * Note: In Expo, SMS.sendSMSAsync opens a compose UI per call. Using true background SMS 
   * without prompts requires Ejected Native Modules outside of Expo development paths.
   */
  const startLiveTracking = (phone: string) => {
    updatesCount.current = 0;
    
    trackingInterval.current = setInterval(async () => {
      if (updatesCount.current >= MAX_UPDATES) {
        cancelSOS();
        return;
      }

      const locUrl = await getCurrentLocationString();
      if (locUrl) {
        await sosService.sendSOSMessage(phone, locUrl);
      }
      
      updatesCount.current += 1;
    }, 10000); // Polls every 10,000ms (10 seconds)
  };

  /**
   * Safely clears all timeouts, iterations, and active statuses related to the alert.
   */
  const cancelSOS = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (trackingInterval.current) clearInterval(trackingInterval.current);
    
    setIsCountingDown(false);
    setIsActive(false);
    setStatusMsg('');
    updatesCount.current = 0;
  };

  // Cleanup effect
  // Ensures tracking does not inadvertently persist if component is unmounted
  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      if (trackingInterval.current) clearInterval(trackingInterval.current);
    };
  }, []);

  return {
    isCountingDown,
    countdown,
    isActive,
    statusMsg,
    handleSOSPress,
    cancelSOS
  };
};