import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView } from "react-native";
import { Text, TouchableRipple, Dialog, Portal, Button, TextInput, Switch, Snackbar } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import { IconComponent } from "../components/IconPickerModal";
import useDynamicColors from "../commons/useDynamicColors";
import { getUsernameFromStorage, getCurrencyFromStorage } from "../helper/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import * as Notifications from "expo-notifications";
import * as LocalAuth from "expo-local-authentication";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

const SettingsScreen = ({ navigation }) => {
  const allColors = useDynamicColors();

  // #region fetching username and currency
  const [username, setUsername] = React.useState(null);
  const [currency, setCurrency] = React.useState({
    id: 1,
    curr: "$",
    name: "USD",
    iconName: "dollar",
    iconType: "FontAwesome",
  });

  React.useEffect(() => {
    const fetchDetails = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchDetails();
  }, []);
  // #endregion

  const [openChangeName, setOpenChangeName] = React.useState(false);
  const [updatedUsername, setUpdatedUsername] = React.useState(username);
  const [placeholderUsername, setPlaceholderUsername] = React.useState(updatedUsername);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);  
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [biometricWarning, setBiometricWarning] = useState("");
  const [openLockAppDialog, setOpenLockAppDialog] = useState(false);

  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    setUpdatedUsername(username);
    setPlaceholderUsername(username);
  }, [username]);

  const updateUsername = async () => {
    try {
      if (updatedUsername.length === 0) return;
      setPlaceholderUsername(updatedUsername);
      await AsyncStorage.setItem("username", updatedUsername);
      setOpenChangeName(false);
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
    }
  }

  
  const onToggleSwitch = async () => {
    const newSwitchValue = !isSwitchOn;
    setIsSwitchOn(newSwitchValue);
    try {
      await AsyncStorage.setItem('isSwitchOn', JSON.stringify(newSwitchValue));
    } catch (error) {
      console.log('Error saving switch state to AsyncStorage:', error);
    }
    if (newSwitchValue) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Expense Reminder 🪙",
          body: 'Don\'t forget to add your expenses for today!',
          data: { headToThisScreen: 'PlusMoreHome' },
        },
        trigger: {
          hour: 20,
          minute: 40,
          repeats: true
        }
      });
    }
    if (!newSwitchValue) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    return;
  }

  React.useEffect(() => {
    const retrieveSwitchState = async () => {
      try {
        const switchState = await AsyncStorage.getItem('isSwitchOn');
        setIsSwitchOn(JSON.parse(switchState));
      } catch (error) {
        console.log('Error retrieving switch state from AsyncStorage:', error);
      }
    };
    retrieveSwitchState();
  }, []);

  React.useEffect(() => {
    const getPermission = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          setShowError(true);
          console.log('Enable push notifications to use the app!');
          await AsyncStorage.setItem('expopushtoken', "");
          await AsyncStorage.setItem('isSwitchOn', JSON.stringify(false));
          setIsSwitchOn(false);
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await AsyncStorage.setItem('expopushtoken', token);
      } else {
        console.log('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    }
    if (isSwitchOn) getPermission();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const nextScreen = response.notification.request.content.data.headToThisScreen;
      navigation.navigate(nextScreen);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [isSwitchOn]);


  // #region Biometrics

  React.useEffect(() => {
    const retrieveLockState = async () => {
      try {
        const switchState = await AsyncStorage.getItem('isLockEnabled');
        setIsLockEnabled(JSON.parse(switchState));
      } catch (error) {
        console.log('Error retrieving switch state from AsyncStorage:', error);
      }
    }
    retrieveLockState();
  }, []);

  const lockAppHandler = async () => {
    if (isLockEnabled) {
      setIsLockEnabled(false);
      await AsyncStorage.setItem('isLockEnabled', JSON.stringify(false));
      return;
    }
    try {
      const isBiometricAvl = await LocalAuth.hasHardwareAsync();
      const supportedBiometrics = await LocalAuth.supportedAuthenticationTypesAsync();
      const savedBiometrics = await LocalAuth.isEnrolledAsync();
      let biometricAuth; 
      if (isBiometricAvl) {
        if (supportedBiometrics.includes(1)) {
          if (savedBiometrics) {
            biometricAuth = await LocalAuth.authenticateAsync({
              promptMessage: "Confirm your identity",
              cancelLabel: "Cancel",
              disableDeviceFallback: true,
            });
            if (biometricAuth.success) {        
              const newLockVal = !isLockEnabled;
              setIsLockEnabled(newLockVal);
              await AsyncStorage.setItem('isLockEnabled', JSON.stringify(newLockVal));
            }
            if (!biometricAuth.success) {
              setOpenLockAppDialog(true);
              setBiometricWarning(biometricAuth.warning);
            }
          }
          else {
            setOpenLockAppDialog(true);
            setBiometricWarning("No saved fingerprints found, please enroll a fingerprint first");
          }
        }
        else { 
          setOpenLockAppDialog(true);
          setBiometricWarning("Your device is not compatible with fingerprint authentication");
        }
      }
      else { 
        setOpenLockAppDialog(true);
        setBiometricWarning("No fingerprint scanner found");
      }
      } catch (error) {
        console.log('Error: ', error);
      }
  }
  // #endregion

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Settings" navigation={navigation} />
      <View style={{ flex: 1, marginLeft: 25, marginTop: 20, marginRight: 25, gap: 10 }}>
        <TouchableRipple
          onPress={() => setOpenChangeName(prevState => !prevState)}
          style={{ borderRadius: 2, flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <>
            <View style={{paddingRight: 10, paddingLeft: 0, paddingTop: 3}}>
              <IconComponent name={"pencil"} category={"Foundation"} size={20} color={allColors.textColorPrimary}/>
            </View>
            <View style={{ marginLeft: 13 }}>
              <Text variant="bodyLarge" style={{color: allColors.textColorSecondary}}>Change name</Text>
              <Text variant="bodySmall" style={{color: allColors.textColorSecondary}}>{placeholderUsername}</Text>
            </View>
          </>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => navigation.navigate("WelcomeScreen", {updatedCurr: currency})}
          style={{ borderRadius: 2, flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <>
          <View style={{paddingRight: 9, paddingLeft: 0, paddingTop: 3}}>
            <IconComponent name={"currency-sign"} category={"MaterialCommunityIcons"} size={20} color={allColors.textColorPrimary}/>
          </View>
            <View style={{ marginLeft: 13 }}>
              <Text variant="bodyLarge" style={{color: allColors.textColorSecondary}}>Currency Sign</Text>
              <Text variant="bodySmall" style={{color: allColors.textColorSecondary}}>{currency.name}</Text>
            </View>
          </>
        </TouchableRipple>

        <View style={{flexDirection: "row", gap: 2, justifyContent: "space-between"}}>
          <View style={{flexDirection: "row",padding: 9 }}>
            <View style={{paddingRight: 10, paddingLeft: 0, paddingTop: 3}}>
              <IconComponent name={"notifications"} category={"Ionicons"} size={20} color={allColors.textColorPrimary}/>
            </View>
            <View style={{flexDirection: "column", gap: 2, marginLeft: 13 }}>
              <Text variant="bodyLarge" style={{color: allColors.textColorSecondary}}>Notifications</Text>
              <Text variant="bodySmall" style={{color: allColors.textColorSecondary}}>A reminder for adding expenses will be sent</Text>
            </View>
          </View>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} thumbColor={allColors.textColorPrimary} trackColor={allColors.textColorFive} style={{marginRight: 10}}/>
        </View>

        <View style={{flexDirection: "row", gap: 2, justifyContent: "space-between"}}>
          <View style={{flexDirection: "row", padding: 10 }}>
            <View style={{paddingRight: 12, paddingLeft: 0, paddingTop: 3}}>
              <IconComponent name={"lock"} category={"Octicons"} size={20} color={allColors.textColorPrimary}/>
            </View>
            <View style={{flexDirection: "column", gap: 2, marginLeft: 13 }} >
              <Text variant="bodyLarge" style={{color: allColors.textColorSecondary}}>Lock App</Text>
              <Text variant="bodySmall" style={{color: allColors.textColorSecondary}}>When enabled, you need to use fingerprint to unlock the app</Text>
            </View>
          </View>
          <Switch value={isLockEnabled} onValueChange={lockAppHandler} thumbColor={allColors.textColorPrimary} trackColor={allColors.textColorFive} style={{marginRight: 10}}/>
        </View>



      </View>

      <Portal>
        <Dialog visible={openChangeName} onDismiss={()=> setOpenChangeName(false)} style={{backgroundColor: allColors.backgroundColorLessPrimary}}>
          <Dialog.Title style={{color: allColors.textColorSecondary}}>Update name</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={<Text style={{color: allColors.universalColor}}>{"New username"}</Text>}
              style={{ backgroundColor: "transparent" }}
              value={updatedUsername}
              textColor={allColors.universalColor}
              underlineColor={allColors.textColorFive}
              selectionColor={allColors.textSelectionColor}
              activeUnderlineColor={allColors.textColorPrimary}
              onChangeText={text => setUpdatedUsername(text)}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=> setOpenChangeName(false)}>
              <Text style={{color: allColors.textColorFive}}> Cancel </Text>
            </Button>
            <Button onPress={updateUsername}>
              <Text style={{color: allColors.textColorPrimary}}> Update </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={openLockAppDialog} onDismiss={()=> setOpenLockAppDialog(false)} style={{backgroundColor: allColors.backgroundColorLessPrimary}}>
          <Dialog.Title style={{color: allColors.textColorSecondary}}>Alert</Dialog.Title>
          <Dialog.Content>
            <Text style={{color: allColors.textColorSecondary}}>
              {biometricWarning}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=> setOpenLockAppDialog(false)}>
              <Text style={{color: allColors.textColorPrimary}}> OK </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={1200}
        style={{backgroundColor: allColors.backgroundColorLessPrimary}}
        >
          <Text variant="bodyMedium" style={{color: allColors.universalColor}}>
            Permission denied
          </Text>
          <Text variant="bodyMedium" style={{color: allColors.universalColor}}>
            Please enable permissions from settings
          </Text>
      </Snackbar>

    </SafeAreaView>
  );
};

export default SettingsScreen;
