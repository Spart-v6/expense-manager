import { View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import AppHeader from "../components/AppHeader";

const PlusMoreAccount = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Add Card" navigation={navigation} />
      <View>
        <Text> ================ Plus more Accounts </Text>
      </View>
    </SafeAreaView>
  );
};

export default PlusMoreAccount;
