import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();
  const [initialized, setInitialized] = useState(false);
  const [themeColor, setThemeColorState] = useState("#6750A4");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedColor = await AsyncStorage.getItem("themeColor");
        if (savedColor) {
          setThemeColorState(savedColor);
          updateTheme(savedColor);
        }
      } catch (e) {
        console.error("Failed to load themeColor:", e);
      } finally {
        setInitialized(true);
      }
    };
    loadTheme();
  }, []);

  const setThemeColor = async (color) => {
    try {
      await AsyncStorage.setItem("themeColor", color);
      setThemeColorState(color);
      updateTheme(color);
    } catch (e) {
      console.error("Failed to save themeColor:", e);
    }
  };
  
  const resetThemeColor = async () => {
    try {
      await AsyncStorage.removeItem("themeColor");
      setThemeColorState("");
      resetTheme();
    } catch (e) {
      console.error("Failed to reset themeColor:", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeColor, resetThemeColor, initialized }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
