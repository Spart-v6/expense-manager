import React from "react";
import { View, Dimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import moment from "moment";
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";
import * as Notifications from "expo-notifications";

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

  const formattedDate = moment(exp?.date, "YYYY/MM/DD").format("Do MMMM");

  // #region going to scr thru notifications
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const nextScreen =
          response.notification.request.content.data.headToThisScreen;
        navigation.navigate(nextScreen);
      }
    );
    return () => subscription.remove();
  }, []);
  // #endregion

  return (
    <Card style={{ backgroundColor: allColors.backgroundColorLessPrimary }}>
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // width: 389,
          }}
        >
          <Text
            variant="headlineSmall"
            style={{ color: allColors.universalColor, maxWidth:  Dimensions.get("window").width / 2 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {exp.name}
          </Text>
          <Text
            variant="headlineSmall"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              maxWidth: Dimensions.get("window").width / 3,
              color:
                exp.type === "Income"
                  ? allColors.successColor
                  : allColors.warningColor,
            }}
          >
            {exp.type === "Income" ? "+" : "-"}
            {formatNumberWithCurrency(exp.amount, currency.curr)}
          </Text>
        </View>
        <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <Text
            variant="bodyMedium"
            style={{ color: allColors.textColorPrimary }}
          >
            {formattedDate}
          </Text>
          {exp.desc !== "" && (
            <>
              <Text
                variant="bodyMedium"
                style={{ color: allColors.universalColor, maxWidth: Dimensions.get("window").width / 1 }}
                numberOfLines={5}
                ellipsizeMode="tail"
              >
                {exp.desc}
              </Text>
            </>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default DetailedExpenseCard;
