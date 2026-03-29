import React, { useEffect, useState } from 'react';
import { Alert, AppState, DeviceEventEmitter } from 'react-native';
import { sendEmergencyAlerts } from '../../services/sosService';
import { SafetyCheckModal } from './SafetyCheckModal';

export const GlobalSafetyCheck: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const countdownTime = 120; // 2 minutes

  useEffect(() => {
    const enterSub = DeviceEventEmitter.addListener('onGeofenceEnter', (region) => {
      // Show modal when app is in foreground
      if (AppState.currentState === 'active') {
        setModalVisible(true);
        setTimerActive(true);
      } else {
        // Here we could start a silent background countdown timer if app is killed/background
        // Handled naturally if they tap the Heads Up notification to open the app, 
        // which triggers the modal display. 
      }
    });

    const exitSub = DeviceEventEmitter.addListener('onGeofenceExit', () => {
      // Cancel the emergency sequence if they leave the zone safely
      setModalVisible(false);
      setTimerActive(false);
    });

    return () => {
      enterSub.remove();
      exitSub.remove();
    };
  }, []);

  const handleSafe = () => {
    setModalVisible(false);
    setTimerActive(false);
    Alert.alert('Safety Confirmed', 'Location sharing paused. Stay alert!');
  };

  const handleEmergency = async () => {
    setModalVisible(false);
    setTimerActive(false);
    // Proceed to Step 5: Escalate!
    await sendEmergencyAlerts({ triggerReason: 'unresponsive' });
  };

  return (
    <SafetyCheckModal
      visible={modalVisible}
      countdownSeconds={countdownTime}
      onSafe={handleSafe}
      onHelp={handleEmergency}
    />
  );
};
