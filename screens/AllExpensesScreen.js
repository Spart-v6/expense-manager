import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Button, Dialog, Portal, Text, TextInput, HelperText, TouchableRipple } from "react-native-paper";
import { ExpensesList } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
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
import MyDatePicker from "../components/DatePicker";
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


  const [onDeleteRange, setOnDeleteRange] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showDialog = () => setOnDeleteRange(true);
  const hideDialog = () => {
    setOnDeleteRange(false);
    setIsSubmitted(false);
  }

  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const validateDate = (date) => {
    const dateRegex = /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/;
    
    if (!dateRegex.test(date)) return false;

    const [year, month, day] = date.split('/').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  };

  const filterByDateRange = (data, startDate, endDate) => {
    const start = moment(startDate, 'YYYY/MM/DD');
    const end = moment(endDate, 'YYYY/MM/DD');

    return data.filter(item => {
      const itemDate = moment(item.date, 'YYYY/MM/DD');
      return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end); 
    });
  };
  

  const hasErrors = () => {
    return isSubmitted && !validateDate(startDate) && !validateDate(endDate);
  };


  const textInput = (label, setter, placeholder) => {

    return (
      <View>
        <TextInput
          label={
            <MyText style={{ color: allColors.universalColor }}>
              {label}
            </MyText>
          }
          style={{
            width: 120,
            backgroundColor: 'transparent',
          }}
          selectionColor={allColors.textSelectionColor}
          textColor={allColors.universalColor}
          underlineColor={allColors.textColorPrimary}
          cursorColor={allColors.universalColor}
          activeUnderlineColor={allColors.textColorPrimary}
          contentStyle={{ fontFamily: "Karla_400Regular" }}
          placeholderTextColor={allColors.placeholderTextColor}
          autoComplete="off"
          textContentType="none"
          placeholder={placeholder}
          onChangeText={(val) => setter(val)}
          keyboardType={"default"}
        />
      </View>
    );
  };

  const handleSubmit = () => {
    setIsSubmitted(true); 
    if (validateDate(startDate) && validateDate(endDate)) {
      const filteredData = filterByDateRange(expensesData, startDate, endDate);
      for (const obj of filteredData) { dispatch(deleteData(obj.id)); dispatch(deleteRecentTransactions(obj.id)); }
      hideDialog();
    }
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
            <View style={{flexDirection: 'row', gap: 30}}>
              {textInput("Start Date", setStartDate, "YYYY/MM/DD")}
              {textInput("End Date", setEndDate, "YYYY/MM/DD")}
            </View>
            <HelperText type="error" visible={hasErrors()} variant="labelMedium" style={{color: allColors.warningColor}}>
              Invalid format! Use YYYY/MM/DD and ensure valid month, day and year
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableRipple
                onPress={handleSubmit}
                rippleColor={allColors.rippleColor}
                centered
            >
              <View style={{padding: 10, backgroundColor: allColors.addBtnColors, borderRadius: 10 }}>
                <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Delete</MyText>
              </View>
            </TouchableRipple>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});

export default AllExpensesScreen;
