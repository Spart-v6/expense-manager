import React from "react";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
// import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import HomeStackNavigator from "./HomeStackNavigator";
import CardStackNavigator from "./CardStackNavigator";
import PaymentsScreen from "../screens/PaymentsScreen";
import SplitScreen from "../screens/SplitScreen";
import  { useEffect } from "react";
import {
  useColorScheme,
  NativeModules,
} from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const Tab = createNativeBottomTabNavigator();
// const Tab = createMaterialBottomTabNavigator();


const { NavigationBarModule } = NativeModules;

export default function BottomTabNavigator() {
  const changeNavBarColor = (color) => {
    NavigationBarModule.setNavigationBarColor(color);
  };

  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();

  useEffect(() => {
    if (colorScheme === "dark")
      changeNavBarColor(theme.dark.surface);
    else changeNavBarColor(theme.light.onTertiaryContainer);
  }, [colorScheme]);



  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.dark.primary,
      }}
      hapticFeedbackEnabled
      labeled
      sidebarAdaptable
      tabBarStyle={{backgroundColor: theme.dark.surface}}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: () => require("../assets/home.svg"),
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardStackNavigator}
        options={{
          tabBarIcon: () => require("../assets/card.svg"),
        }}
      />
      <Tab.Screen
        name="Split"
        component={SplitScreen}
        options={{
          tabBarIcon: () => require("../assets/share.svg"),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          tabBarIcon: () => require("../assets/loop.svg"),
        }}
      />
    </Tab.Navigator>
  );
}
