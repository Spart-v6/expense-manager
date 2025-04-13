import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useColorScheme } from "react-native";
import { useMemo, useEffect, useState } from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import AppStack from "./navigation/AppStack";
import * as SplashScreen from "expo-splash-screen";
import AnimatedSplash from "./screens/AnimatedSplash";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const prepare = async () => {
      // Any setup logic like fonts or initial data loading
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // DO NOT hide splash here yet!
    };
    prepare();
  }, []);

  if (!ready) {
    return (
      <PaperProvider theme={paperTheme}>
        <AnimatedSplash onAnimationDone={() => setReady(true)} />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <AppStack />
    </PaperProvider>
  );
}
