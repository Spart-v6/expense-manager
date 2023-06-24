import { View, Dimensions } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import React from "react";
import moment from "moment";
import useDynamicColors from "../commons/useDynamicColors";
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";

const Expenses = ({ item, index, onPress }) => {
  const allColors = useDynamicColors();

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

  const [dateFormat] = React.useState(() => {
    return moment(item.date, "YYYY/MM/DD").format("DD");
  })
  const [dayOfWeekFormat] = React.useState(() => {
    return moment(item.date, "YYYY/MM/DD").format("dddd").substring(0,3);
  })

  const handlePress = () => {
    onPress(item);
  }

  return (
    <TouchableRipple onPress={handlePress} rippleColor={allColors.rippleColor} centered>
      <View>
        <View style={{height: 55, flexDirection: "row", justifyContent: "space-between", alignItems:"center",}}>
          <View style={{flexDirection: "row", gap: 20, alignItems: 'center'}}>
            <View style={{ borderRadius: 50, justifyContent: "center", alignItems:"center", marginLeft: 0}}>
              <Text variant="titleMedium" style={{color: allColors.universalColor}}>
                {dateFormat}
              </Text>
              <Text variant="titleMedium" style={{color: allColors.universalColor}}>
                {dayOfWeekFormat}
              </Text>
            </View>

            <View style={{flexDirection: 'column', gap: 2, flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
                <Text style={{fontSize: 20, color: allColors.universalColor,  maxWidth: Dimensions.get("window").width / 2}} numberOfLines={1} ellipsizeMode="tail">
                  {item.name}
                </Text>

                <Text variant="titleSmall" numberOfLines={1} style={{color: item.type === "Income" ? allColors.successColor : allColors.warningColor,  maxWidth: Dimensions.get("window").width / 3, textAlign:"right"}} ellipsizeMode="tail">
                  {item.type === "Income" ? "+" : "-"}{formatNumberWithCurrency(item.amount, currency.curr)}
                </Text>
              </View>
              <View style={{flexDirection: 'row' , justifyContent:"space-between"}}>
                <Text variant="titleSmall" numberOfLines={1} ellipsizeMode="tail" style={{color: allColors.universalColor,  maxWidth: Dimensions.get("window").width / 1.8 }}>
                    {item.desc}
                </Text>
                <Text variant="titleSmall" numberOfLines={1} ellipsizeMode="tail" style={{color: allColors.universalColor, textAlign:"right",  maxWidth: Dimensions.get("window").width / 6}} >
                  {item.selectedCard}
                </Text>

              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

export default Expenses;
