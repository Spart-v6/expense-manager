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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleDailyNotifications() {
  const trigger = {
    hour: 20,
    minute: 15,
    repeats: true,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Expense Reminder 🪙",
      body: 'Don\'t forget to add your expenses for the day!',
      data: { headToThisScreen: 'PlusMoreHome' },
    },
    trigger,
  });
}


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
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

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

    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
  
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
  
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });
  
    if (isSwitchOn) {
      scheduleDailyNotifications();
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
