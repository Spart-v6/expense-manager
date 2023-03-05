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

const List1 = ({ heading, fromDate, toDate }) => {
  const [filteredData, setFilteredData] = useState(obj);

  useEffect(() => {
    const filtered = obj.filter((item) => {
      if(fromDate && toDate){
        const date = item.date;
        return date >= fromDate && date <= toDate;
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
  const [listToShow, setListToShow] = useState(
    <List1
      heading={getToday().formattedStartDate}
      fromDate={getToday().today}
      toDate={getToday().today}
    />
  );

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

  return (
    <View style={{ flex: 1 }}>
      <FocusedStatusBar headerColor={"#14caff"} />
      <HomeHeader />
      <SafeAreaView>
        <ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {datesNames.map((date, index) => (
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
