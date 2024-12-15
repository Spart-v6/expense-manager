import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Button, Dialog, Portal, Text, TextInput, HelperText, TouchableRipple, ActivityIndicator } from "react-native-paper";
import { ExpensesList } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { deleteData, deleteRecentTransactions, storeCard, storeData } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import { IconComponent } from "../components/IconPickerModal";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import * as Notifications from "expo-notifications";
import useDynamicColors from "../commons/useDynamicColors";
import BigSectionList from "../components/BigSectionList";
import DatePicker from 'react-native-neat-date-picker'
import moment from "moment";

const AppHeaderMemoized = React.memo(AppHeader);

const AllExpensesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const allColors = useDynamicColors();
  // #region =========== Fetching card details here
  useFocusEffect(
    useCallback(() => {
      fetchAllCardsData();
    }, [])
  );

  const fetchAllCardsData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_CARDS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeCard(newData));
    } catch (e) {}
  };
  // #endregion =========== End

  // #region fetching expenses for deletetion purpose
  
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
      const res = await AsyncStorage.getItem("ALL_EXPENSES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeData(newData));
    } catch (e) {}
  };

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);

  

  // #endregion


  // #region selecting range dates for deleting expenses in range
  const [showDatePickerRange, setShowDatePickerRange] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const openDatePickerRange = () => setShowDatePickerRange(true)

  const onCancelRange = () => {
    setShowDatePickerRange(false)
  }

  const onConfirmRange = async (output) => {
    setShowDatePickerRange(false);
    const formattedStartDate = moment(output.startDateString, "ddd MMM DD YYYY HH:mm:ss").format("YYYY/MM/DD");
    const formattedEndDate = moment(output.endDateString, "ddd MMM DD YYYY HH:mm:ss").format("YYYY/MM/DD");
  
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  
    handleSubmit(formattedStartDate, formattedEndDate);
  }

  // #endregion

  const [onDeleteRange, setOnDeleteRange] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);

  const showDialog = () => setOnDeleteRange(true);
  const hideDialog = () => {
    setOnDeleteRange(false);
    setIsSubmitted(false);
  }
  const filterByDateRange = (data, start, end) => {  
    const startDate = moment(start, 'YYYY/MM/DD');
    const endDate = moment(end, 'YYYY/MM/DD');
  
    return data.filter(item => {
      const itemDate = moment(item.date, 'YYYY/MM/DD');
      return itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate); 
    });
  };

  const handleSubmit = async (startDate, endDate) => {
      setIsSubmitted(true);
      const filteredData = filterByDateRange(expensesData, startDate, endDate);
      setIsDeletingInProgress(true);
      for (const obj of filteredData) {
        dispatch(deleteData(obj.id));
        dispatch(deleteRecentTransactions(obj.id));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setIsDeletingInProgress(false);
      hideDialog();
  };
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={allColors.barStyle}
      />
      <AppHeaderMemoized title="All Expenses" navigation={navigation} deleteExpensesInRange={true} setOnDeleteRange={setOnDeleteRange}/>
      <View style={styles.container}>
        <BigSectionList />
      </View>
      <Portal>
        <Dialog visible={onDeleteRange} onDismiss={hideDialog} 
          dismissable={!isDeletingInProgress}
          style={{
            backgroundColor: allColors.backgroundColorLessPrimary,
            width: "80%",
            alignSelf: "center"
          }}
          theme={{
            colors: {
              backdrop: "#00000099",
            },
          }}>
          <Dialog.Title style={{color: allColors.universalColor}}>Delete Expenses on range</Dialog.Title>
          <Dialog.Content >
            {isDeletingInProgress ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={allColors.universalColor}/>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }} >
                  Deleting please wait...
                </MyText>
              </View>
            )
            :
              <>
                <MyText variant="bodyMedium" style={{color: allColors.universalColor}}>
                  You're about to delete expenses in the selected date range. This may take a while—please don't close the app or navigate away until it's done.
                </MyText>
              </>
            }
            </Dialog.Content>
          <Dialog.Actions>
            <TouchableRipple
                onPress={openDatePickerRange}
                rippleColor={allColors.rippleColor}
                centered
                disabled={isDeletingInProgress}
            >
              <View style={[{padding: 10, borderRadius: 10}, isDeletingInProgress ? {backgroundColor: 'grey'} : {backgroundColor: allColors.addBtnColors, }]}>
                <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Start</MyText>
              </View>
            </TouchableRipple>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <DatePicker
          isVisible={showDatePickerRange}
          mode={'range'}
          onCancel={onCancelRange}
          onConfirm={onConfirmRange}
          colorOptions={{
            backgroundColor: allColors.backgroundColorLessPrimary, 
            changeYearModalColor: allColors.selectedDateColor, 
            headerColor: allColors.calendarTopColor,
            weekDaysColor: allColors.selectedDateColor,
            dateTextColor: allColors.universalColor,
            selectedDateBackgroundColor: allColors.textColorFive,
            selectedDateTextColor: allColors.universalColorInverted,
            headerTextColor: allColors.textColorFive,
            confirmButtonColor: allColors.textColorFive
          }}
        />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  loaderContainer: {
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    // width: '100%'
  },
});

export default AllExpensesScreen;
