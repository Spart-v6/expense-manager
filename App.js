import "react-native-gesture-handler";
import {
  Button,
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import store from "./redux/store";
import { Provider } from "react-redux";
import Svg, { Path } from "react-native-svg";
import React, { useState, useEffect } from "react";
import AppStack from "./navigation/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as LocalAuth from "expo-local-authentication";
import useDynamicColors from "./commons/useDynamicColors";
import FontLoader from "./components/FontLoader";
import MyText from "./components/MyText";
import { View, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity } from "react-native";
import SplashScreen from "./screens/SplashScreen";

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

const BigLogo = () => {
  const allColors = useDynamicColors();
  return (
    <View>
      <Svg
        width="600"
        height="200"
        viewBox="0 0 1024 1024"
        fill="red"
        xmlns="http://www.w3.org/2000/svg"
        >
        <Path
          d="M522.5 224C598.485 224 671.357 254.185 725.086 307.914C778.815 361.643 809 434.515 809 510.5C809 586.484 778.815 659.357 725.086 713.086C671.357 766.815 598.485 797 522.5 797L522.5 510.5L522.5 224Z"
          fill={allColors.splashScreenIcon3}
          />
        <Path
          d="M520.488 355C544.665 368.97 565.536 393.018 580.536 424.188C595.536 455.358 604.011 492.291 604.919 530.445C605.826 568.599 599.126 606.311 585.644 638.944C572.161 671.577 545.332 699.584 521.878 716L521.878 687.406L512.003 661.59C528.49 650.051 542.322 631.682 551.799 608.744C561.277 585.806 565.986 559.297 565.348 532.477C564.71 505.658 558.753 479.697 548.209 457.787C537.665 435.877 522.994 418.973 506 409.153L520.488 355Z"
          fill={allColors.splashScreenIcon2}
        />
        <Path
          d="M325 266C393.161 266 458.53 293.077 506.726 341.274C554.923 389.47 582 454.839 582 523C582 591.161 554.923 656.53 506.726 704.726C458.53 752.923 393.161 780 325 780L325 523L325 266Z"
          fill={allColors.splashScreenIcon1}
          />
      </Svg>
    </View>
  )
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

  useEffect(() => {
    const retrieveLockState = async () => {
      try {
        const switchState = await AsyncStorage.getItem('isLockEnabled');
        setIsBiometricAuthOn(JSON.parse(switchState));
      } catch (error) {}
    }
    retrieveLockState();
    if (animationDone) {
      setLoading(false);
      handleBiometricAuth();
    }
  }, [isBiometricAuthOn, animationDone]);
  

  // #endregion

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
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <BigLogo/>

            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100, marginBottom: 40, gap: 10}}>
              <MyText variant="headlineMedium" style={{color: allColors.universalColor}}> Authentication </MyText>
              {authMsg === "failed" && (
                <MyText style={{color: allColors.universalColor}}>{warningMsg}</MyText>
              )}
            </View>

            <TouchableOpacity
              style={{
                borderColor: "transparent",
                backgroundColor: allColors.addBtnColors,
                borderRadius: 15,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                padding: 10,
              }}
              onPress={handleBiometricAuth}
              activeOpacity={0.7}
            >
              <MyText
                style={{
                  color: allColors.backgroundColorPrimary,
                  fontFamily: "Karla_400Regular",
                  fontSize: 18,
                }}
              >
                Use fingerprint
              </MyText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )
    }
    else return <SplashScreen setAnimationDone={setAnimationDone} />;
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
