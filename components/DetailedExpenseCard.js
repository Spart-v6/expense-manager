import React, { useCallback } from "react";
import { View, Dimensions, FlatList } from "react-native";
import { Card } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import MyText from "./MyText";
import useDynamicColors from "../commons/useDynamicColors";
import moment from "moment";
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";

const DetailedExpenseCard = ({exp}) => {
  const allColors = useDynamicColors();
  const [currency, setCurrency] = React.useState({
    curr: "$",
  });

  React.useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchCurrency();
  }, []);

  
  const renderItem = useCallback(({ item }) => {
    const formattedDate = moment(item?.date, "YYYY/MM/DD").format("Do MMMM");
    return (
      <View style={{marginBottom: 20}}>
        <Card style={{ backgroundColor: allColors.backgroundColorLessPrimary }}>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <MyText
                variant="headlineSmall"
                style={{
                  color: allColors.universalColor,
                  maxWidth: Dimensions.get("window").width / 2,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </MyText>
              <MyText
                variant="headlineSmall"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  maxWidth: Dimensions.get("window").width / 3,
                  color:
                    item.type === "Income"
                      ? allColors.successColor
                      : allColors.warningColor,
                }}
              >
                {item.type === "Income" ? "+" : "-"}
                {formatNumberWithCurrency(item.amount, currency.curr)}
              </MyText>
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <MyText
                variant="bodyMedium"
                style={{ color: allColors.textColorPrimary }}
              >
                {formattedDate}
              </MyText>
              {item.desc !== "" && (
                <>
                  <MyText
                    variant="bodyMedium"
                    style={{
                      color: allColors.universalColor,
                      maxWidth: Dimensions.get("window").width / 1,
                    }}
                    numberOfLines={5}
                    ellipsizeMode="tail"
                  >
                    {item.desc}
                  </MyText>
                </>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }, [currency]);

  return (
    <FlashList
      data={exp}
      estimatedItemSize={70}
      keyExtractor={(item, index) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{padding: 20}}
    />
  );
};

export default DetailedExpenseCard;
