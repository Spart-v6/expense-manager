import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_700Bold  } from "@expo-google-fonts/poppins";
import * as Font from "expo-font";
import useDynamicColors from "../commons/useDynamicColors";

export default function FontLoader({ children }) {
  const allColors = useDynamicColors();
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
      <SafeAreaView style={{ flex: 1, backgroundColor: allColors.backgroundColorPrimary }}>
        <StatusBar translucent backgroundColor="transparent" />
        {/* <ActivityIndicator size="large" /> */}
      </SafeAreaView>
    );
  }

  return children;
}
