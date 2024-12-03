import React, { useEffect, useCallback } from "react";
import { View, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "../components/MyText";
import Expenses from "./Expenses";
import { useSelector, useDispatch } from "react-redux";
import { addData, addRecentTransactions, storeRecurrences, updateRecurrences } from "../redux/actions";
import { storeRecentTransactions } from "../redux/actions";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

const Separator = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#80808029",
        width: Dimensions.get("screen").width * 0.8,
        alignSelf: "center",
      }}
    />
  );
}

const RecentTransaction = () => {
  const allColors = useDynamicColors();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      fetchRecentExpensesData();
    }, [])
  );

  const fetchRecentExpensesData = async () => {
    try {
      const res = await AsyncStorage.getItem("RECENT_TRANSACTIONS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeRecentTransactions(newData));
    } catch (e) {}
  };

  const recentData = useSelector(state => state.recentTransactionsReducer.recentTransactions);

  const renderItem = ({ item, index }) => {
    return (
      <Expenses
        item={item}
        index={index}
        onPress={(item) =>
          navigation.navigate("PlusMoreHome", { updateItem: item })
      }
    />
    );
  };

  // #region checking and adding recurrence expenses in home screen
  useFocusEffect(
    useCallback(() => {
      fetchRecurrencesData();
    }, [])
  );

  const fetchRecurrencesData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_RECURRENCES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeRecurrences(newData));
    } catch (e) {}
  };

  const recurrencesData = useSelector(
    (state) => state.recurrenceReducer.allRecurrences
  );

  const addRecurringExpenses = useCallback(() => {
    const expense = [];

    const currentDate = moment().format("DD MM YY");
    recurrencesData.forEach((obj) => {
      const { recurrenceStartDate, frequency } = obj;
      const frequencyDays = {
        Daily: 1,
        Weekly: 7,
        Monthly: 30,
        Yearly: 365,
      };
      const daysToAdd = frequencyDays[frequency];
      
      const futureDate = moment(recurrenceStartDate, "DD MM YY")
        .add(daysToAdd, "days")
        .format("DD MM YY");
  
      if (moment(futureDate, "DD MM YY").isSameOrBefore(moment(currentDate, "DD MM YY"))) {
        const numOccurrences = Math.floor(moment(currentDate, "DD MM YY").diff(moment(recurrenceStartDate, "DD MM YY"), "days") / daysToAdd);
  
        for (let i = 0; i < numOccurrences; i++) {
          const newObj = {
            ...obj,
            recurrenceStartDate: moment(recurrenceStartDate, "DD MM YY")
              .add(daysToAdd * (i + 1), "days")
              .format("DD MM YY"),
          };
          expense.push(newObj);
        }

        const updatedRecurrenceStartDate = moment(recurrenceStartDate, "DD MM YY")
          .add(numOccurrences * daysToAdd, "days")
          .format("DD MM YY");
        dispatch(updateRecurrences(obj.id, updatedRecurrenceStartDate));
      } else {
        if (futureDate === currentDate) {
          expense.push(obj);
        }
      }
    });
    const updatedExpenses = expense.map(ex => {
      const { recurrenceAmount, recurrenceName, recurrenceStartDate, paymentNetwork, paymentType, time, accCardSelected, recurrenceType } = ex;
    
      return {
        amount: recurrenceAmount,
        desc: recurrenceType,
        id: Math.random() * 10,
        date: moment(recurrenceStartDate, "DD MM YY").format("YYYY/MM/DD"),
        name: recurrenceName,
        selectedCard: paymentNetwork,
        selectedCategory: { iconCategory: "FontAwesome", iconName: "repeat" },
        time: time,
        type: paymentType,
        accCardSelected
      };
    });
    if (updatedExpenses.length > 0) {
      dispatch(addData(updatedExpenses));
      dispatch(addRecentTransactions(updatedExpenses));
    }
  }, [recurrencesData, dispatch]);

  useEffect(() => {
    addRecurringExpenses();
  }, [addRecurringExpenses]);
  // #endregion

  return (
    <View style={recentData.length > 0 && {marginBottom: 60}}>
      {
        recentData.length > 0 ? (
          <FlashList
            scrollEnabled={false}
            data={recentData}
            keyExtractor={(item, index) => item.id + index}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            estimatedItemSize={100}
          />
        )
        :
        (
          <View style={[{justifyContent: "center", gap: 10, alignItems: 'center', height: Dimensions.get("screen").height * 0.45}, recentData.length > 0 && {marginBottom: 100}]}>
            <SimpleLineIcons name="plus" size={50} color={allColors.textColorPrimary} onPress={() => navigation.navigate("PlusMoreHome")}/>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Your recent transactions will be shown here.</MyText>
              <MyText variant="bodySmall" style={{color: allColors.universalColor}}>
                Click on "+" button to start adding expenses
              </MyText>
            </View>
          </View> 
        )
      }
    </View>
  )
}

export default RecentTransaction