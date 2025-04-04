import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const SplitScreen = ({ navigation }) => {
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Splittingggg Screen
        </Text>
      </View>
    </>
  );
};

export default SplitScreen;
