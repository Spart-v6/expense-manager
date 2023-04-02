import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { FAB, Text, Button, useTheme } from "react-native-paper";
import { HomeHeader, ExpensesList } from "../components";
import {
  getToday,
  getWeekOfTheYear,
  getMonthOfTheYear,
  getCurrentFullYear,
} from "../helper/dateHelper";
import obj from "../helper/dummy";
import { useState, useEffect } from "react";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  selected: {
    backgroundColor: allColors.backgroundColorQuaternary,
    borderRadius: 20,
    text: {
      color: allColors.textColorTertiary,
      fontWeight: 700,
    },
  },
});

const HomeScreen = ({ navigation }) => {
  const [listToShow, setListToShow] = useState(
    <ExpensesList
      heading={getToday().formattedStartDate}
      fromDate={getToday().today}
      toDate={getToday().today}
    />
  );

  const [selectedButton, setSelectedButton] = useState("Daily");

  const handleListButtonPress = (nameOfDate) => {
    setSelectedButton(nameOfDate);
    let heading = "";
    let fromDate = null;
    let toDate = null;
    if (nameOfDate === "Daily") {
      heading = getToday().formattedStartDate;
      fromDate = getToday().today;
      toDate = getToday().today;
    }
    if (nameOfDate === "Weekly") {
      heading = getWeekOfTheYear().currentWeekNum;
      (fromDate = getWeekOfTheYear().fromDate),
        (toDate = getWeekOfTheYear().toDate);
    }
    if (nameOfDate === "Monthly") {
      heading = getMonthOfTheYear().monthName;
      (fromDate = getMonthOfTheYear().fromDate),
        (toDate = getMonthOfTheYear().toDate);
    }
    if (nameOfDate === "Yearly") {
      heading = getCurrentFullYear().year;
      (fromDate = getCurrentFullYear().fromDate),
        (toDate = getCurrentFullYear().toDate);
    }
    if (nameOfDate === "All") {
      heading = "All Expenses";
    }
    setListToShow(
      <ExpensesList heading={heading} fromDate={fromDate} toDate={toDate} />
    );
  };

  const datesNames = [
    { name: "Daily" },
    { name: "Weekly" },
    { name: "Monthly" },
    { name: "Yearly" },
    { name: "All" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader title="Home" isParent={true} navigation={navigation} />
      <ScrollView>
        <AnimatedEntryScreen>
          <HomeHeader />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 10,
                marginLeft: 15,
              }}
            >
              {datesNames.map((date, index) => (
                <Button
                  onPress={() => handleListButtonPress(date.name)}
                  mode="contained"
                  key={index}
                  compact
                  dark
                  buttonColor={allColors.backgroundColorTertiary}
                  style={[
                    styles.btn,
                    selectedButton === date.name && styles.selected,
                  ]}
                >
                  <Text
                    style={selectedButton === date.name && styles.selected.text}
                  >
                    {date.name}
                  </Text>
                </Button>
              ))}
            </View>
            {listToShow}
          </View>
        </AnimatedEntryScreen>
      </ScrollView>
      <FAB
        icon="plus"
        onPress={() => navigation.navigate("PlusMoreHome")}
        mode="flat"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        size="large"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
