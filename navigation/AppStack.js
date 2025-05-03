import React, { useState, useEffect } from "react";
import { View, StatusBar, useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme  } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";
import { navigationRef } from './RootNavigation';
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import WelcomeNavigator  from "../navigation/WelcomeNavigator";
import { useThemeContext } from "../context/ThemeContext";

const AppStack = () => {
  console.log("AppStack rendered= ============== ");
    const colorScheme = useColorScheme();
    const { theme, initialized, themeColor } = useThemeContext(); 

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme[colorScheme].background, // global color throughout the app
    },
  };

  // States
  const [showWelcome, setShowWelcome] = useState(false); // make this true

  if (showWelcome) {
    return (
      <NavigationContainer ref={navigationRef} theme={MyTheme}>
        <WelcomeNavigator onFinish={() => setShowWelcome(false)} />
      </NavigationContainer>
    )
  }


  return (
    <>
      <StatusBar backgroundColor="transparent" translucent />
      <View style={{ flex: 1 }}>
        <DrawerNavigator />
      </View>
    </>
  );
};

export default AppStack;
