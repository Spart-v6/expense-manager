import { View, SafeAreaView, ScrollView, Dimensions } from "react-native";
import { Appbar, TextInput } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import React from "react";
import MyText from "../components/MyText";
import DetailedExpenseCard from "../components/DetailedExpenseCard";

const displaySearchedResults = (searchArray, text) => {
  const allColors = useDynamicColors();
  if (text.length > 2 && searchArray(text).length > 0) {
    return (
      <DetailedExpenseCard exp={searchArray(text)} key={Math.random() * 10}/>
    );
  }

  if (searchArray(text).length === 0 && text.length === 0) {
    return (
      <View style={{justifyContent:"center", alignItems:"center",height: Dimensions.get("screen").height / 1.2}}>
        <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Type something to see the results</MyText>
      </View>
    );
  }

  if (searchArray(text).length === 0 && text.length > 2) {
    return (
      <View style={{justifyContent:"center", alignItems:"center", gap: 10, height: Dimensions.get("screen").height / 1.2}}>
        <Icon
          name={"block"}
          color={allColors.universalColor}
          size={30}
        />
        <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Not found</MyText>
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
              label={<MyText style={{color: allColors.universalColor}}>{"Search your expenses"}</MyText>}
              style={{ backgroundColor: "transparent" }}
              textColor={allColors.universalColor}
              selectionColor={allColors.textSelectionColor}
              value={text}
              underlineColor={allColors.backgroundColorQuaternary}
              activeUnderlineColor={allColors.backgroundColorQuaternary}
              contentStyle={{fontFamily: "Rubik_400Regular"}}
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
        <View style={searchArray(text).length === 0 ? {justifyContent:"center", alignItems:"center", flex: 1} :{gap: 20, flex: 1}}>
          {displaySearchedResults(searchArray, text)}
        </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
