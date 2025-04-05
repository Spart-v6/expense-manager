import React from "react";
import { View, StatusBar, useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme  } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";
import { navigationRef } from './RootNavigation';
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const AppStack = () => {
    const colorScheme = useColorScheme();
    const { theme, updateTheme, resetTheme } = useMaterial3Theme();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.dark.background, // global color throughout the app
    },
  };
  
  return (
    <NavigationContainer ref={navigationRef}  theme={MyTheme}>
      <StatusBar backgroundColor="transparent" translucent />
      <View style={{ flex: 1 }}>
        <DrawerNavigator />
      </View>
    </NavigationContainer>
  );
};

export default AppStack;
