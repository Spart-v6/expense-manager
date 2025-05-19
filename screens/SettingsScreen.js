import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from "../context/ThemeContext";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog, Portal, Text, Switch, Button } from 'react-native-paper';
import { setBiometricPreference, getBiometricPreference } from '../helper/biometricStorage';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermission } from '../helper/notifications';

const SettingsScreen = ({ navigation }) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [turnNotificationsOn, setTurnNotificationsOn] = useState(false);

  const { theme, setThemeColor, resetThemeColor } = useThemeContext();
  const systemColorScheme = useColorScheme();

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [biometricFail, setBiometricFail] = React.useState(false);
  const [biometricFailMsg, setBiometricFailMsg] = React.useState('');
  const showBiometricFailDialog = () => setBiometricFail(true);
  const hideBiometricFailDialog = () => setBiometricFail(false);

  const [lockAppEnabled, setLockAppEnabled] = React.useState(false);
  const [lockImmediately, setLockImmediately] = React.useState(false);

  const themeColors = ['#FF1744', '#F50057', '#D500F9', '#2979FF', '#00B0FF', '#C6FF00', '#FFC400', '#FF3D00'];

  const settingsItems = [
    { title: 'Change name', icon: 'person-outline', onPress: () => {} },
    { title: 'Currency Change', icon: 'cash-outline', onPress: () => {} },
    {
      title: 'Lock App',
      icon: 'lock-closed-outline',
      toggleLock: true,
      value: isBiometricEnabled,
      onToggle: handleAuthToggle,
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      toggleNotifications: true,
      value: turnNotificationsOn,
      onToggle: handleNotificationToggle,
    },
    {
      title: 'Theme',
      icon: 'color-palette-outline',
      onPress: showDialog,
    },
  ];

  const handleAuthToggle = async (newValue) => {
    
    if (newValue) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        showBiometricFailDialog();
        setBiometricFailMsg('Biometric not available - Your device does not support biometrics.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm biometric to enable',
      });

      if (result.success) {
        setIsBiometricEnabled(true);
        await setBiometricPreference(true);
      } else {
        showBiometricFailDialog();
        setBiometricFailMsg('Failed - Biometric auth was not successful.');
      }
    } else {
      setIsBiometricEnabled(false);
      await setBiometricPreference(false);
    }
  };

  const handleNotificationToggle = async (newValue) => {
    setTurnNotificationsOn(newValue);
    await AsyncStorage.setItem('notifications_enabled', JSON.stringify(newValue));
  
    if (newValue) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await Notifications.cancelAllScheduledNotificationsAsync();
  
        const now = new Date();
        const target = new Date();
        target.setHours(20);
        target.setMinutes(15);
        target.setSeconds(0);
  
        if (now < target) {
          // If it's before 20:15, schedule one-time for today
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Time Test',
              body: 'Scheduled for today at 20:15',
            },
            trigger: {
              date: target,
            },
          });
        }
  
        // Also schedule repeat from tomorrow onward
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Time Test',
            body: 'This will show every day at 20:15',
          },
          trigger: {
            hour: 20,
            minute: 15,
            repeats: true,
          },
        });
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };
  
  

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.itemContainer}>
        <View
          style={{
            backgroundColor: theme.dark.onPrimary,
            borderRadius: 5,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name={item.icon} size={22} color={theme.dark.primary} />
        </View>
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          {item.toggleLock ? (
            <Switch
              value={isBiometricEnabled}
              onValueChange={handleAuthToggle}
              thumbColor={item.value ? theme.dark.primary : '#ccc'}
              trackColor={{ true: '#999', false: '#555' }}
            />
          ) : item.toggleNotifications ? (
            <Switch 
              value={turnNotificationsOn}
              onValueChange={handleNotificationToggle}
              thumbColor={item.value ? theme.dark.primary : '#ccc'}
              trackColor={{ true: '#999', false: '#555' }}
            />
          )
          
          : (
            <TouchableOpacity onPress={item.onPress} style={styles.arrowWrapper}>
              <Icon name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lock immediately */}
      {/* {item.title === 'Lock App' && lockAppEnabled && (
        <View style={styles.subItemContainer}>
          <Text style={[styles.title, { fontSize: 14 }]}>Lock immediately?</Text>
          <Switch
            value={lockImmediately}
            onValueChange={setLockImmediately}
            thumbColor={lockImmediately ? theme.dark.primary : '#ccc'}
            trackColor={{ true: '#999', false: '#555' }}
          />
        </View>
      )} */}
    </View>
  );

  useEffect(() => {
    (async () => {
      const enabled = await getBiometricPreference();
      setIsBiometricEnabled(enabled);

      const notif = await AsyncStorage.getItem('notifications_enabled');
      setTurnNotificationsOn(JSON.parse(notif) || false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={settingsItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {/* <Button onPress={async () => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🚀 It works!',
            body: 'Local notification test',
          },
          trigger: { seconds: 5 }, // Trigger after 5 seconds
        });
      }}>
        Test Notification
      </Button> */}
      {/* Themeing options */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Choose theme</Dialog.Title>
          <Dialog.Content>
            {themeColors.map((color, index) => (
              <View key={color}>
                <Text variant="bodyMedium">{color}</Text>
                <TouchableOpacity
                  onPress={async () => {
                    await setThemeColor(color);
                    hideDialog();
                  }}
                  style={{
                    backgroundColor: color,
                    height: 50,
                    marginVertical: 5,
                    borderRadius: 5,
                  }}
                />
            </View>
            ))}
            <Button
                onPress={async () => {
                  await resetThemeColor();
                  hideDialog();
                }}
              >
                Reset Theme
              </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* When biometric fails */}
      <Portal>
        <Dialog visible={biometricFail} onDismiss={hideBiometricFailDialog}>
          <Dialog.Title>Biometric Authentication Failed</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{biometricFailMsg}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideBiometricFailDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  subItemContainer: {
    marginLeft: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  arrowWrapper: {
    paddingHorizontal: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 4,
  },
});
