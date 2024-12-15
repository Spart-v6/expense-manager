import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Portal,
  TextInput,
  Text,
  Dialog,
  Button,
  TouchableRipple,
} from "react-native-paper";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import moment from "moment";
import useDynamicColors from "../commons/useDynamicColors";
import Chip from "../components/Chip";
import BackChip from "../components/BackChip";
import { IconComponent } from "../components/IconPickerModal";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  addRecurrences,
  storeCard,
  addNewRecurrType,
  storeRecurrType,
} from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import SnackbarComponent from "../commons/snackbar";
import DatePicker from 'react-native-neat-date-picker'

const datesObj = [
  { id: 0, text: "Daily" },
  { id: 1, text: "Weekly" },
  { id: 2, text: "Monthly" },
  { id: 3, text: "Yearly" },
];

const typeOfPayment = [
  { id: 0, name: "Income", type: "+" },
  { id: 1, name: "Expense", type: "-" },
];

const makeStyles = (allColors) =>
  StyleSheet.create({
    btn: {
      borderColor: "transparent",
      borderRadius: 10,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    textbtn: {
      color: allColors.textColorSecondary,
    },
    selected: {
      borderColor: allColors.textColorPrimary,
      borderWidth: 1,
      borderRadius: 20,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      backgroundColor: allColors.backgroundColorDatesSelected,
      text: {
        color: allColors.textColorPrimary,
        fontWeight: 700,
      },
    },
    commonStyles: {
      gap: 20,
      marginTop: 20,
    },
    commonTouchableStyle: {
      marginRight: 20,
    },
    moreCardStyle: {
      padding: 15,
      borderRadius: 10,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: allColors.backgroundColorDates,
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
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const dispatch = useDispatch();

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Please fill all the fields");
  const timeoutRef = useRef(null);

  const [selectedCardID, setSelectedCardID] = useState(null);
  const [selectedCardInExpense, setSelectedCardInExpense] = useState(null);

  const [selectedButton, setSelectedButton] = useState("Expense");
  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = useState(false);
  const [clickedIndex, setClickedIndex] = React.useState(null);
  const [chipName, setChipName] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [addNewRecurrenceName, setAddNewRecurrenceName] = useState("");
  const [openNewRecurrence, setOpenNewRecurrence] = useState(false);

  const [recName, setRecName] = useState("");
  const [amount, setAmount] = useState("");

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
    } catch (e) {}
  };
  // #endregion =========== End

  const cardsData = useSelector((state) => state.cardReducer.allCards);

  const handleChipPress = (index, text) => {
    setClickedIndex(index);
    setChipName(text);
  };

  const handlePress = (e) => {
    setSelectedCardID(e.id);
    setSelectedCardInExpense(e.paymentNetwork);
  };

  const incomeExpenseBtns = (name) => {
    return (
      <Button
        onPress={() =>
          name === "Income"
            ? setSelectedButton("Income")
            : setSelectedButton("Expense")
        }
        mode="contained"
        buttonColor={allColors.backgroundColorDates}
        labelStyle={{ fontSize: 15 }}
        style={[styles.btn, selectedButton === name && styles.selected]}
      >
        <MyText
          style={[
            styles.textbtn,
            selectedButton === name && styles.selected.text,
          ]}
        >
          {name}
        </MyText>
      </Button>
    );
  };

  const commonText = (name, setter, placeholder, keyboardType) => {
    const handleTextCheck = (val) => {
      if (keyboardType === "number-pad") {
        val = val.replace(",", ".");
        const regex = /^\d{0,10}(\.\d{0,2})?$/;
        if (!regex.test(val)) {
          return;
        }
      }
      setter(val);
    };
    return (
      <>
        <TextInput
          style={[
            {
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderColor: allColors.textColorPrimary,
              borderWidth: 2,
              backgroundColor: allColors.innerTextFieldColor,
            },
          ]}
          selectionColor={allColors.textSelectionColor}
          textColor={allColors.universalColor}
          cursorColor={allColors.universalColor}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholderTextColor={allColors.placeholderTextColor}
          contentStyle={{ fontFamily: "Karla_400Regular" }}
          autoComplete="off"
          textContentType="none"
          value={name}
          placeholder={placeholder}
          onChangeText={handleTextCheck}
          keyboardType={keyboardType}
        />
      </>
    );
  };

  // #region New dates stuff
  const [selectedStartMonth, setSelectedStartMonth] = useState(
    moment().format("MMMM")
  );
  const [selectedStartYear, setSelectedStartYear] = useState(moment().year());
  const [selectedStartDate, setSelectedStartDate] = useState(moment().date());

  const [newStartDate, setNewStartDate] = useState(
    moment().format("YYYY/MM/DD")
  );
  const [newStartDatePh, setNewStartDatePh] = useState(
    moment().format("DD/MM/YYYY")
  );

  const [dateValue, setDateValue] = useState(moment().format("DD/MM/YYYY"));

  const [date, setDate] = useState(moment().format("YYYY/MM/DD"));
  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false)

  const openDatePickerSingle = () => setShowDatePickerSingle(true)

  const onCancelSingle = () => setShowDatePickerSingle(false);

  const onConfirmSingle = (output) => {
    setShowDatePickerSingle(false)
    setDateValue(moment(output.dateString, "ddd MMM DD YYYY HH:mm:ss").format("DD/MM/YYYY"))
    setDate(moment(output.dateString, "ddd MMM DD YYYY HH:mm:ss").format("YYYY/MM/DD"));
  }

  const dateInput = (name) => {
    // converting date to human-readable format
    const humanReadbleDate = moment(name, "DD/MM/YYYY").format("Do MMM YY");
    return (
      <View
        style={{
          flexDirection: "column",
          flex: 0.5,
          justifyContent: "center",
          gap: 5,
        }}
      >
        <TouchableRipple
          rippleColor={allColors.rippleColor}
          onPress={openDatePickerSingle}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
              padding: 10,
              paddingLeft: 0,
            }}
          >
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
              cursorColor={allColors.universalColor}
              placeholderTextColor={allColors.textColorSecondary}
              contentStyle={{ fontFamily: "Karla_400Regular" }}
              disabled
              underlineColor={"transparent"}
              activeUnderlineColor={"transparent"}
              placeholder={humanReadbleDate}
              underlineColorAndroid={"red"}
              underlineStyle={{ backgroundColor: "transparent" }}
            />
          </View>
        </TouchableRipple>
      </View>
    );
  }
  // #endregion

  const handleFrequencyChange = (e) => {
    setSelectedFrequency(e);
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
    } catch (e) {}
  };
  // #endregion =========== End

  const addRecurrType = () => {
    setOpenNewRecurrence(false);
    dispatch(addNewRecurrType({ name: addNewRecurrenceName }));
    setAddNewRecurrenceName("");
  };

  const allRecurrTypes = useSelector(
    (state) => state.recurrTypeReducer.allRecurrTypes
  );

  const handleAddRecurrence = () => {
    const recurrenceDetails = {
      id: Math.random() + 10 + Math.random(),
      time: moment().format("HH:mm:ss"),
      recurrenceName: recName,
      recurrenceAmount: amount,
      recurrenceStartDate: moment(date, "YYYY/MM/DD").format("DD MM YY"),
      paymentType: selectedButton,
      frequency: selectedFrequency?.text ? selectedFrequency.text : "",
      recurrenceType: chipName,
      paymentNetwork: selectedCardInExpense,
      accCardSelected: selectedCardID,
    };

    const isValidNumber = (input) => {
      const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
      return numberRegex.test(input);
    };
    const checkError = () => {
      if (recName.length === 0) {
        setErrorMsg("Please enter a recurrence name");
        return true;
      }
      if (!isValidNumber(amount)) {
        setErrorMsg("Please enter a valid amount value");
        return true;
      }
      // if (!verifyStartAndEndDates()) {
      //   setErrorMsg("Please keep start date less than end date");
      //   return true;
      // }
      if (selectedFrequency === null) {
        setErrorMsg("Please select frequency");
        return true;
      }
      if (chipName.length === 0) {
        setErrorMsg("Please select a recurrence type");
        return true;
      }
      if (selectedCardInExpense === null) {
        setErrorMsg("Please choose or create a payment network");
        return true;
      }
      return false;
    };
    if (checkError()) {
      setError(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setError(false), 2000);
      return;
    }
    dispatch(addRecurrences(recurrenceDetails));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add Recurrence Payments"
        navigation={navigation}
        isPlus={true}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ margin: 20 }}
          contentContainerStyle={{ gap: 10, flexGrow: 1, justifyContent: 'flex-end' }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            {incomeExpenseBtns("Income")}
            {incomeExpenseBtns("Expense")}
          </View>

          <View style={{ marginTop: 10, gap: 20 }}>
            {commonText(recName, setRecName, "Recurrence Name", "default")}
            {commonText(amount, setAmount, "Amount", "number-pad")}
          </View>

          {/* Start and end date */}
          <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
            {dateInput(dateValue)}
          </View>

          {/* Frequency */}
          <View style={{ marginTop: 10, gap: 5 }}>
            <MyText
              variant="titleSmall"
              style={{ color: allColors.universalColor }}
            >
              Frequency
            </MyText>
            <ScrollView
              contentContainerStyle={{ flexDirection: "row", gap: 10 }}
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <BouncyCheckboxGroup
                data={datesObj.map((item) => ({
                  id: item.id.toString(),
                  text: item.text,
                  style: { marginRight: 15 },
                }))}
                checkboxProps={{
                  textStyle: { textDecorationLine: "none" },
                  textContainerStyle: { marginLeft: 5 },
                  innerIconStyle: { borderColor: "grey" },
                  fillColor: "transparent",
                  iconImageStyle: { tintColor: allColors.textColorPrimary },
                }}
                onChange={handleFrequencyChange}
              />
            </ScrollView>
          </View>

          {/* Recurrence type scroll */}
          <View style={{ marginTop: 10, gap: 5 }}>
            <MyText
              variant="titleSmall"
              style={{ marginTop: 10, color: allColors.universalColor }}
            >
              Recurrence Type
            </MyText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setOpenNewRecurrence(true)}
                style={{
                  backgroundColor: allColors.backgroundColorDates,
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
                  color={allColors.addBtnColors}
                />
                <MyText style={{ color: allColors.universalColor }}>
                  Add new
                </MyText>
              </TouchableOpacity>
              {allRecurrTypes.length > 0 &&
                allRecurrTypes.map((item, index) => (
                  <BackChip
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
            <MyText style={{ color: allColors.universalColor }}>
              Payment network
            </MyText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              <View
                style={{
                  alignItems: "center",
                  padding: 1,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.commonTouchableStyle}
                  onPress={() => navigation.navigate("PlusMoreAccount")}
                  activeOpacity={0.5}
                >
                  <View style={styles.moreCardStyle}>
                    <IconComponent
                      name={"plus-circle"}
                      category={"Feather"}
                      size={25}
                      color={allColors.addBtnColors}
                    />
                    <MyText
                      variant="bodyLarge"
                      style={{ color: allColors.textColorFive }}
                    >
                      Add new
                    </MyText>
                  </View>
                </TouchableOpacity>
              </View>
              {cardsData?.length !== 0 &&
                cardsData
                  ?.filter((item) => item?.paymentNetwork)
                  .map((e, index) => (
                    <Chip
                      key={index}
                      data={e}
                      onPress={handlePress}
                      isClicked={selectedCardID === e.id}
                      text={e.paymentNetwork}
                      styles={styles}
                      name={e.cardHolderName}
                      cardName={e.checked}
                    />
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
                backgroundColor: allColors.addBtnColors,
                borderRadius: 15,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}
            >
              <MyText
                style={{
                  color: allColors.backgroundColorPrimary,
                  fontFamily: "Karla_400Regular",
                  fontSize: 18,
                }}
              >
                Add Recurrence
              </MyText>
            </Button>
          </View>
        </ScrollView>
      </View>
      {
        <DatePicker
          isVisible={showDatePickerSingle}
          mode={'single'}
          onCancel={onCancelSingle}
          onConfirm={onConfirmSingle}
          minDate={new Date(moment().subtract(1, 'months').format('YYYY-MM-DD'))} // u can set date till 1 month before
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
      }

      <Portal>
        <Dialog
          visible={openNewRecurrence}
          dismissable
          onDismiss={() => setOpenNewRecurrence(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
          theme={{
            colors: {
              backdrop: "#00000099",
            },
          }}
        >
          <Dialog.Title
            style={{
              color: allColors.textColorSecondary,
              fontFamily: "Karla_400Regular",
            }}
          >
            Add new recurrence type
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={
                <MyText style={{ color: allColors.universalColor }}>
                  {"Name"}
                </MyText>
              }
              value={addNewRecurrenceName}
              cursorColor={allColors.universalColor}
              onChangeText={(val) => setAddNewRecurrenceName(val)}
              textColor={allColors.universalColor}
              style={{ backgroundColor: "transparent" }}
              underlineColor={allColors.textColorPrimary}
              selectionColor={allColors.textSelectionColor}
              activeUnderlineColor={allColors.textColorPrimary}
              contentStyle={{ fontFamily: "Karla_400Regular" }}
              keyboardType="default"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setOpenNewRecurrence(false)}
              contentStyle={{ width: 60 }}
            >
              <MyText style={{ color: allColors.textColorSecondary }}>
                Cancel
              </MyText>
            </Button>
            <Button
              onPress={addRecurrType}
              contentStyle={{ width: 60 }}
              disabled={addNewRecurrenceName.length < 1}
            >
              <MyText style={{ color: allColors.textColorPrimary }}>Add</MyText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {error && <SnackbarComponent errorMsg={errorMsg} />}
    </SafeAreaView>
  );
};

export default PlusMoreRecurrence;

// TODO: Add a date remover option, so if u select daily, show mon to sun and user can de-select a day where he doesn't want to reurrnece to be added. For weekly add one textinput asking user which week of this month to be des-selected .. this is only for daily and weekly
