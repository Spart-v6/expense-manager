import React, { memo } from "react";
import Expenses from "./Expenses";

const RenderExpenses = ({ item, index, navigation }) => {
  return (
    <Expenses
      item={item}
      index={index}
      onPress={(item) =>
        navigation.navigate("PlusMoreHome", { updateItem: item })
      }
    />
  );
};

export default memo(RenderExpenses);
