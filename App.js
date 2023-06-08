import "react-native-gesture-handler";
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import store from "./redux/store";
import { Provider } from "react-redux";
import React from "react";
import AppStack from "./navigation/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

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

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppStack />
      </PaperProvider>
    </Provider>
  );
};

export default App;
