import {
  SafeAreaView,
  StatusBar,
  View,
  useColorScheme,
} from "react-native";
import { Text, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import React from "react";
import { useThemeContext } from "../context/ThemeContext";

const WelcomeScreen1 = ({ navigation }) => {
  const colorScheme = useColorScheme();
  // const { theme } = useMaterial3Theme();
    const { theme, initialized, themeColor } = useThemeContext(); 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme[colorScheme].background }}>
      <StatusBar backgroundColor="transparent" translucent />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingTop: 80 }}>
        <LottieView
          source={require("../assets/wallet_1.json")}
          autoPlay
          loop={false}
          style={{ width: 250, height: 250 }}
        />

        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 50 }}>
          <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>Thrifty</Text>
          <Text
            style={{
              color: theme[colorScheme].onBackground,
              marginHorizontal: 50,
              marginTop: 20,
              textAlign: "center",
            }}
            variant="titleMedium"
          >
            An expense manager to track spending, manage income, handle multiple accounts, splits, and recurring payments — all in one place.
          </Text>
          <Text variant="titleMedium" style={{ marginTop: 20 }}>
            Let’s get started on your journey to smarter spending!
          </Text>
        </View>
      </View>

      <View style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingRight: 30
      }}>
        <Button
          icon="chevron-right"
          mode="contained"
          onPress={() => navigation.navigate("Welcome2")}
        >
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen1;
