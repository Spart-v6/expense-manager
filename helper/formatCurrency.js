import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import IconComponent from "../components/IconComponent"; 
import currencyObj from "./currencyObj";

export const formatCurrency = (
  amount,
  selectedCurrencyId,
  theme,
  options = {}
) => {
  const { showSign = true, textVariant = "bodyMedium", iconSize = 18 } = options;

  const selectedCurrency =
    currencyObj.find((c) => c.id === selectedCurrencyId) || currencyObj[0];

  // console.log("selectedCurrency", selectedCurrency);

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale || "en-IN"; // gets device locale, to use formatting of numbers based on countries

  const formattedAmount = new Intl.NumberFormat(deviceLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  // const sign = showSign ? (isNegative ? "-" : amount > 0 ? "+" : "") : ""; // if needed to show + sign for positive amounts (not required annyways)

  return (
    <View style={{ flexDirection: "row", alignItems: "baseline",  }}>
      {showSign && isNegative && (
        <Text variant={textVariant} style={{ marginRight: 2 }}>
          -
        </Text>
      )}

      <IconComponent
        iconSet={"FontAwesome5"}
        iconName={"rupee-sign"}
        backgroundColor="transparent"
        color={theme.dark.onSurface}
        size={iconSize}
        style={{ marginRight: 1 }}
      />

      <Text variant={textVariant}>{formattedAmount}</Text>
    </View>
  );
};
