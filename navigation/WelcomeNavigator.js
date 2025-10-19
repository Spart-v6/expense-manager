import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen1 from "../screens/WelcomeScreen1";
import WelcomeScreen2 from "../screens/WelcomeScreen2";
import WelcomeScreen3 from "../screens/WelcomeScreen3";
import { NativeModules, useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useThemeContext } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();
const { NavigationBarModule } = NativeModules;

export default function WelcomeNavigator({ onFinish }) {
  const colorScheme = useColorScheme();
  // const { theme } = useMaterial3Theme();
    const { theme, initialized, themeColor } = useThemeContext(); 

  const changeNavBarColor = (color) => {
    NavigationBarModule.setNavigationBarColor(color);
  };

  changeNavBarColor(theme[colorScheme].background);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome1" component={WelcomeScreen1} />
      <Stack.Screen name="Welcome2" component={WelcomeScreen2} />
      <Stack.Screen name="Welcome3">
        {(props) => <WelcomeScreen3 {...props} onFinish={onFinish} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
