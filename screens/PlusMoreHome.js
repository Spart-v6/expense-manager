import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const PlusMoreHome = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'red' }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Plus more Home Screen
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PlusMoreHome;
