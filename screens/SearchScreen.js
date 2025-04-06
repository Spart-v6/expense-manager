import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const SearchScreen = ({ navigation }) => {
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Search Screen
        </Text>
      </View>
    </>
  );
};

export default SearchScreen;
