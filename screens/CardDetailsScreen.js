import React, { useCallback, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import { useSelector, useDispatch } from "react-redux";
import Feather from 'react-native-vector-icons/Feather';
import DetailedExpenseCard from "../components/DetailedExpenseCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { storeData } from "../redux/actions";

const makeStyles = () => 
  StyleSheet.create({
    listView: {
      padding: 20,
      gap: 20,
    }
});

const CardDetailsScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles();
  const dispatch = useDispatch();
  const [card, setCard] = React.useState({});

  const [loading, setLoading] = React.useState(false);

  // #region Fetching expenses

  useEffect(() => {
    const loadData = async () => {
      const totalIncome = JSON.parse(await AsyncStorage.getItem("TOTAL_INCOME")) || 0;
      const totalExpense = JSON.parse(await AsyncStorage.getItem("TOTAL_EXPENSE")) || 0;
      const totalIncomeForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_INCOME")) || 0;
      const totalExpenseForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_EXPENSE")) || 0;
      const allExpenses = JSON.parse(await AsyncStorage.getItem("ALL_EXPENSES")) || [];
    
      dispatch({
        type: "SET_INITIAL_TOTALS",
        payload: { totalIncome, totalExpense, totalIncomeForMonth, totalExpenseForMonth, allExpenses },
      });
    };
  
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpensesData();
    }, [])
  );

  const fetchExpensesData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const res = await AsyncStorage.getItem("ALL_EXPENSES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeData(newData));
    } catch (e) {}
    finally { setLoading(false) }
  };

  // #endregion

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);
  const filteredArray = expensesData.filter(
    (expense) => expense?.accCardSelected === card?.id
  );

  React.useEffect(() => {
    setCard(route.params.card);
  }, [route.params.card]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={card?.cardHolderName}
        navigation={navigation}
        isUpdateCardScreen={true}
      />
      {
        filteredArray.length > 0 ?
        <View style={{flex : 1}}>
          <DetailedExpenseCard exp={filteredArray} key={Math.random()}/>
        </View>
        :
        <View style={{justifyContent: "center", alignItems: 'center', height: 800, gap: 15}}>
          <Feather name="alert-triangle" size={60} color={allColors.textColorPrimary}/>        
          <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Expenses will appear here once added to this card.</MyText>
        </View>
      }
    </SafeAreaView>
  );
};

export default CardDetailsScreen;
