import { View, Dimensions } from "react-native";
import { TouchableRipple } from "react-native-paper";
import React from "react";
import moment from "moment";
import MyText from "../components/MyText";
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
      <>
        <View style={{height: 55, flexDirection: "row", justifyContent: "space-between", alignItems:"center",}}>
          <View style={{flexDirection: "row", gap: 15, alignItems: 'center'}}>
            <View style={{ justifyContent: "center", alignItems:"center", marginLeft: 0}}>
              <MyText variant="titleMedium" style={{color: allColors.universalColor}}>
                {dateFormat}
              </MyText>
              <MyText variant="titleMedium" style={{color: allColors.universalColor, width: Dimensions.get("screen").width * 0.1, textAlign: "center"}}>
                {dayOfWeekFormat}
              </MyText>
            </View>

            <View style={{flexDirection: 'column', gap: 2, flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: "space-between", gap: 15}}>
                <MyText style={{flex: 1, fontSize: 20, color: allColors.universalColor,  flexShrink: 1}} numberOfLines={1} ellipsizeMode="tail">
                  {item.name}
                </MyText>

                <MyText variant="titleSmall" numberOfLines={1} style={{color: item.type === "Income" ? allColors.successColor : allColors.warningColor,  maxWidth: Dimensions.get("window").width / 3, textAlign:"right"}} ellipsizeMode="tail">
                  {item.type === "Income" ? "+" : "-"}{formatNumberWithCurrency(item.amount, currency.curr)}
                </MyText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: "space-between"}}>
                <View style={{ flex: 1 }}>
                  {item.desc?.length > 1 && (
                    <MyText
                      variant="titleSmall"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ color: allColors.universalColor, maxWidth: Dimensions.get("window").width / 1.7 }}
                    >
                      {item.desc}
                    </MyText>
                  )}
                </View>
                <View style={{ maxWidth: Dimensions.get("window").width / 4 }}>
                  <MyText
                    variant="titleSmall"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ color: allColors.universalColor, textAlign: "right", paddingLeft: 9 }}
                  >
                    {item.selectedCard}
                  </MyText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </>
    </TouchableRipple>
  );
};

export default Expenses;
