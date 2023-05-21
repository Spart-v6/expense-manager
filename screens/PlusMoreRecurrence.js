import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Portal, TextInput, Text, Dialog, Button } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import AppHeader from "../components/AppHeader";
import moment from "moment";
import allColors from "../commons/allColors";
import Chip from "../components/Chip";
import { IconComponent } from "../components/IconPickerModal";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useRef, useCallback } from "react";
import { addRecurrences, deleteRecurrences, storeCard } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import SnackbarComponent from "../commons/snackbar";

const obj = [{ name: "Subscriptions" }, { name: "Income" }, { name: "Rent" }];

const datesObj = [
  { id: 0, text: "Daily" },
  { id: 1, text: "Weekly" },
  { id: 2, text: "Monthly" },
  { id: 3, text: "Yearly" },
];

const typeOfPayment = [
  { id: 0, name: "Income" },
  { id: 1, name: "Expense" },
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
  const [typePayment, setTypePayment] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [addNewRecurrenceName, setAddNewRecurrenceName] = useState("");
  const [openNewRecurrence, setOpenNewRecurrence] = useState(false);

  const [recName, setRecName] = useState("");
  const [amount, setAmount] = useState("");

  // #region Date stuff
  const [startDate, setStartDate] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const dateStartInputRef = useRef(null);
  const monthStartInputRef = useRef(null);
  const yearStartInputRef = useRef(null);

  const dateEndInputRef = useRef(null);
  const monthEndInputRef = useRef(null);
  const yearEndInputRef = useRef(null);

  const handleDateStartChange = (text) => {
    if (text.length <= 2) setStartDate(text);
    if (text.length === 2) {
      if (startMonth.length === 0) monthStartInputRef.current.focus();
    }
  };
  const handleMonthStartChange = (text) => {
    if (text.length <= 2) setStartMonth(text);
    if (text.length === 2) {
      if (startYear.length === 0) yearStartInputRef.current.focus();
    }
    if (text.length === 0) {
      if (startDate.length === 2) dateStartInputRef.current.focus();
    }
  };
  const handleYearStartChange = (text) => {
    if (text.length <= 2) setStartYear(text);
    if (text.length === 0) {
      if (startMonth.length === 2) monthStartInputRef.current.focus();
      else {
        if (startDate.length === 2) dateStartInputRef.current.focus();
      }
    }
  };

  const handleDateEndChange = (text) => {
    if (text.length <= 2) setEndDate(text);
    if (text.length === 2) {
      if (endMonth.length === 0) monthEndInputRef.current.focus();
    }
  };
  const handleMonthEndChange = (text) => {
    if (text.length <= 2) setEndMonth(text);
    if (text.length === 2) {
      if (endYear.length === 0) yearEndInputRef.current.focus();
    }
    if (text.length === 0) {
      if (endDate.length === 2) dateEndInputRef.current.focus();
    }
  };
  const handleYearEndChange = (text) => {
    if (text.length <= 2) setEndYear(text);
    if (text.length === 0) {
      if (endMonth.length === 2) monthEndInputRef.current.focus();
      else {
        if (endDate.length === 2) dateEndInputRef.current.focus();
      }
    }
  };
  // #endregion

  const checkEndDate = () =>
    endDate.length > 0 || endMonth.length > 0 || endYear.length > 0;

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

  const commonText = (name, setter, placeholder) => (
    <TextInput
      style={{
        borderRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderColor: "black",
        borderWidth: 2,
        backgroundColor: allColors.backgroundColorQuinary,
      }}
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
  );

  const dateInput = (
    title,
    dateName,
    monthName,
    yearName,
    handler1,
    handler2,
    handler3
  ) => (
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          ...styles.monthAndYearInput,
        }}
      >
        <TextInput
          style={{ backgroundColor: "transparent" }}
          contentStyle={{ paddingLeft: 14, paddingRight: 14 }}
          selectionColor={allColors.textColorFour}
          textColor={allColors.textColorFour}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholder="DD"
          placeholderTextColor={allColors.textColorFour}
          ref={title === "Starting Date" ? dateStartInputRef : dateEndInputRef}
          value={dateName}
          onChangeText={handler1}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text
          variant="headlineSmall"
          style={{ color: allColors.textColorFour }}
        >
          /
        </Text>
        <TextInput
          style={{ backgroundColor: "transparent" }}
          contentStyle={{ paddingLeft: 14, paddingRight: 14 }}
          selectionColor={allColors.textColorFour}
          textColor={allColors.textColorFour}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholder="MM"
          placeholderTextColor={allColors.textColorFour}
          ref={
            title === "Starting Date" ? monthStartInputRef : monthEndInputRef
          }
          value={monthName}
          onChangeText={handler2}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text
          variant="headlineSmall"
          style={{ color: allColors.textColorFour }}
        >
          /
        </Text>
        <TextInput
          style={{ backgroundColor: "transparent" }}
          contentStyle={{ paddingLeft: 14, paddingRight: 14 }}
          selectionColor={allColors.textColorFour}
          textColor={allColors.textColorFour}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          placeholder="YY"
          placeholderTextColor={allColors.textColorFour}
          ref={title === "Starting Date" ? yearStartInputRef : yearEndInputRef}
          value={yearName}
          onChangeText={handler3}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
    </View>
  );

  const decideColor = () => {
    if (checkEndDate()) return "transparent";
    return allColors.textColorPrimary;
  };

  // TODO: Add a date remover option, so if u select daily, show mon to sun and user can de-select a day where he doesn't want to reurrnece to be added. For weekly add one textinput asking user which week of this month to be des-selected .. this is only for daily and weekly

  const handleAddRecurrence = () => {
    const recurrenceDetails = {
      id: Math.random() + 10 + Math.random(),
      time: moment().format("HH:mm:ss"),
      recurrenceName: recName,
      recurrenceAmount: amount,
      recurrenceStartDate: startDate + " " + startMonth + " " + startYear,
      recurrenceEndDate: checkEndDate()
        ? endDate + " " + endMonth + " " + endYear
        : "",
      repeatRecurrrence: needRepeat,
      paymentType: typePayment?.text,
      frequency: !checkEndDate() && selectedFrequency?.text,
      recurrenceType: chipName,
      paymentNetwork: selectedCardInExpense,
    };

    const checkError = () => {
      if (recName.length === 0) {
        setErrorMsg("Please enter a recurrence name");
        return true;
      }
      if (amount.length === 0) {
        setErrorMsg("Please enter a amount value");
        return true;
      }
      const formattedStartDate = `${startDate} ${startMonth} ${startYear}`;
      const isValidStartDate = moment(formattedStartDate, 'DD MM YY', true).isValid();
      if (!isValidStartDate) {
        setErrorMsg("Invalid start date");
        return true;
      }

      const formattedEndDate = `${endDate} ${endMonth} ${endYear}`;
      if (formattedEndDate.trim().length > 0) {
        const isValidEndDate = moment(formattedEndDate, 'DD MM YY', true).isValid();
        if (!isValidEndDate) {
          setErrorMsg("Invalid end date");
          return true;
        }
      }
      if (typePayment === null) {
        setErrorMsg("Please choose a payment type");
        return true;
      }
      if (!selectedFrequency) {
        setErrorMsg("Please choose a payment frequency");
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
    }
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
      <View style={{ margin: 20, gap: 10, flex: 1 }}>
        <View style={{ gap: 10 }}>
          {commonText(recName, setRecName, "Recurrence Name")}
          {commonText(amount, setAmount, "Amount")}
        </View>

        {/* Start and end date */}
        <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
          {dateInput(
            "Starting Date",
            startDate,
            startMonth,
            startYear,
            handleDateStartChange,
            handleMonthStartChange,
            handleYearStartChange
          )}
          {dateInput(
            "Ending Date",
            endDate,
            endMonth,
            endYear,
            handleDateEndChange,
            handleMonthEndChange,
            handleYearEndChange
          )}

          {/* Repeat button */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: 18,
            }}
          >
            <Text variant="titleSmall" style={{ color: "white" }}>
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

        {/* Type of payment */}
        <View style={{ marginTop: 10, gap: 5 }}>
          <Text variant="titleSmall">Type</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <BouncyCheckboxGroup
              data={typeOfPayment.map(item => ({
                id: item.id.toString(),
                text: item.name,
                style: { marginRight: 15 },
              }))}
              checkboxProps={{
                textStyle: { textDecorationLine: "none" },
                textContainerStyle: { marginLeft: 5 },
                innerIconStyle: { borderColor: "grey" },
                fillColor: "transparent",
                iconImageStyle: { tintColor: allColors.textColorPrimary }
              }}
              onChange={setTypePayment}
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
              }))}
              checkboxProps={{
                textStyle: { textDecorationLine: "none" },
                textContainerStyle: { marginLeft: 5 },
                innerIconStyle: { borderColor: "grey" },
                fillColor: "transparent",
                iconImageStyle: { tintColor: decideColor() },
                disabled: checkEndDate(),
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
            {obj.length > 0 &&
              obj.map((item, index) => (
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
              style={{
                borderRadius: 15,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                borderColor: "black",
                borderWidth: 2,
                backgroundColor: allColors.backgroundColorQuinary,
              }}
              selectionColor={allColors.textColorFour}
              textColor={allColors.textColorFour}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholderTextColor={allColors.textColorFour}
              autoComplete="off"
              textContentType="none"
              value={addNewRecurrenceName}
              placeholder={""}
              onChangeText={(val) => setAddNewRecurrenceName(val)}
              keyboardType={"default"}
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
              onPress={() => setOpenNewRecurrence(false)}
              contentStyle={{ width: 60 }}
            >
              <Text style={{ color: allColors.textColorPrimary }}>Okay</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {error && <SnackbarComponent errorMsg={errorMsg}/>}
    </SafeAreaView>
  );
};

export default PlusMoreRecurrence;
