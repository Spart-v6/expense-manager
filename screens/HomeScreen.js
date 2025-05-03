import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import React from "react";
import { View, StyleSheet, SafeAreaView, useColorScheme } from "react-native";
import { Text, FAB } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  // const { theme, updateTheme, resetTheme } = useMaterial3Theme();
    const { theme, initialized, themeColor } = useThemeContext(); 
    const styles = makeStyles(theme);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Homes Screen</Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("PlusMoreHome")}
          variant="tertiary"
          mode="flat"
          color={theme.dark.onPrimaryContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
  fab: {
    backgroundColor: theme.dark.primaryContainer,
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
