import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_700Bold  } from "@expo-google-fonts/poppins";
import * as Font from "expo-font";

export default function FontLoader({ children }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Poppins_400Regular,
        Poppins_700Bold
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
