import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import React from "react";
import { useColorScheme } from "react-native";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const PlusMoreHome = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.dark.background,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Plus more Home Screen
      </Text>
    </View>
  );
};

export default PlusMoreHome;
