import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeContext } from "../context/ThemeContext";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog, Portal, Text, Switch, Button, TextInput } from 'react-native-paper';
import { setBiometricPreference, getBiometricPreference } from '../helper/biometricStorage';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermission } from '../helper/notifications';
import { useFocusEffect } from '@react-navigation/native';
import { IconComponent } from "../components/IconPicker";
import { colorNames } from '../helper/colorNames';

const currencyObj = [
  { id: 1, name: "Indian Rupee (INR)", iconName: "rupee-sign", iconType: "FontAwesome5" },
  { id: 2, name: "Euro (EUR)", iconName: "euro", iconType: "FontAwesome" },
  { id: 3, name: "British Pound Sterling (GBP)", iconName: "pound-sign", iconType: "FontAwesome5" },
  { id: 5, name: "Japanese Yen (JPY)", iconName: "yen", iconType: "FontAwesome" },
  { id: 6, name: "United States Dollar (USD)", iconName: "dollar", iconType: "FontAwesome" },
  { id: 7, name: "South Korean Won (KRW)", iconName: "won", iconType: "FontAwesome" },
  { id: 8, name: "Russian Ruble (RUB)", iconName: "ruble", iconType: "FontAwesome" },
  { id: 9, name: "Turkish Lira (TRY)", iconName: "turkish-lira", iconType: "FontAwesome" },
  { id: 10, name: "Ukrainian Hryvnia (UAH)", iconName: "hryvnia", iconType: "FontAwesome5" },
  { id: 11, name: "Swiss Franc (CHF)", iconName: "currency-franc", iconType: "MaterialIcons" },
  { id: 12, name: "Brazilian Real (BRL)", iconName: "brazilian-real-sign", iconType: "FontAwesome6" },
  { id: 13, name: "Mexican Peso (MXN)", iconName: "peso-sign", iconType: "FontAwesome6" },
];

const SettingsScreen = ({ navigation }) => {
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState("");
  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const showNameDialog = () => setNameDialogVisible(true);
  const hideNameDialog = () => setNameDialogVisible(false);
  const validateName = (text) => {
    const regex = /^[A-Za-z0-9_-]+$/;
    if (text.trim().length === 0) {
      setNameError("Name cannot be empty.");
      return false;
    } else if (!regex.test(text)) {
      setNameError(
        "Only letters, numbers, underscores (_) and hyphens (-) are allowed."
      );
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [turnNotificationsOn, setTurnNotificationsOn] = useState(false);

  const { theme, setThemeColor, resetThemeColor } = useThemeContext();
  const systemColorScheme = useColorScheme();
  const styles = makeStyles(theme, systemColorScheme);

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [biometricFail, setBiometricFail] = React.useState(false);
  const [biometricFailMsg, setBiometricFailMsg] = React.useState('');
  const showBiometricFailDialog = () => setBiometricFail(true);
  const hideBiometricFailDialog = () => setBiometricFail(false);

  const [lockAppEnabled, setLockAppEnabled] = React.useState(false);
  const [lockImmediately, setLockImmediately] = React.useState(false);

  const themeColors = ['#FF1744', '#F50057', '#AF52DE', '#2979FF', '#33beffff', '#C6FF00', '#FFC400', '#FF3D00'];

  const [currencyChangeDialog, setCurrencyChangeDialog] = useState(false);
  const showCurrencyChangeDialog = () => setCurrencyChangeDialog(true);
  const hideCurrencyChangeDialog = () => setCurrencyChangeDialog(false);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(currencyObj[0].id);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const name = await AsyncStorage.getItem("username");
          setNewName(name);
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      };
      fetchData();
    }, [])
  );

  const handleNameChange = () => {
    showNameDialog();
  }

  const saveUpdatedName = async () => {
    const isValid = validateName(newName);
    if (!isValid) return;

    await AsyncStorage.setItem("username", newName);
    setNewName('');
    hideNameDialog();
  }

  const handleCurrencyChange = () => {
    showCurrencyChangeDialog();
  }

  const saveUpdatedCurrency = async () => {
    await AsyncStorage.setItem("currencyId", selectedCurrencyId.toString());
    hideCurrencyChangeDialog();
  }

  const settingsItems = [
    { title: 'Change name', icon: 'person-outline', onPress: handleNameChange },
    { title: 'Currency Change', icon: 'cash-outline', onPress: handleCurrencyChange },
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

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Daily Reminder',
            body: 'This will show every day at 20:15',
            channelId: 'default',
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
   <TouchableOpacity
      activeOpacity={0.7}
      onPress={item.onPress}
      disabled={item.toggleLock || item.toggleNotifications} // disable touch for toggles
    >
      <View style={styles.itemContainer}>
        <View
          style={{
            backgroundColor: theme[systemColorScheme].onPrimaryContainer,
            borderRadius: 5,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name={item.icon} size={22} color={theme[systemColorScheme].onSecondary} />
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
              thumbColor={item.value ? theme[systemColorScheme].primary : '#ccc'}
              trackColor={{ true: '#999', false: '#555' }}
            />
          ) : item.toggleNotifications ? (
            <Switch 
              value={turnNotificationsOn}
              onValueChange={handleNotificationToggle}
              thumbColor={item.value ? theme[systemColorScheme].primary : '#ccc'}
              trackColor={{ true: '#999', false: '#555' }}
            />
          )
          
          : (
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
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
    </TouchableOpacity>
  );

  const renderCurrencyItem = ({ item }) => {
    const windowWidth = Dimensions.get("window").width;
    const itemSize = (windowWidth - 10) / 3; // square box with padding
    const isSelected = item.id === selectedCurrencyId;

    return (
      <View style={{justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => setSelectedCurrencyId(item.id)}
          activeOpacity={0.9}
          style={{
            width: itemSize,
            height: itemSize,
            margin: 10,
            borderRadius: 20,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? theme[systemColorScheme].primary : theme[systemColorScheme].tertiaryContainer,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ padding: 10, gap: 10, alignItems: "center" }}>
            <IconComponent
              name={item.iconName}
              category={item.iconType}
              size={20}
              color={theme[systemColorScheme].tertiary}
            />
            <Text
              variant="titleSmall"
              style={{ textAlign: "center", padding: 10 }}
              allowFontScaling={false}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

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
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
              {themeColors.map((color) => (
                <View
                  key={color}
                  style={{
                    alignItems: "center",
                    margin: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={async () => {
                      await setThemeColor(color);
                      hideDialog();
                    }}
                    style={{
                      backgroundColor: color,
                      height: 50,
                      width: 50,
                      borderRadius: 10,
                    }}
                  />
                  <Text style={{ marginTop: 5 }}>
                    {colorNames[color] || color}
                  </Text>
                </View>
              ))}
            </View>

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

      {/* Name change dialog box */}
      <Portal>
        <Dialog visible={nameDialogVisible} onDismiss={hideNameDialog}>
          <Dialog.Title>Change Name</Dialog.Title>
          <Text variant="bodySmall" style={{ paddingHorizontal: 24 }}>Note: Old name in splits will still be used.</Text>
          <Dialog.Content>
            <TextInput
              label={
                <Text style={{ color: theme[systemColorScheme].primary }}>
                  {"Update name"}
                </Text>
              }
              style={{ backgroundColor: "transparent" }}
              textColor={theme[systemColorScheme].primary}
              selectionColor={theme[systemColorScheme].primaryContainer}
              value={newName}
              underlineColor={theme[systemColorScheme].primary}
              activeUnderlineColor={theme[systemColorScheme].primary}
              onChangeText={setNewName}
              autoFocus
            />
            {nameError ? (
              <Text
                style={{
                  color: "#ff4d4d",
                  fontSize: 13,
                  marginTop: 6,
                }}
              >
                {nameError}
              </Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideNameDialog}>Cancel</Button>
            <Button onPress={saveUpdatedName}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Currency change menu */}
      <Portal>
        <Dialog visible={currencyChangeDialog} onDismiss={hideCurrencyChangeDialog}>
          <Dialog.Title>Select Currency</Dialog.Title>
          <Dialog.Content>
            <FlatList
              data={currencyObj}
              renderItem={renderCurrencyItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              style={{height: 500}}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideCurrencyChangeDialog}>Cancel</Button>
            <Button onPress={saveUpdatedCurrency}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  );
};

export default SettingsScreen;

const makeStyles = (theme, colorScheme) =>
StyleSheet.create({
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
    color: theme[colorScheme].secondary,
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
