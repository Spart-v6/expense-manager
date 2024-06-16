import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { useFonts, Karla_400Regular } from "@expo-google-fonts/karla";
import * as Font from "expo-font";

export default function FontLoader({ children }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Karla_400Regular,
        Karla_400Regular,
      });

      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return children;
}
