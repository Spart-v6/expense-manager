import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Text } from "react-native-paper";

const DrawerContent = (props) => {
  return (
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <ScrollView style={{marginLeft: 5}}>
        <View>
          <Text variant="headlineMedium">Rupaya</Text>
        </View>
        <TouchableOpacity style={{marginTop: 20}} onPress={() => props.navigation.navigate("SettingsScreen")}>
          <Text variant="titleMedium">Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrawerContent;
