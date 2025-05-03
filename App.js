import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import AppStack from "./navigation/AppStack";
import AuthScreen from "./screens/AuthScreen";
import AnimatedSplash from "./screens/AnimatedSplash";
import * as SplashScreen from "expo-splash-screen";
import { getBiometricPreference } from "./helper/biometricStorage";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { navigationRef } from "./navigation/RootNavigation";
import { useColorScheme } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
    return colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };
  }, [colorScheme, themeColor]);

  useEffect(() => {
    const checkBiometric = async () => {
      const isEnabled = await getBiometricPreference();
      console.log("Biometric pref fetched:", isEnabled);
      setShowAuthScreen(isEnabled);
      setBiometricChecked(true);
    };

    if (initialized) checkBiometric();
  }, [initialized]);


  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer ref={navigationRef} theme={paperTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Step 1: Still loading animation or biometric preference? Show splash */}
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

          {/* Step 2: If biometric is enabled and auth is not yet done, show AuthScreen */}
          {animationDone && biometricChecked && showAuthScreen && !authDone && (
            <Stack.Screen name="Auth">
              {() => <AuthScreen onAuthSuccess={() => setAuthDone(true)} />}
            </Stack.Screen>
          )}

          {/* Step 3: Show AppStack if animation + biometric check done and either auth is done or not required */}
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
