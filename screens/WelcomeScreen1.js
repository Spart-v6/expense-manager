import {
  SafeAreaView,
  StatusBar,
  View,
  useColorScheme,
  Dimensions,
} from "react-native";
import { Button, Text } from "react-native-paper";
import React from "react";
import { useThemeContext } from "../context/ThemeContext";

const WelcomeScreen1 = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext(); 
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme[colorScheme].background }}>
      <StatusBar backgroundColor="transparent" translucent />

      <View style={{ flex: 1, justifyContent: "center", marginTop: 100, paddingHorizontal: 30 }}>
        {/* Headline Centered */}
        <Text
          style={{
            fontWeight: "600",
            color: theme[colorScheme].primary,
            textAlign: "left",
            fontSize: 69
          }}
        >
          Track Your{"\n"}Spending{"\n"}Effortlessly
        </Text>

        {/* Small Gap */}
        <View style={{ height: 20 }} />

        {/* Subtext */}
        <Text
          style={{
            color: theme[colorScheme].secondary,
            opacity: 0.8,
            textAlign: "left",
            fontSize: 18
          }}
        >
          An expense manager to track spending, manage income,{"\n"}handle multiple accounts, splits, and recurring payments — all in one place.
        </Text>
      </View>

      {/* Full Width Button at Bottom */}
      <View style={{ paddingHorizontal: 30, paddingBottom: 30 }}>
        <Button
          icon="chevron-right"
          mode="contained"
          contentStyle={{ height: 50 }}
          style={{
            borderRadius: 30,
            width: "100%",
          }}
          labelStyle={{
            fontSize: 16,
          }}
          onPress={() => navigation.navigate("Welcome2")}
        >
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen1;
