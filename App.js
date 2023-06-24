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
import useDynamicColors from "./commons/useDynamicColors";
import { View, SafeAreaView, StatusBar, Image, ActivityIndicator } from "react-native";

const theme = {
  ...DefaultTheme,
  version: 3,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

const App = () => {
  const allColors = useDynamicColors();

  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  // #region Biometrics
  const [loading, setLoading] = useState(true);
  const [authorize, setAuthorize] = useState(false)
  const [authMsg, setAuthMsg] = useState("required");
  const [warningMsg, setWarningMsg] = useState("");
  const [savedBiometricsNotAvl, setSavedBiometricsNotAvl] = useState(false);
  const [isBiometricAuthOn, setIsBiometricAuthOn] = useState(false);

  useEffect(() => {
    const retrieveLockState = async () => {
      try {
        const switchState = await AsyncStorage.getItem('isLockEnabled');
        setIsBiometricAuthOn(JSON.parse(switchState));
      } catch (error) {
        console.log('Error retrieving switch state from AsyncStorage:', error);
      }
    }
  
    const handleBiometricAuth = async () => {
      if (!isBiometricAuthOn) {
        setLoading(false);
        return;
      }

      const isBiometricAvl = await LocalAuth.hasHardwareAsync();
  
      let supportedBiometrics;
      if (isBiometricAvl) supportedBiometrics = await LocalAuth.supportedAuthenticationTypesAsync();
  
      const savedBiometrics = await LocalAuth.isEnrolledAsync();
      if (!savedBiometrics) setSavedBiometricsNotAvl(true);
  
      const biometricAuth = await LocalAuth.authenticateAsync({
        promptMessage: "Login with biometric",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      })
  
      // Log the user in on success
      if (biometricAuth) setAuthorize(biometricAuth.success);
  
      if (!biometricAuth.success) {
        setAuthMsg("failed");
        setWarningMsg(biometricAuth.warning);
      }
      setLoading(false);
    }
    retrieveLockState();
    handleBiometricAuth();
  }, [isBiometricAuthOn]);
  

  // #endregion

  const handleLogginIn = () => {
    if (loading) return (
      <SafeAreaView style={{ flex: 1, backgroundColor: allColors.backgroundColorPrimary }}>
        <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
        <ActivityIndicator size="large" color={allColors.textColorFive}/>
      </SafeAreaView>
    );
  
    if (!isBiometricAuthOn || (authorize || savedBiometricsNotAvl)) return <AppStack/>;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: allColors.backgroundColorPrimary}}>
        <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
        <View style={{marginTop: 100, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('./assets/adaptive-icon.png')} style={{ width: 100, height: 100 }}/>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>

          <Text variant="titleLarge" style={{color: allColors.universalColor}}> Authentication {authMsg} </Text>
          {authMsg === "failed" && (
              <Text style={{color: allColors.universalColor}}>{warningMsg}</Text>
          )}
        </View>
      </SafeAreaView>
    )
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        {handleLogginIn()}
      </PaperProvider>
    </Provider>
  );
};

export default App;
