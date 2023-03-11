import { View, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import obj from "../helper/dummy";
import moment from "moment";
import Expenses from "./Expenses";
import { useSelector, useDispatch } from "react-redux";
import { storeData } from "../redux/actions";

const ExpensesList = ({ heading, fromDate, toDate }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  const expensesData = useSelector(state => state.expenseReducer.allExpenses);

  useFocusEffect(
    useCallback(() => {
      fetchExpensesData();
    }, [])
  );

  const fetchExpensesData = async () => {
    try{
      const res = await AsyncStorage.getItem("ALL_EXPENSES");
      let newData = JSON.parse(res);
      if(newData !== null) dispatch(storeData(newData));
    }
    catch(e) {
      console.log("error: ", e);
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("PlusMoreHome", {updateItem: item}) }>
      <Expenses item={item} />
    </TouchableOpacity>
  );


  return (
    <>
      <View style={{ backgroundColor: "green" }}>
        <Text>{heading}</Text>
        <Text>==========</Text>
        <Text>{fromDate}</Text>
        <Text>==========</Text>
        <Text>{toDate}</Text>
      </View>
      <View style={{marginBottom: 80}}>
        <FlatList
          data={expensesData}
          renderItem={renderItem} 
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ backgroundColor: "blue" }}
          scrollEnabled={false}
        />
      </View>
    </>
  );
};

export default ExpensesList;
