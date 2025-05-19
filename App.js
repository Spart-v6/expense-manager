import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import AppStack from "./navigation/AppStack";
import AuthScreen from "./screens/AuthScreen";
import AnimatedSplash from "./screens/AnimatedSplash";
import * as SplashScreen from "expo-splash-screen";
import { getBiometricPreference } from "./helper/biometricStorage";
import { PaperProvider, MD3DarkTheme, MD3LightTheme, DefaultTheme } from "react-native-paper";
import { navigationRef } from "./navigation/RootNavigation";
import { useColorScheme } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const colorScheme = useColorScheme();
  const { theme, initialized, themeColor } = useThemeContext();
  const [animationDone, setAnimationDone] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [biometricChecked, setBiometricChecked] = useState(false);
  const [authDone, setAuthDone] = useState(false);

  const paperTheme = useMemo(() => {
    const isDark = colorScheme === "dark";
    return isDark
      ? {
          ...MD3DarkTheme,
          colors: {
            ...DefaultTheme.colors,
            ...theme.dark,
          },
        }
      : {
          ...MD3LightTheme,
          colors: {
            ...DefaultTheme.colors,
            ...theme.light,
          },
        };
  }, [colorScheme, theme]);

  useEffect(() => {
    const checkBiometric = async () => {
      const isEnabled = await getBiometricPreference();
      setShowAuthScreen(isEnabled);
      setBiometricChecked(true);
    };

    if (initialized) checkBiometric();
  }, [initialized]);


  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer ref={navigationRef} theme={paperTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {(!animationDone || !biometricChecked) && (
            <Stack.Screen name="Splash">
              {() => (
                <AnimatedSplash
                  onAnimationDone={async () => {
                    await SplashScreen.hideAsync();
                    setAnimationDone(true);
                  }}
                />
              )}
            </Stack.Screen>
          )}

          {animationDone && biometricChecked && showAuthScreen && !authDone && (
            <Stack.Screen name="Auth">
              {() => <AuthScreen onAuthSuccess={() => setAuthDone(true)} />}
            </Stack.Screen>
          )}

          {animationDone && biometricChecked && (!showAuthScreen || authDone) && (
            <Stack.Screen name="AppStack" component={AppStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
