import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Button, Dialog, Portal, TextInput, TouchableRipple } from "react-native-paper";
import { ExpensesList } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { storeCard, storeData } from "../redux/actions";
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
  const allColors = useDynamicColors();
  // #region =========== Fetching card details here
  const dispatch = useDispatch();
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

  const [onDeleteRange, setOnDeleteRange] = useState(false);

  const showDialog = () => setOnDeleteRange(true);
  const hideDialog = () => setOnDeleteRange(false);

  const [open, setOpen] = useState(false);
  const [startSelectedDate, setStartSelectedDate] = useState(moment().date());
  const [startSelectedMonth, setStartSelectedMonth] = useState(moment().format("MMMM"));
  const [startSelectedYear, setStartSelectedYear] = useState(moment().year());

  // const [endSelectedDate, setEndSelectedDate] = useState(moment().date());
  // const [endSelectedMonth, setEndSelectedMonth] = useState(moment().format("MMMM"));
  // const [endSelectedYear, setEndSelectedYear] = useState(moment().year());

  // const [date, setDate] = useState(moment().format("YYYY/MM/DD"));
  // const [formattedDate, setFormattedDate] = useState(moment().format("YYYY/MM/DD"));

  const fetchDates = (obj) => {
    const { selectedDate, selectedMonth, selectedYear } = obj;
    const paddedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
    const month = moment().month(selectedMonth).format("MM");
    const formattedDate = moment(
      `${selectedYear}-${month}-${paddedDate}`
    ).format("YYYY/MM/DD");
    console.log("The formatted date is " + formattedDate);
    // setDate(formattedDate);
    // setFormattedDate(moment(formattedDate, "YYYY/MM/DD").format("DD/MM/YYYY"));
  };


  const dateTextInput = name => {
    // converting date to human-readable format
    const humanReadbleDate = moment(name, "DD/MM/YYYY").format("Do MMM YY");
    return (
      <TouchableRipple
        style={{
          backgroundColor: "transparent",
          flex: 1,
          paddingLeft: 0,
          paddingTop: 12,
          paddingBottom: 12,
        }}
        onPress={() => setOpen(true)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 0 }}>
          <IconComponent
            name={"calendar"}
            category={"MaterialCommunityIcons"}
            size={25}
            color={allColors.addBtnColors}
          />
          <TextInput
            style={{
              backgroundColor: "transparent",
              height: 20,
              width: "100%",
            }}
            contentStyle={{ fontFamily: "Karla_400Regular" }}
            placeholderTextColor={allColors.textColorSecondary}
            disabled
            underlineColor={"transparent"}
            activeUnderlineColor={"transparent"}
            cursorColor={allColors.universalColor}
            placeholder={humanReadbleDate}
            underlineColorAndroid={"red"}
            underlineStyle={{ backgroundColor: "transparent" }}
          />
        </View>
      </TouchableRipple>
    );
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
          <Dialog.Title>Delete Expenses on range</Dialog.Title>
          <Dialog.Content>
            <View style={{flexDirection: 'row', backgroundColor: 'red', justifyContent: "center", alignItems: "center"}}>
              <MyText> Start Date {dateTextInput(date)} </MyText>
              <MyDatePicker 
                open={open}
                setOpen={setOpen}
                fetchDates={fetchDates}
                selectedDate={startSelectedDate}
                selectedMonth={startSelectedMonth}
                selectedYear={startSelectedYear}
                setSelectedDate={setStartSelectedDate}
                setSelectedMonth={setStartSelectedMonth}
                setSelectedYear={setStartSelectedYear}
              />
            </View>
            {/* <View style={{flexDirection: 'row', backgroundColor: 'red', justifyContent: "center", alignItems: "center"}}>
              <MyText> End Date {dateTextInput(date)} </MyText>
              <MyDatePicker 
                open={open}
                setOpen={setOpen}
                fetchDates={fetchDates}
                selectedDate={endSelectedDate}
                selectedMonth={endSelectedMonth}
                selectedYear={endSelectedYear}
                setSelectedDate={setEndSelectedDate}
                setSelectedMonth={setEndSelectedMonth}
                setSelectedYear={setEndSelectedYear}
              />
            </View> */}
  
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
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
