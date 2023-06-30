import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { ExpensesList } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { storeCard } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import { IconComponent } from "../components/IconPickerModal";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import * as Notifications from "expo-notifications";
import useDynamicColors from "../commons/useDynamicColors";

const makeStyles = (allColors) =>
  StyleSheet.create({
    btn: {
      borderRadius: 10,
      paddingLeft: 5,
      paddingRight: 5,
    },
    selected: {
      backgroundColor: allColors.backgroundColorDatesSelected,
      borderRadius: 20,
      text: {
        color: allColors.textColorPrimary,
        fontFamily: "Rubik_500Medium",
      },
    },
    notSelected: {
      color: allColors.textColorSecondary,
    },
  });

const ButtonMemoized = React.memo(({ onPress, isSelected, name }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  return (
    <Button
      onPress={onPress}
      compact
      buttonColor={allColors.backgroundColorDates}
      style={[styles.btn, isSelected && styles.selected]}
    >
      <MyText style={[styles.notSelected, isSelected && styles.selected.text]}>
        {name}
      </MyText>
    </Button>
  );
});

const AppHeaderMemoized = React.memo(AppHeader);

const AllExpensesScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  // #region =========== Fetching card details here
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      fetchAllCardsData();
    }, [])
  );

  const fetchAllCardsData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_CARDS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeCard(newData));
    } catch (e) {}
  };
  // #endregion =========== End

  const [selectedButton, setSelectedButton] = useState("Daily");

  const handleListButtonPress = useCallback((nameOfDate) => {
    setSelectedButton(nameOfDate);
  }, []);

  const datesNames = [
    { name: "Daily" },
    { name: "Weekly" },
    { name: "Monthly" },
    { name: "Yearly" },
    { name: "All" },
  ];

  let listToShow;
  if (selectedButton === "Daily") {
    listToShow = <ExpensesList filter="Daily" />;
  } else if (selectedButton === "Weekly") {
    listToShow = <ExpensesList filter="Weekly" />;
  } else if (selectedButton === "Monthly") {
    listToShow = <ExpensesList filter="Monthly" />;
  } else if (selectedButton === "Yearly") {
    listToShow = <ExpensesList filter="Yearly" />;
  } else {
    listToShow = <ExpensesList filter="All" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={allColors.barStyle}
      />
      <AppHeaderMemoized title="All Expenses" navigation={navigation} />
      <View>
        <ScrollView
          style={{
            marginLeft: 15,
            marginRight: 15,
          }}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-start",
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {datesNames.map((date, index) => (
            <ButtonMemoized
              key={index}
              onPress={() => handleListButtonPress(date.name)}
              isSelected={selectedButton === date.name}
              name={date.name}
            />
          ))}
        </ScrollView>
        {listToShow}
      </View>
    </SafeAreaView>
  );
};

export default AllExpensesScreen;
