import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function requestNotificationPermission() {
  if (Device.isDevice) {
    console.log('Requesting notification permission...');
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log('Existing status:', existingStatus);

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } else {
    console.warn('Must use physical device for notifications');
    return false;
  }
}
