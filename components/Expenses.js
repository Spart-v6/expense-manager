import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import moment from "moment";
import allColors from "../commons/allColors";
import { getCurrencyFromStorage } from "../helper/constants";

const Expenses = ({ item, index, onPress }) => {
  const [currency, setCurrency] = React.useState({
    curr: "$"
  });

  React.useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchCurrency();
  }, []);

  var date = moment(item.date, "YYYY/MM/DD");
  var dateFormat = date.format("DD");
  var dayOfWeekFormat = date.format("ddd");

  const handlePress = () => {
    onPress(item);
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <View style={{ borderRadius: 5 }} >
        <View style={{height: 70, flexDirection: "row", justifyContent: "space-between", alignItems:"center"}}>
          <View style={{flexDirection: "row", gap: 20, alignItems: 'center'}}>

            <View style={{ borderRadius: 50, justifyContent: "center", alignItems:"center", marginLeft: 15, flex: 0.20}}>
              <Text variant="titleLarge">
                {dateFormat}
              </Text>
              <Text variant="titleLarge">
                {dayOfWeekFormat}
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text variant="titleLarge" style={{width: 200}} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <Text variant="titleSmall" numberOfLines={2} ellipsizeMode="tail">
                {item.desc === "" ? "No description" : item.desc}
              </Text>
            </View>

            <View style={{alignItems: "center", marginRight: 15, flex: 0.30,}}>
              <Text variant="titleSmall" numberOfLines={1} style={{color: item.type === "Income" ? allColors.successColor : allColors.warningColor}}>
                {item.type === "Income" ? `+${currency.curr}{item.amount}`: `-${currency.curr}{item.amount}`}
              </Text>
              <Text variant="titleSmall" numberOfLines={1}>{item.selectedCard}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>

  );
};

export default Expenses;
