import { View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import moment from "moment";
import allColors from "../commons/allColors";

const Expenses = ({ item, index }) => {
  var date = moment(item.date, "DD/MM/YYYY");
  var dateFormat = date.format("DD");
  var dayOfWeekFormat = date.format("ddd");

  return (
    <View
      style={{
        borderRadius: 5,
        marginTop: 20
      }}
    >
      <View style={{height: 70, flexDirection: "row", justifyContent: "space-between", alignItems:"center"}}>
        <View style={{flexDirection: "row", gap: 20, alignItems: 'center'}}>
          <View style={{ borderRadius: 50, justifyContent: "center", alignItems:"center", marginLeft: 20}}>
            <Text variant="titleLarge">
              {dateFormat}
            </Text>
            <Text variant="titleLarge">
              {dayOfWeekFormat}
            </Text>
          </View>
          <View>
            <Text variant="titleLarge">{item.name}</Text>
            <Text>Account</Text>
          </View>
        </View>
        <View style={{alignItems: "center", marginRight: 20}}>
          <Text variant="titleMedium">{item.amount}</Text>
        </View>
      </View>
    </View>
  );
};

export default Expenses;
