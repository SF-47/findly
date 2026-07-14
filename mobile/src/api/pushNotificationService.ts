import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { updatePushToken } from '../services/studentService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as any),
});

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563eb',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Permission not granted');
      return;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "20f96abd-be9f-40e6-b0e8-ce8a84054799", // Add your EAS project ID here later if needed
      });
      token = tokenData.data;

      // Send token to our backend
      if (token) {
        await updatePushToken(token);
      }
    } catch (e) {
      console.log("Error fetching token", e);
    }
  }
  return token;
}
