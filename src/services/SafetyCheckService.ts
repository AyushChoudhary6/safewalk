import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { DeviceEventEmitter } from 'react-native';

export const GEOFENCE_TASK_NAME = 'SAFEWALK_GEOFENCE_TASK';

// Configure Notifications for High Priority
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

// Configure the notification channel for Android to bypass DND (requires user approval but we set IMPORTANCE_HIGH)
export const setupNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('emergency-alerts', {
      name: 'Emergency Alerts',
      importance: Notifications.AndroidNotificationPriority.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'pulse.wav', // Custom sound if added, otherwise default
    });
  }
};

setupNotificationChannels();

// Background Headless Task for Geofence Transitions
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Geofence task error:', error);
    return;
  }
  
  if (data) {
    const { eventType, region } = data as any;
    
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log('Entered danger zone:', region);
      
      // 1. Fire Heads-up Notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Danger Zone Entered! 🚨",
          body: "You've entered a flagged area. Are you safe?",
          sound: true,
          data: { action: 'safety_check', region },
        },
        trigger: null, // deliver immediately
      });

      // 2. Alert the Foreground App to show the modal (if open)
      DeviceEventEmitter.emit('onGeofenceEnter', region);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log('Exited danger zone:', region);
      DeviceEventEmitter.emit('onGeofenceExit', region);
    }
  }
});

// Helper to register geofences from active incidents
export const startDangerZoneMonitoring = async (regions: Location.LocationRegion[]) => {
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== 'granted') {
    console.warn('Background location permission denied');
    return;
  }

  await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
};

export const stopDangerZoneMonitoring = async () => {
  const hasTask = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
  if (hasTask) {
    await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
  }
};
