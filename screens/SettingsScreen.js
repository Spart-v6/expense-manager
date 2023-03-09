import React from "react";
import { View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import AppHeader from "../components/AppHeader";

const SettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Settings" navigation={navigation} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Settings </Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
