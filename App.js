import "react-native-gesture-handler";
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
  Text
} from "react-native-paper";
import store from "./redux/store";
import { Provider } from "react-redux";
import React, { useState, useEffect } from "react";
import AppStack from "./navigation/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as LocalAuth from "expo-local-authentication";
import allColors from "./commons/allColors";
import { View, SafeAreaView, StatusBar, Image } from "react-native";

const theme = {
  ...DefaultTheme,
  version: 3,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
  },
};

const App = () => {
  // #region Notifications
  const [notification, setNotification] = React.useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);  
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
  
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
    if (isSwitchOn) {
      registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
    }
  }, [isSwitchOn]);
  

  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    const { status } = await Notifications.getPermissionsAsync();
  
    if (status !== 'granted') {
      const { status: finalStatus } = await Notifications.requestPermissionsAsync();
      if (finalStatus !== 'granted') {
        setShowError(true);
        setIsSwitchOn(false);
        AsyncStorage.setItem('isSwitchOn', JSON.stringify(false));
        return;
      }
    }
  
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  // #endregion


  // #region Biometrics
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [authorize, setAuthorize] = useState(false)
  const [authMsg, setAuthMsg] = useState("required");
  const [warningMsg, setWarningMsg] = useState("");
  const [savedBiometricsNotAvl, setSavedBiometricsNotAvl] = useState(false);
  const [isBiometricAuthOn, setIsBiometricAuthOn] = useState(false);
  const [isLockStateRetrieved, setIsLockStateRetrieved] = useState(false);

  // getting the switch value for lock app
  useEffect(() => {
    const retrieveLockState = async () => {
      try {
        const switchState = await AsyncStorage.getItem('isLockEnabled');
        setIsBiometricAuthOn(JSON.parse(switchState));
        setIsLockStateRetrieved(true);
      } catch (error) {
        console.log('Error retrieving switch state from AsyncStorage:', error);
      }
    }
    retrieveLockState();
  }, []);

  const handleBiometricAuth = async () => {
    if (!isLockStateRetrieved) {
      return;
    }

    const isBiometricAvl = await LocalAuth.hasHardwareAsync();

    let supportedBiometrics;
    if (isBiometricAvl) {
      supportedBiometrics = await LocalAuth.supportedAuthenticationTypesAsync();
    }

    const savedBiometrics = await LocalAuth.isEnrolledAsync();
    if (!savedBiometrics) {
      setSavedBiometricsNotAvl(true);
    }

    const biometricAuth = await LocalAuth.authenticateAsync({
      promptMessage: "Login with biometric",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    })

    // Log the user in on success
    if (biometricAuth && isBiometricAuthOn) { 
      console.log("Inn");
      setAuthorize(biometricAuth.success);
    }

    if (!biometricAuth.success) {
      setAuthMsg("failed");
      setWarningMsg(biometricAuth.warning);
    }

    // printing stuff
    console.log({isBiometricAvl});
    console.log({supportedBiometrics});
    console.log({savedBiometrics});
    console.log({biometricAuth});

  }

  useEffect(() => {
      handleBiometricAuth();
  }, [isLockStateRetrieved])

  // #endregion


  const handleLogginIn = () => {
    if (!isBiometricAuthOn || (authorize || savedBiometricsNotAvl)) return <AppStack/>;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: allColors.backgroundColorPrimary}}>
        <StatusBar translucent backgroundColor={"transparent"} />
        <View style={{marginTop: 100, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('./assets/adaptive-icon.png')} style={{ width: 100, height: 100 }}/>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>

          <Text variant="titleLarge"> Authentication {authMsg} </Text>
          {authMsg === "failed" && (
              <Text>{warningMsg}</Text>
          )}
        </View>
      </SafeAreaView>
    )
  };

  // console.log("Authorize ", authorize);
  console.log("IsBioMetricAuthOn", isBiometricAuthOn);
  // console.log("SavedBioMetricNotAvl", savedBiometricsNotAvl);

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        {handleLogginIn()}
      </PaperProvider>
    </Provider>
  );
};

export default App;
