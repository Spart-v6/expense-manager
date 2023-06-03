import { View, SafeAreaView } from "react-native";
import { Appbar, TextInput, Text, Card } from "react-native-paper";
import formatNumberWithCurrency from "../helper/formatter";
import allColors from "../commons/allColors";
import { useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/Entypo";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { getCurrencyFromStorage } from "../helper/constants";

const DisplayEachExpense = ({ exp }) => {
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

  const formattedDate = moment(exp?.date, "YYYY/MM/DD").format("Do MMMM");
  return (
    <Card style={{ backgroundColor: allColors.backgroundColorLessPrimary, marginTop: 10, marginBottom: 10 }}>
      <Card.Title
        title={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              width: 389,
            }}
          >
            <Text variant="headlineSmall">{exp.name}</Text>
            <Text variant="headlineSmall" numberOfLines={1} ellipsizeMode="tail" style={{maxWidth:200, color: exp.type === "Income" ? allColors.successColor : allColors.warningColor}}>
              {exp.type === "Income"
                ? `+${formatNumberWithCurrency(exp.amount, currency.curr)}`
                : `-${formatNumberWithCurrency(exp.amount, currency.curr)}`}
            </Text>
          </View>
        }
        titleStyle={{ paddingTop: 10 }}
      />
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            variant="bodyMedium"
            style={{ color: allColors.textColorPrimary }}
          >
            {formattedDate}
          </Text>
          {exp.desc !== "" && (
            <>
              <FontAwesome
                name="circle"
                size={7}
                color={"white"}
                style={{ paddingLeft: 5, paddingRight: 5 }}
              />
              <Text variant="bodyMedium">
                {exp.desc}
              </Text>
            </>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const displaySearchedResults = (searchArray, text) => {
  if (text.length > 2 && searchArray(text).length > 0) {
    return searchArray(text)?.map((e) => (
      <DisplayEachExpense exp={e} key={Math.random() * 10}/>
    ));
  }

  if (searchArray(text).length === 0 && text.length === 0) {
    return <Text variant="titleMedium">Type something to see the results</Text>;
  }

  if (searchArray(text).length === 0 && text.length > 2) {
    return (
      <View style={{justifyContent:"center", alignItems:"center"}}>
        <Icon
          name={"block"}
          color={allColors.backgroundColorQuinary}
          size={30}
        />
        <Text variant="titleMedium">Not found</Text>
      </View>
    );
  }
};

const SearchScreen = ({ navigation, route }) => {
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
        />
        <Appbar.Content
          title={
            <TextInput
              label="Search your expenses"
              style={{ backgroundColor: "transparent" }}
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
        />
      </Appbar.Header>
      <View style={searchArray(text).length === 0 ? {justifyContent:"center", alignItems:"center", flex: 1} :{padding: 20}}>
        {displaySearchedResults(searchArray, text)}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
