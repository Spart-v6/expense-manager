import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import React from "react";
import { View, StyleSheet, SafeAreaView, useColorScheme } from "react-native";
import { Text, FAB } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.dark.background,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Homes Screen</Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("PlusMoreHome")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
