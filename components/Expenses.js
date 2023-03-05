import { View, Text } from "react-native";
import React from "react";

const Expenses = ({ item }) => {
  return (
    <View
      style={{
        backgroundColor: "red",
        borderRadius: 5,
        margin: 20
      }}
    >
      <View style={{width:"100%", height: 70}}>
        <Text>{item.name}</Text>
      </View>
    </View>
  );
};

export default Expenses;
