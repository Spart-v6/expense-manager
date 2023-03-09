import { View } from "react-native";
import { Text } from "react-native-paper";
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
        <Text>{item.amount}</Text>
        <Text>{item.date}</Text>
        <Text>{item.account}</Text>
      </View>
    </View>
  );
};

export default Expenses;
