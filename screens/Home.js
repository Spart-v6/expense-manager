import { View, SafeAreaView, FlatList, Text, TouchableOpacity  } from "react-native";
import { useState } from "react";
import { FocusedStatusBar, HomeHeader, Expenses } from "../components";
import { obj } from "./dummy";
import { getToday, getWeekOfTheYear, getMonthOfTheYear, getCurrentFullYear, formattedStartDate } from "../helper";

const data = [
  {
    name: "sdsadsad",
  },
  {
    name: "123213123",
  },
  {
    name: "sdsafhfghgfhdsad",
  },
  {
    name: "zzzzzzzzz",
  }
]


const List1 = ({ heading, fromDate, toDate }) => {
  return (
    <View>
      <Text>This is list 1</Text>
      <Text>{heading}</Text>
      <Text>==========</Text>
      <Text>{fromDate}</Text>
      <Text>==========</Text>
      <Text>{toDate}</Text>
      {/* {items.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))} */}
    </View>
  );
};

const Home = () => {
  const [listToShow, setListToShow] = useState(
      <List1 heading={formattedStartDate()} fromDate={getToday()} toDate={getToday()} />
    )

  const handleListButtonPress = (nameOfDate) => {
    let heading = "";
    let fromDate = null;
    let toDate = null;
    if(nameOfDate === "Daily") {
      heading = formattedStartDate();
      fromDate = getToday();
      toDate = getToday();
    }
    if(nameOfDate === "Weekly") {
      heading = getWeekOfTheYear().currentWeekNum;
      fromDate = getWeekOfTheYear().fromDate,
      toDate = getWeekOfTheYear().toDate
    }
    if(nameOfDate === "Monthly") {
      heading = getMonthOfTheYear().monthName;
      fromDate = getMonthOfTheYear().fromDate,
      toDate = getMonthOfTheYear().toDate
    }
    if(nameOfDate === "Yearly") {
      heading = getCurrentFullYear().year;
      fromDate = getCurrentFullYear().fromDate,
      toDate = getCurrentFullYear().toDate
    }
    setListToShow(<List1 heading={heading} fromDate={fromDate} toDate={toDate}/>);
  };

  const datesNames = [
    {name: "Daily"},
    {name: "Weekly"},
    {name: "Monthly"},
    {name: "Yearly"},
    {name: "All"}
  ]


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar headerColor={"#14caff"} />
      <HomeHeader/>
        <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {
            datesNames.map((date, index) => (
              <TouchableOpacity onPress={() => handleListButtonPress(date.name)}>
                <Text>{date.name}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
        {listToShow}
      </View>
      <View style={{ flex: 1}}>
        <View style={{ zIndex: 0}}>
            <FlatList 
              data={data}
              renderItem={({item}) => <Expenses item={item}/>}
              showsVerticalScrollIndicator={false}
            />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
