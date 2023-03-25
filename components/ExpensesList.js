import { View, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
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

  const renderItem = ({ item, index }) => (
    // <TouchableOpacity onPress={() => navigation.navigate("PlusMoreHome", {updateItem: item}) }>
    //   <Expenses item={item} index={index}/>
    // </TouchableOpacity>
    <Expenses item={item} index={index} onPress={(item) => navigation.navigate("PlusMoreHome", { updateItem: item })} />
  );


  return (
    <SafeAreaView style={{margin: 20}}>
      <View>
        <Text variant="titleMedium">{heading}</Text>
      </View>
      <View style={{marginBottom: 80}}>
        <FlatList
          data={expensesData}
          renderItem={renderItem} 
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExpensesList;
