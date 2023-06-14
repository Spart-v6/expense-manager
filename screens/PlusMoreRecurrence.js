import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";
import { Portal, TextInput, Text, Dialog, Button, TouchableRipple, Menu, List } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import AppHeader from "../components/AppHeader";
import moment from "moment";
import allColors from "../commons/allColors";
import Chip from "../components/Chip";
import { IconComponent } from "../components/IconPickerModal";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { addRecurrences, storeCard, addNewRecurrType, storeRecurrType } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import SnackbarComponent from "../commons/snackbar";
import MyDatePicker from "../components/DatePicker";

const datesObj = [
  { id: 0, text: "Daily" },
  { id: 1, text: "Weekly" },
  { id: 2, text: "Monthly" },
  { id: 3, text: "Yearly" },
];

const typeOfPayment = [
  { id: 0, name: "Income", type: "+" },
  { id: 1, name: "Expense", type: "-" }
]

const styles = StyleSheet.create({
  commonStyles: {
    gap: 5,
    marginTop: 20,
  },
  commonTouchableStyle: {
    marginRight: 20,
  },
  moreCardStyle: {
    padding: 20,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: allColors.backgroundColorLessPrimary,
    height: 100,
    width: 125,
  },
  highlightedCardStyle: {
    backgroundColor: allColors.backgroundColorSecondary,
    color: allColors.textColorPrimary,
  },
  monthAndYearInput: {
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: allColors.backgroundColorQuinary,
  },
});

const PlusMoreRecurrence = ({ navigation }) => {
  const dispatch = useDispatch();

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Please fill all the fields");
  const timeoutRef = useRef(null);

  const [selectedCardInExpense, setSelectedCardInExpense] = useState(null);

  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = useState(false);
  const [clickedIndex, setClickedIndex] = React.useState(null);
  const [chipName, setChipName] = useState("");
  const [needRepeat, setNeedRepeat] = React.useState(false);
  const [typePayment, setTypePayment] = useState("Income");
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [addNewRecurrenceName, setAddNewRecurrenceName] = useState("");
  const [openNewRecurrence, setOpenNewRecurrence] = useState(false);

  const [recName, setRecName] = useState("");
  const [amount, setAmount] = useState("");

  const [visible, setVisible] = React.useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("+");
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // #region cards stuff
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
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // #endregion =========== End

  const cardsData = useSelector((state) => state.cardReducer.allCards);

  const handleChipPress = (index, text) => {
    setClickedIndex(index);
    setChipName(text);
  };

  const handlePress = (e) => {
    setSelectedCardInExpense(e.paymentNetwork);
  };

  const handlePaymentSelection = payment => {
    setTypePayment(payment.name); 
    setSelectedPaymentType(payment.type);
    closeMenu()
  }
  const commonText = (name, setter, placeholder) => (
    <View style={placeholder === "Amount" &&{flexDirection: 'row',
        borderRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderColor: "black",
        borderWidth: 2,
        backgroundColor: allColors.backgroundColorQuinary,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        {placeholder === "Amount" &&
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button onPress={openMenu} style={{justifyContent: 'center', alignItems: 'center', padding: 7}}>
              <Text variant="titleLarge" style={{color: allColors.textColorTertiary, textAlign:'center'}}> {selectedPaymentType} </Text>
            </Button>
          }
          contentStyle={{backgroundColor: allColors.backgroundColorLessPrimary}}
        >
          {typeOfPayment.map(payment => (
            <List.Item key={payment.id} onPress={() => handlePaymentSelection(payment)} title={payment.type} titleStyle={{textAlign: 'center'}} style={{width: 70}}/>
          ))}
        </Menu>
      }
      <TextInput
        style={[{
          borderRadius: 15,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          backgroundColor: allColors.backgroundColorQuinary
        }, placeholder === "Amount" && {backgroundColor: 'transparent',flex: 1}]}
        selectionColor={allColors.textColorFour}
        textColor={allColors.textColorFour}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        placeholderTextColor={allColors.textColorFour}
        autoComplete="off"
        textContentType="none"
        value={name}
        placeholder={placeholder}
        onChangeText={(val) => setter(val)}
        keyboardType={placeholder === "Amount" ? "phone-pad" : "default"}
      />
    </View>
  );

  // #region New dates stuff
  const [selectedStartMonth, setSelectedStartMonth] = useState(moment().format("MMMM"));
  const [selectedStartYear, setSelectedStartYear] = useState(moment().format("YYYY"))
  const [selectedStartDate, setSelectedStartDate] = useState(moment().date());

  const [selectedEndMonth, setSelectedEndMonth] = useState(moment().format("MMMM"));
  const [selectedEndYear, setSelectedEndYear] = useState(moment().format("YYYY"))
  const [selectedEndDate, setSelectedEndDate] = useState(moment().date());

  const [newStartDate, setNewStartDate] = useState(moment().format('YYYY/MM/DD'));
  const [newEndDate, setNewEndDate] = useState(null);

  const [newStartDatePh, setNewStartDatePh] = useState(moment().format('DD/MM/YYYY'));
  const [newEndDatePh, setNewEndDatePh] = useState(null);

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleNewDatePress = title => {
    if (title === "Ending Date") setEndDateOpen(true);
    else setStartDateOpen(true);
  }

  const fetchEndDates = (obj) => {
    const { selectedDate, selectedMonth, selectedYear } = obj;
    const paddedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
    const month = moment().month(selectedMonth).format('MM');
    const formattedDate = moment(`${selectedYear}-${month}-${paddedDate}`).format('YYYY/MM/DD');
    setNewEndDate(formattedDate);
    setNewEndDatePh(moment(formattedDate, "YYYY/MM/DD").format("DD/MM/YYYY"));
  }
  const fetchStartDates = (obj) => {
    const { selectedDate, selectedMonth, selectedYear } = obj;
    const paddedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
    const month = moment().month(selectedMonth).format('MM');
    const formattedDate = moment(`${selectedYear}-${month}-${paddedDate}`).format('YYYY/MM/DD');
    setNewStartDate(formattedDate);
    setNewStartDatePh(moment(formattedDate, "YYYY/MM/DD").format("DD/MM/YYYY"));
  }

  const dateInput = title => (
    <View
      style={{
        flexDirection: "column",
        flex: 0.5,
        justifyContent: "center",
        gap: 5,
      }}
    >
      <Text variant="titleSmall">
        {title === "Ending Date" ? title + `  (optional)` : title}
      </Text>
      <TouchableRipple rippleColor="rgba(255, 255, 255, .50)" onPress={() => handleNewDatePress(title)}>
        <View style={{flexDirection: 'row',  gap: 10, padding: 10, paddingLeft: 0}}>
          <IconComponent
            name={"calendar"}
            category={"MaterialCommunityIcons"}
            size={20}
          />
          <TextInput
            style={{ backgroundColor: "transparent", height: 20, width: "70%" }}
            placeholderTextColor={allColors.textColorSecondary}
            disabled
            underlineColor={'transparent'}
            activeUnderlineColor={'transparent'}
            placeholder={title === "Ending Date" ? newEndDatePh: newStartDatePh}
          />
        </View>
      </TouchableRipple>
    </View>
  );
  // #endregion

  const decideColor = () => {
    if (newEndDate !== null) return "transparent";
    return allColors.textColorPrimary;
  };

  // #region recurrence type stuff
  
  useFocusEffect(
    useCallback(() => {
      fetchAllRecurrTypes();
    }, [])
  );

  const fetchAllRecurrTypes = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_RECURR_TYPES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeRecurrType(newData));
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // #endregion =========== End

  const addRecurrType = () => {
    setOpenNewRecurrence(false);
    dispatch(addNewRecurrType({ name: addNewRecurrenceName }));
    setAddNewRecurrenceName("");
  };

  const allRecurrTypes = useSelector(state => state.recurrTypeReducer.allRecurrTypes);

  // TODO: Add a date remover option, so if u select daily, show mon to sun and user can de-select a day where he doesn't want to reurrnece to be added. For weekly add one textinput asking user which week of this month to be des-selected .. this is only for daily and weekly

  const handleAddRecurrence = () => {
    const recurrenceDetails = {
      id: Math.random() + 10 + Math.random(),
      time: moment().format("HH:mm:ss"),
      recurrenceName: recName,
      recurrenceAmount: amount,
      recurrenceStartDate: selectedStartDate.toString() + " " + moment().month(selectedStartMonth).format('MM').toString() + " " + selectedStartYear.toString(),
      recurrenceEndDate: newEndDate !== null
        ? selectedEndDate.toString() + " " + moment().month(selectedEndMonth).format('MM').toString() + " " + selectedEndYear.toString()
        : "",
      repeatRecurrrence: needRepeat,
      paymentType: typePayment,
      frequency: newEndDate && selectedFrequency?.text,
      recurrenceType: chipName,
      paymentNetwork: selectedCardInExpense,
    };

    const isValidNumber = input => {
      const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;      
      return numberRegex.test(input);
    }
    const verifyStartAndEndDates = () => {
      if (newEndDate === null) return true;
      const startDate = moment(newStartDate, 'YYYY/MM/DD');
      const endDate = moment(newEndDate, 'YYYY/MM/DD');
      return startDate.isSameOrBefore(endDate);
    }
    const checkError = () => {
      if (recName.length === 0) {
        setErrorMsg("Please enter a recurrence name");
        return true;
      }
      if (!isValidNumber(amount)) {
        setErrorMsg("Please enter a valid amount value");
        return true;
      }
      // verify start date should be less than end date(if its there)
      if (!verifyStartAndEndDates()) {
        setErrorMsg("Please keep start date less than end date");
        return true;
      }
      if (newEndDate === null && selectedFrequency === null) {
        setErrorMsg("Please select either end date or frequency");
        return true;
      }
      // if (!selectedFrequency) {
      //   setErrorMsg("Please choose a payment frequency");
      //   return true;
      // }
      if (chipName.length === 0) {
        setErrorMsg("Please select a recurrence type");
        return true;
      }
      if (selectedCardInExpense === null) {
        setErrorMsg("Please choose or create a payment network");
        return true;
      }
      return false;
    }
    if (checkError()) {
      setError(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setError(false), 2000);
      return;
    }
    console.log(recurrenceDetails);
    // dispatch(addRecurrences(recurrenceDetails));
    navigation.goBack();
  };

  useEffect(() => {
    if (newEndDate !== null) {
      setSelectedFrequency(null);
    }
    if (selectedFrequency !== null) {
      // Delay the state updates using setTimeout
      setTimeout(() => {
        setNewEndDate(null);
        setNewEndDatePh(null);
      }, 10); // Adjust the delay as needed
    }
  }, [newEndDate, selectedFrequency]);

  console.log("Selected End Date: ", newEndDate);
  console.log("Selected Frequency: ", selectedFrequency);

  // NEW TODO: 
  // 1. If end date is selected (u can use newEndDate to know), the freq if selected should be de-selected and if freq is selected then end date should go back to null (probably setNewEndDate(null) and other states... ) , just a toggler between these two
  // 2. Add a check in checkError() which should check the starting date should be less than ending date
  // 3. Remove the disabled dates from DatePicker if component is Recurrence so that user can select future dates too
  // 4. Add a menu or a dropdown smth for selecting + and - just beside the Amount text field for Income and expense resp.
  // 5. Add a checkError() for amount too, it should only be a numeric value none other than that

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add Recurrence Payments"
        navigation={navigation}
        isPlus={true}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <View style={{ margin: 20, gap: 10, flex: 1 }}>
        <View style={{ gap: 10 }}>
          {commonText(recName, setRecName, "Recurrence Name")}
          {commonText(amount, setAmount, "Amount")}
        </View>

        {/* Start and end date */}
        <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
          {dateInput("Starting Date")}
          {dateInput("Ending Date")}
          {/* Repeat button */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: 10,
            }}
          >
            <Text variant="titleSmall">
              Repeat
            </Text>
            <BouncyCheckbox
              onPress={() => setNeedRepeat((prevState) => !prevState)}
              fillColor={allColors.textColorPrimary}
              innerIconStyle={{ borderRadius: 0, borderColor: "grey", }}
              iconStyle={{ borderRadius: 0, }}
              style={{paddingLeft: 5}}
            />
          </View>
        </View>

        {/* Frequency */}
        <View style={{ marginTop: 10, gap: 5 }}>
          <Text variant="titleSmall">Frequency</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <BouncyCheckboxGroup
              data={datesObj.map((item) => ({
                id: item.id.toString(),
                text: item.text,
                style: { marginRight: 15 },
                onPress: () => {
                  if (newEndDate !== null) {
                    setNewEndDate(null);
                    setNewEndDatePh(null);
                  }
                },
              }))}
              checkboxProps={{
                textStyle: { textDecorationLine: "none" },
                textContainerStyle: { marginLeft: 5 },
                innerIconStyle: { borderColor: "grey" },
                fillColor: "transparent",
                iconImageStyle: { tintColor: decideColor() },
              }}
              onChange={setSelectedFrequency}
              
            />
          </View>
        </View>

        {/* Recurrence type scroll */}
        <View style={{ marginTop: 10, gap: 5 }}>
          <Text variant="titleSmall" style={{ marginTop: 10 }}>
            Recurrence Type
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setOpenNewRecurrence(true)}
              style={{
                backgroundColor: allColors.backgroundColorLessPrimary,
                borderRadius: 6,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-start",
                flexDirection: "row",
                padding: 10,
                gap: 8,
                marginRight: 10,
              }}
            >
              <IconComponent
                name={"plus-circle"}
                category={"Feather"}
                size={20}
              />
              <Text>Add new</Text>
            </TouchableOpacity>
            {allRecurrTypes.length > 0 &&
              allRecurrTypes.map((item, index) => (
                <Chip
                  key={index}
                  index={index}
                  onPress={handleChipPress}
                  isClicked={clickedIndex === index}
                  text={item.name}
                />
              ))}
          </ScrollView>
        </View>

        {/* Payment network cards */}
        <View style={{ ...styles.commonStyles, height: 150 }}>
          <Text>Payment network</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.commonTouchableStyle}
              onPress={() => navigation.navigate("PlusMoreAccount")}
              activeOpacity={0.5}
            >
              <View style={styles.moreCardStyle}>
                <IconComponent
                  name={"plus-circle"}
                  category={"Feather"}
                  size={20}
                />
                <Text
                  variant="bodyLarge"
                  style={{ color: allColors.textColorFive }}
                >
                  Add new
                </Text>
              </View>
            </TouchableOpacity>
            {cardsData?.length !== 0 &&
              cardsData
                ?.filter((item) => item?.paymentNetwork)
                .map((e, index) => (
                  <TouchableOpacity
                    style={styles.commonTouchableStyle}
                    activeOpacity={0.5}
                    onPress={() => handlePress(e)}
                    key={index}
                  >
                    <View
                      style={[
                        styles.moreCardStyle,
                        selectedCardInExpense === e.paymentNetwork && {
                          ...styles.moreCardStyle,
                          ...styles.highlightedCardStyle,
                        },
                      ]}
                    >
                      <Text style={{ color: allColors.textColorFive }}>
                        {e.paymentNetwork}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>

        {/* Add button */}
        <View style={{ flexDirection: "column-reverse", flex: 1 }}>
          <Button
            onPress={handleAddRecurrence}
            mode="contained"
            labelStyle={{ fontSize: 15 }}
            textColor={"black"}
            style={{
              borderColor: "transparent",
              backgroundColor: allColors.backgroundColorLessPrimary,
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            }}
          >
            <Text
              style={{
                color: allColors.textColorPrimary,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Add
            </Text>
          </Button>
        </View>
      </View>
      {endDateOpen ? <MyDatePicker open={endDateOpen} setOpen={setEndDateOpen} fetchDates={fetchEndDates}

      selectedDate={selectedEndDate} selectedMonth={selectedEndMonth} selectedYear={selectedEndYear} setSelectedDate={setSelectedEndDate} setSelectedMonth={setSelectedEndMonth} setSelectedYear={setSelectedEndYear} disableTheDates={false}

      /> 
        : <MyDatePicker open={startDateOpen} setOpen={setStartDateOpen} fetchDates={fetchStartDates} selectedDate={selectedStartDate} selectedMonth={selectedStartMonth} selectedYear={selectedStartYear} setSelectedDate={setSelectedStartDate} setSelectedMonth={setSelectedStartMonth} setSelectedYear={setSelectedStartYear} disableTheDates={false}/>
      }

      <Portal>
        <Dialog
          visible={openNewRecurrence}
          dismissable
          onDismiss={() => setOpenNewRecurrence(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Title>Add new Recurrence name</Dialog.Title>
          <Dialog.Content>
            <TextInput 
              label="Name"
              value={addNewRecurrenceName}
              onChangeText={(val) => setAddNewRecurrenceName(val)}
              style={{backgroundColor: 'transparent'}}
              underlineColor={allColors.textColorPrimary}
              activeUnderlineColor={allColors.textColorPrimary}
              keyboardType="default"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setOpenNewRecurrence(false)}
              contentStyle={{ width: 60 }}
            >
              <Text style={{ color: allColors.textColorSecondary }}>
                Cancel
              </Text>
            </Button>
            <Button
              onPress={addRecurrType}
              contentStyle={{ width: 60 }}
              disabled={addNewRecurrenceName.length < 1}
            >
              <Text style={{ color: allColors.textColorPrimary }}>Add</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {error && <SnackbarComponent errorMsg={errorMsg}/>}
    </SafeAreaView>
  );
};

export default PlusMoreRecurrence;
