import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FocusedStatusBar, HomeHeader, ExpensesList } from "../components";
import {
  getToday,
  getWeekOfTheYear,
  getMonthOfTheYear,
  getCurrentFullYear,
} from "../helper/dateHelper";
import obj from "../helper/dummy";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addData } from "../redux/actions";
import AppHeader from "../components/AppHeader";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Home" isParent={true} navigation={navigation}/>
      <View>
        <Text>Home screen</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("PlusMoreHome")}>
        <Text>Add or update expense</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

/*
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [listToShow, setListToShow] = useState(
    <ExpensesList
      heading={getToday().formattedStartDate}
      fromDate={getToday().today}
      toDate={getToday().today}
    />
  );

  const [incomeArray, setIncomeArray] = useState([]);
  const [expenseArray, setExpenseArray] = useState([]);

  const handleListButtonPress = (nameOfDate) => {
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

  useEffect(() => {
    const newIncomeArray = obj
      .filter((item) => item.type === "income")
      .map((item) => item.amount);
    const newExpenseArray = obj
      .filter((item) => item.type === "expense")
      .map((item) => item.amount);

    setIncomeArray(newIncomeArray);
    setExpenseArray(newExpenseArray);
  }, [obj]);

  // dispatch(addData("Hii!!"));
*/
