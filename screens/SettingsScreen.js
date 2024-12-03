import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import {
  TouchableRipple,
  Dialog,
  Portal,
  Button,
  TextInput,
  Switch,
  Snackbar,
} from "react-native-paper";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import { IconComponent } from "../components/IconPickerModal";
import useDynamicColors from "../commons/useDynamicColors";
import {
  getUsernameFromStorage,
  getCurrencyFromStorage,
} from "../helper/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as LocalAuth from "expo-local-authentication";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
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
  const [placeholderUsername, setPlaceholderUsername] =
    React.useState(updatedUsername);
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
    } catch (error) {}
  };

  const onToggleSwitch = async () => {
    const newSwitchValue = !isSwitchOn;
    setIsSwitchOn(newSwitchValue);
    try {
      await AsyncStorage.setItem("isSwitchOn", JSON.stringify(newSwitchValue));
    } catch (error) {}
    if (newSwitchValue) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Expense Reminder",
          body: "Don't forget to add your expenses for today!",
          data: { headToThisScreen: "PlusMoreHome" },
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
    }
    if (!newSwitchValue) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    return;
  };

  React.useEffect(() => {
    const retrieveSwitchState = async () => {
      try {
        const switchState = await AsyncStorage.getItem("isSwitchOn");
        setIsSwitchOn(JSON.parse(switchState));
      } catch (error) {}
    };
    retrieveSwitchState();
  }, []);

  React.useEffect(() => {
    const getPermission = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          setShowError(true);
          await AsyncStorage.setItem("expopushtoken", "");
          await AsyncStorage.setItem("isSwitchOn", JSON.stringify(false));
          setIsSwitchOn(false);
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await AsyncStorage.setItem("expopushtoken", token);
      } else {
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };
    if (isSwitchOn) getPermission();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const nextScreen =
          response.notification.request.content.data.headToThisScreen;
        navigation.navigate(nextScreen);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [isSwitchOn]);

  // #region Biometrics

  React.useEffect(() => {
    const retrieveLockState = async () => {
      try {
        const switchState = await AsyncStorage.getItem("isLockEnabled");
        setIsLockEnabled(JSON.parse(switchState));
      } catch (error) {}
    };
    retrieveLockState();
  }, []);

  const lockAppHandler = async () => {
    if (isLockEnabled) {
      setIsLockEnabled(false);
      await AsyncStorage.setItem("isLockEnabled", JSON.stringify(false));
      return;
    }
    try {
      const isBiometricAvl = await LocalAuth.hasHardwareAsync();
      const supportedBiometrics =
        await LocalAuth.supportedAuthenticationTypesAsync();
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
              await AsyncStorage.setItem(
                "isLockEnabled",
                JSON.stringify(newLockVal)
              );
            }
            if (!biometricAuth.success) {
              setOpenLockAppDialog(true);
              setBiometricWarning(biometricAuth.warning);
            }
          } else {
            setOpenLockAppDialog(true);
            setBiometricWarning(
              "No saved fingerprints found, please enroll a fingerprint first"
            );
          }
        } else {
          setOpenLockAppDialog(true);
          setBiometricWarning(
            "Your device is not compatible with fingerprint authentication"
          );
        }
      } else {
        setOpenLockAppDialog(true);
        setBiometricWarning("No fingerprint scanner found");
      }
    } catch (error) {}
  };
  // #endregion

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Settings" navigation={navigation} isMenuNeeded={false}/>
      <View
        style={{
          flex: 1,
          marginLeft: 20,
          marginTop: 20,
          marginRight: 20,
          gap: 10,
        }}
      >
        <TouchableRipple
          onPress={() => setOpenChangeName((prevState) => !prevState)}
          style={{
            borderRadius: 2,
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          <>
            <View style={{ paddingRight: 10, paddingLeft: 0, paddingTop: 3 }}>
              <IconComponent
                name={"pencil"}
                category={"Foundation"}
                size={20}
                color={allColors.textColorPrimary}
              />
            </View>
            <View style={{ marginLeft: 13 }}>
              <MyText
                variant="bodyLarge"
                style={{ color: allColors.textColorSecondary }}
              >
                Change name
              </MyText>
              <MyText
                variant="bodySmall"
                style={{ color: allColors.textColorSecondary }}
              >
                {placeholderUsername}
              </MyText>
            </View>
          </>
        </TouchableRipple>
        <TouchableRipple
          onPress={() =>
            navigation.navigate("WelcomeScreen", { updatedCurr: currency })
          }
          style={{
            borderRadius: 2,
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          <>
            <View style={{ paddingRight: 9, paddingLeft: 0, paddingTop: 3 }}>
              <IconComponent
                name={"currency-sign"}
                category={"MaterialCommunityIcons"}
                size={20}
                color={allColors.textColorPrimary}
              />
            </View>
            <View style={{ marginLeft: 13 }}>
              <MyText
                variant="bodyLarge"
                style={{ color: allColors.textColorSecondary }}
              >
                Currency Sign
              </MyText>
              <MyText
                variant="bodySmall"
                style={{ color: allColors.textColorSecondary }}
              >
                {currency.name}
              </MyText>
            </View>
          </>
        </TouchableRipple>

        <View
          style={{
            flexDirection: "row",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", padding: 9 }}>
            <View style={{ paddingRight: 10, paddingLeft: 0, paddingTop: 3 }}>
              <IconComponent
                name={"notifications"}
                category={"Ionicons"}
                size={20}
                color={allColors.textColorPrimary}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: 2,
                marginLeft: 13,
                maxWidth: 200,
              }}
            >
              <MyText
                variant="bodyLarge"
                style={{ color: allColors.textColorSecondary }}
              >
                Notifications
              </MyText>
              <MyText
                variant="bodySmall"
                style={{ color: allColors.textColorSecondary }}
              >
                A reminder for adding expenses will be sent
              </MyText>
            </View>
          </View>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            thumbColor={allColors.textColorPrimary}
            trackColor={allColors.textColorFive}
            style={{ marginRight: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", padding: 10 }}>
            <View style={{ paddingRight: 12, paddingLeft: 0, paddingTop: 3 }}>
              <IconComponent
                name={"lock"}
                category={"Octicons"}
                size={20}
                color={allColors.textColorPrimary}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: 2,
                marginLeft: 13,
                maxWidth: 250,
              }}
            >
              <MyText
                variant="bodyLarge"
                style={{ color: allColors.textColorSecondary }}
              >
                Lock App
              </MyText>
              <MyText
                variant="bodySmall"
                style={{ color: allColors.textColorSecondary }}
              >
                When enabled, you need to use fingerprint to unlock the app
              </MyText>
            </View>
          </View>
          <Switch
            value={isLockEnabled}
            onValueChange={lockAppHandler}
            thumbColor={allColors.textColorPrimary}
            trackColor={allColors.textColorFive}
            style={{ marginRight: 10 }}
          />
        </View>
      </View>

      <Portal>
        <Dialog
          visible={openChangeName}
          onDismiss={() => setOpenChangeName(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
          theme={{
            colors: {
              backdrop: "#00000099",
            },
          }}
        >
          <Dialog.Title
            style={{
              color: allColors.textColorSecondary,
              fontFamily: "Karla_400Regular",
            }}
          >
            Update name
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={
                <MyText style={{ color: allColors.universalColor }}>
                  {"New username"}
                </MyText>
              }
              style={{ backgroundColor: "transparent" }}
              value={updatedUsername}
              textColor={allColors.universalColor}
              underlineColor={allColors.textColorFive}
              selectionColor={allColors.textSelectionColor}
              contentStyle={{ fontFamily: "Karla_400Regular" }}
              activeUnderlineColor={allColors.textColorPrimary}
              onChangeText={(text) => setUpdatedUsername(text)}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpenChangeName(false)}>
              <MyText style={{ color: allColors.universalColor }}>
                {" "}
                Cancel{" "}
              </MyText>
            </Button>
            <Button onPress={updateUsername}>
              <MyText style={{ color: allColors.textColorPrimary }}>
                {" "}
                Update{" "}
              </MyText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={openLockAppDialog}
          onDismiss={() => setOpenLockAppDialog(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Title
            style={{
              color: allColors.textColorSecondary,
              fontFamily: "Karla_400Regular",
            }}
          >
            Alert
          </Dialog.Title>
          <Dialog.Content>
            <MyText style={{ color: allColors.textColorSecondary }}>
              {biometricWarning}
            </MyText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpenLockAppDialog(false)}>
              <MyText style={{ color: allColors.textColorPrimary }}>
                {" "}
                OK{" "}
              </MyText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={1200}
        style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
      >
        <MyText
          variant="bodyMedium"
          style={{ color: allColors.universalColor }}
        >
          Permission denied
        </MyText>
        <MyText
          variant="bodyMedium"
          style={{ color: allColors.universalColor }}
        >
          Please enable permissions from settings
        </MyText>
      </Snackbar>
    </SafeAreaView>
  );
};

export default SettingsScreen;
