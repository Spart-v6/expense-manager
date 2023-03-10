import { View, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { useState, useEffect } from "react";
import obj from "../helper/dummy";
import moment from "moment";
import Expenses from "./Expenses";
import { useSelector } from "react-redux";

const ExpensesList = ({ heading, fromDate, toDate }) => {
  const [filteredData, setFilteredData] = useState(obj);

  useEffect(() => {
    const filtered = obj.filter((item) => {
      if (fromDate && toDate) {
        const date = moment(item.date, "DD/MM/YYYY");
        const from = moment(fromDate, "DD/MM/YYYY");
        const to = moment(toDate, "DD/MM/YYYY");
        return date.isSameOrAfter(from) && date.isSameOrBefore(to);
      }
      return true;
    });
    setFilteredData(filtered);
  }, [heading]);

  const expensesData = useSelector(state => state.expenseReducer.expenses);

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
          data={expensesData}
          renderItem={({ item }) => <Expenses item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ backgroundColor: "blue" }}
          scrollEnabled={false}
        />
      </>
    </>
  );
};

export default ExpensesList;
