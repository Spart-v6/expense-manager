import "react-native-gesture-handler";
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import store from "./redux/store";
import { Provider } from "react-redux";
import React, { useState, useEffect } from "react";
import AppStack from "./navigation/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as LocalAuth from "expo-local-authentication";
import useDynamicColors from "./commons/useDynamicColors";
import FontLoader from "./components/FontLoader";
import MyText from "./components/MyText";
import { View, SafeAreaView, StatusBar, Image, ActivityIndicator } from "react-native";
import SplashScreen from "./screens/SplashScreen";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import SmsListener from 'react-native-android-sms-listener';

const BACKGROUND_FETCH_TASK = 'background-fetch';

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



// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 0.5, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}


const App = () => {
  const allColors = useDynamicColors();

  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  // For splash scree animation
  const [animationDone, setAnimationDone] = React.useState(false);

  React.useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [animationDone]);


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
      } catch (error) {}
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
  }, [isBiometricAuthOn, animationDone]);
  

  // #endregion
  // <SplashScreen setAnimationDone={setAnimationDone} />

  const handleLogginIn = () => {

    if(animationDone) {
      if (loading) return (
          <SafeAreaView style={{ flex: 1, backgroundColor: allColors.backgroundColorPrimary, justifyContent: 'center', alignContent: "center", alignItems: "center" }}>
          <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
          <ActivityIndicator size="large" color={allColors.textColorFive}/>
        </SafeAreaView>
      );
      
      if (!isBiometricAuthOn || (authorize || savedBiometricsNotAvl)) return <AppStack/>;
      return (
        <SafeAreaView style={{flex: 1, backgroundColor: allColors.backgroundColorPrimary}}>
          <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
          <View style={{marginTop: 100, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('./assets/newIcons/adaptive-icon.png')} style={{ width: 100, height: 100 }}/>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100, gap: 10}}>

            <MyText variant="titleLarge" style={{color: allColors.universalColor}}> Authentication {authMsg} </MyText>
            {authMsg === "failed" && (
              <MyText style={{color: allColors.universalColor}}>{warningMsg}</MyText>
            )}
          </View>
        </SafeAreaView>
      )
    }
    else return <SplashScreen setAnimationDone={setAnimationDone} />;
  };

  // Initialize background fetch when app loads
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    console.log("Background fetch status ", status);
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <FontLoader>
          {handleLogginIn()}
        </FontLoader>
      </PaperProvider>
    </Provider>
  );
};

export default App;
