import { View, SafeAreaView, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import React from "react";

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Welcome </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("HomeApp")}>
        <Text>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
