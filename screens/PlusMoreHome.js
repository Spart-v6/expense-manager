import { View, SafeAreaView } from "react-native";
import AppHeader from "../components/AppHeader";
import { TextInput, Button, Text } from "react-native-paper";
import React, { useState, useCallback, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "react-native-paper";
import moment from "moment";

const PlusMoreHome = ({ navigation }) => {
  const theme = useTheme();
  const [expenseName, setExpenseName] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [selectedButton, setSelectedButton] = useState("Income");
  const [dateValue, setDateValue] = useState(moment().format('Do MMMM YYYY'));
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const onDateChange = useCallback(
    (params) => {
      setOpen(false);
      const chosenDate = new Date(params.nativeEvent.timestamp);
      const visibleDate = moment(chosenDate).format("Do MMMM YYYY");
      setDate(chosenDate);
      setDateValue(visibleDate);
    },
    [setOpen, setDate]
  );

  const incomeExpenseBtns = (name) => {
    return (
      <Button
        onPress={() => name === "Income" ? setSelectedButton("Income"): setSelectedButton("Expense")}
        mode="contained"
        labelStyle={{ fontSize: 15 }}
        textColor={theme.colors.primary}
        style={{
          borderColor: "transparent",
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 15,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
        }}
      >
        {name}
      </Button>
    )
  }

  const commonTextInput = (name, setter, placeholder, style = {}) => {
    const defaultPlaceholder = "";
    const resolvedPlaceholder = placeholder === "Income"
    ? "Add Income"
    : placeholder === "Expense"
      ? "Add Expense"
      : placeholder || defaultPlaceholder;

    return (
      <TextInput
        style={{
          borderRadius: 15,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          borderColor: theme.colors.onPrimary,
          borderWidth: 2,
          backgroundColor: theme.colors.onPrimaryContainer,
          ...style,
        }}
        selectionColor={theme.colors.onPrimary}
        textColor={theme.colors.onPrimary}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        placeholderTextColor={theme.colors.onPrimary}
        autoComplete="off"
        textContentType="none"
        value={name}
        placeholder={resolvedPlaceholder}
        onChangeText={(val) => setter(val)}
        keyboardType={placeholder === "Amount" ? "phone-pad" : "default"}
      />
    );
  };

  const dateTextInput = name => {
    return (
      <Button
      style={{
        borderRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderColor: theme.colors.onPrimary,
        borderWidth: 2,
        backgroundColor: theme.colors.onPrimaryContainer,
        flex: 1,
        justifyContent: 'center',
        alignItems: "flex-start"
      }}
        textColor={theme.colors.onPrimary}
        onPress={() => setOpen(true)}
        mode="outlined"
      >
        {name}
      </Button>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Add Expenses" navigation={navigation} isPlus={true}/>
      <View>
        <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 20, gap: 10 }} >
          {incomeExpenseBtns("Income")}
          {incomeExpenseBtns("Expense")}
        </View>

        <View style={{ margin: 20, marginBottom: 0, gap: 20 }}>
          {commonTextInput(expenseName, setExpenseName, selectedButton)}
          {commonTextInput(amountValue, setAmountValue, "Amount")}
        </View>

        <View style={{ flexDirection: "row", margin: 20, marginRight: 0 }}>
          {dateTextInput(dateValue, setDateValue, "Select a date")}
          <Button
            onPress={() => setOpen(true)}
            mode="outlined"
            icon="calendar"
            labelStyle={{ fontSize: 35 }}
            textColor={theme.colors.onPrimary}
            style={{ borderColor: "transparent" }}
          />
        </View>
        {open && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(e) => onDateChange(e)}
          />
        )}
      </View>
      <View style={{ flex: 1, flexDirection: "column-reverse" }}>
        <Button
          onPress={() => {}}
          mode="contained"
          labelStyle={{ fontSize: 15 }}
          textColor={theme.colors.primary}
          style={{
            borderColor: "transparent",
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            margin: 10,
          }}
        >
          Add
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PlusMoreHome;
