import React, { useState, useEffect } from "react";
import { View, StatusBar, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";
import { navigationRef } from "./RootNavigation";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import WelcomeNavigator from "../navigation/WelcomeNavigator";
import { useThemeContext } from "../context/ThemeContext";
import { SearchProvider } from "../context/SearchContext";

const AppStack = () => {
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme[colorScheme].background,
    },
  };

  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if welcome screen has already been shown
  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("welcomeDone");
        if (!value) {
          setShowWelcome(true);
        }
      } catch (error) {
        console.log("Error reading AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };
    checkWelcomeStatus();
  }, []);

  const handleWelcomeFinish = async () => {
    try {
      await AsyncStorage.setItem("welcomeDone", "true");
      setShowWelcome(false);
    } catch (error) {
      console.log("Error saving welcome status:", error);
    }
  };

  // Prevent flicker while checking storage
  if (loading) return null;

  if (showWelcome) {
    return <WelcomeNavigator onFinish={handleWelcomeFinish} />;
  }

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent />
      <View style={{ flex: 1 }}>
        <SearchProvider>
          <DrawerNavigator />
        </SearchProvider>
      </View>
    </>
  );
};

export default AppStack;
