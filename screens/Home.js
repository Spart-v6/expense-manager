import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { FocusedStatusBar, HomeHeader, Expenses } from "../components";
import obj from "./dummy";
import {
  getToday,
  getWeekOfTheYear,
  getMonthOfTheYear,
  getCurrentFullYear,
} from "../helper";
import moment from "moment";
import { useTheme } from 'react-native-paper';

const List1 = ({ heading, fromDate, toDate }) => {
  const [filteredData, setFilteredData] = useState(obj);

  useEffect(() => {
    const filtered = obj.filter((item) => {
      if(fromDate && toDate){
        const date = moment(item.date, "DD/MM/YYYY");
        const from = moment(fromDate, "DD/MM/YYYY");
        const to = moment(toDate, "DD/MM/YYYY");
        return date.isSameOrAfter(from) && date.isSameOrBefore(to);
      }
      return true;
    });
    setFilteredData(filtered);
  }, [heading]);

  return (
    <>
      <View style={{ backgroundColor: "green" }}>
        <Text>{heading}</Text>
        <Text>==========</Text>
        <Text>{fromDate}</Text>
        <Text>==========</Text>
        <Text>{toDate}</Text>
      </View>
      <>
        <FlatList
          data={filteredData}
          renderItem={({ item }) => <Expenses item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ backgroundColor: "blue" }}
          scrollEnabled={false}
        />
      </>
    </>
  );
};

const Home = () => {
  const theme = useTheme();
  const [listToShow, setListToShow] = useState(
    <List1
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
    if(nameOfDate === "All"){
      heading = "All Expenses";
    }
    setListToShow(
      <List1 heading={heading} fromDate={fromDate} toDate={toDate} />
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
    const newIncomeArray = obj.filter(item => item.type === 'income').map(item => item.amount);
    const newExpenseArray = obj.filter(item => item.type === 'expense').map(item => item.amount);

    setIncomeArray(newIncomeArray);
    setExpenseArray(newExpenseArray);
  }, [obj]);

  return (
    <View style={{ flex: 1 }}>
      <FocusedStatusBar headerColor={theme.colors.primary} />
      <HomeHeader incomeArray={incomeArray} expenseArray={expenseArray}/>
      <SafeAreaView>
        <ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {datesNames.map(date => (
              <TouchableOpacity
                onPress={() => handleListButtonPress(date.name)}
              >
                <Text>{date.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {listToShow}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Home;
