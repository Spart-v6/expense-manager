import { View, SafeAreaView } from "react-native";
import { Appbar, TextInput, Text, Card } from "react-native-paper";
import formatNumberWithCurrency from "../helper/formatter";
import useDynamicColors from "../commons/useDynamicColors";
import { useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/Entypo";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { getCurrencyFromStorage } from "../helper/constants";
import * as Notifications from "expo-notifications";
import DetailedExpenseCard from "../components/DetailedExpenseCard";

const displaySearchedResults = (searchArray, text) => {
  const allColors = useDynamicColors();
  if (text.length > 2 && searchArray(text).length > 0) {
    return searchArray(text)?.map((e) => (
      <DetailedExpenseCard exp={e} key={Math.random() * 10}/>
    ));
  }

  if (searchArray(text).length === 0 && text.length === 0) {
    return <Text variant="titleMedium" style={{color: allColors.universalColor}}>Type something to see the results</Text>;
  }

  if (searchArray(text).length === 0 && text.length > 2) {
    return (
      <View style={{justifyContent:"center", alignItems:"center", gap: 10}}>
        <Icon
          name={"block"}
          color={allColors.universalColor}
          size={30}
        />
        <Text variant="titleMedium" style={{color: allColors.universalColor}}>Not found</Text>
      </View>
    );
  }
};

const SearchScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const allExpenses = useSelector((state) => state.expenseReducer.allExpenses);
  const [text, setText] = React.useState("");

  function searchArray(keyword) {
    if (keyword === "") return [];
    keyword = keyword.trim().toLowerCase();
    const filteredData = allExpenses.filter((obj) => {
      const values = Object.values(obj).join("").toLowerCase();
      return values.includes(keyword.toLowerCase());
    });
    return filteredData;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header
        style={{ backgroundColor: allColors.backgroundColorPrimary }}
      >
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={() => navigation.goBack()}
          color={allColors.universalColor}
        />
        <Appbar.Content
          title={
            <TextInput
              label={<Text style={{color: allColors.universalColor}}>{"Search your expenses"}</Text>}
              style={{ backgroundColor: "transparent" }}
              textColor={allColors.universalColor}
              selectionColor={allColors.textSelectionColor} // TODO: add selection color to all selected items
              value={text}
              underlineColor={allColors.backgroundColorQuaternary}
              activeUnderlineColor={allColors.backgroundColorQuaternary}
              onChangeText={setText}
              autoFocus
            />
          }
        />
        <Appbar.Action
          icon="close"
          onPress={() => {
            setText("");
          }}
          color={allColors.universalColor}
        />
      </Appbar.Header>
      <View style={searchArray(text).length === 0 ? {justifyContent:"center", alignItems:"center", flex: 1} :{padding: 20, gap: 20}}>
        {displaySearchedResults(searchArray, text)}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
