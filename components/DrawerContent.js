import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";

const DrawerContent = (props) => {
  return (
    <SafeAreaView style={{ flex: 1, margin: 20 }}>
      <ScrollView style={{marginLeft: 5}}>
        <View>
          <Text>Rupaya</Text>
        </View>
        <TouchableOpacity style={{marginTop: 20}} onPress={() => props.navigation.navigate("SettingsScreen")}>
          <Text>Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DrawerContent;
