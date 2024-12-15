import { PermissionsAndroid, Platform } from 'react-native';

export async function requestPermission(type) {
    if (Platform.OS === 'android') {
        if (type === 'sms') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: 'SMS Permission',
                    message: 'This app requires access to your SMS messages to fetch transaction information.',
                    buttonPositive: 'OK'
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        if (type === 'storage') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: "Storage Permission Required",
                  message: "This app needs access to your storage to save files.",
                  buttonNegative: "Cancel",
                  buttonPositive: "OK",
                }
              );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return false;
    }
    return false;
}