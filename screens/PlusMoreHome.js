import { View, SafeAreaView } from "react-native";
import AppHeader from "../components/AppHeader";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Dialog,
  Portal,
} from "react-native-paper";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
import { addData, deleteData, updateData } from "../redux/actions";
import moment from "moment";

const PlusMoreHome = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  // Update screen variables
  const [isUpdatePressed, setIsUpdatePressed] = useState(false);
  const [valuesToChange, setValuesToChange] = useState({});
  const [btnName, setBtnName] = useState("Add");
  const [modifiedDate, setModifiedDate] = useState("");


  const [expenseName, setExpenseName] = useState(() => {
    if(route.params) return route.params.updateItem.name;
    return "";
  });
  const [amountValue, setAmountValue] = useState(() => {
    if(route.params) return route.params.updateItem.amount;
    return "";
  });
  const [selectedButton, setSelectedButton] = useState(() => {
    if(route.params) return route.params.updateItem.type;
    return "Income"
  });
  const [dateValue, setDateValue] = useState(() => {
    if(route.params) { 
      return moment(route.params.updateItem.date, 'DD/MM/YYYY').format("Do MMMM YYYY");
    };
    return moment().format("Do MMMM YYYY")
  });
  const [date, setDate] = useState(() => {
    if(route.params) {
      const dateString = route.params.updateItem.date;
      const dateParts = dateString.split("/");
      const dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      return dateObject;
    }
    return new Date();
  });
  const [open, setOpen] = useState(false);

  //Delete variables
  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = useState(false);

  const memoizedObj = useMemo(
    () => route?.params?.updateItem,
    [route?.params?.updateItem]
  );

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

  const incomeExpenseBtns = name => {
    return (
      <Button
        onPress={() =>
          name === "Income"
            ? setSelectedButton("Income")
            : setSelectedButton("Expense")
        }
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
    );
  };

  const commonTextInput = (name, setter, placeholder, style = {}) => {
    const defaultPlaceholder = "";
    let resolvedPlaceholder =
      placeholder === "Income"
        ? "Income name"
        : placeholder === "Expense"
        ? "Expense name"
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
          justifyContent: "center",
          alignItems: "flex-start",
        }}
        textColor={theme.colors.onPrimary}
        onPress={() => setOpen(true)}
        mode="outlined"
      >
        {name}
      </Button>
    );
  };

  const handleAddOrUpdateExpense = () => {
    const expense = {
      id: Math.random() + 10 + Math.random(),
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      date: moment(date).format('DD/MM/YYYY')
    };
    const updateExpense = {
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      date: moment(date).format('DD/MM/YYYY')
    };
    if(isUpdatePressed) {
      dispatch(updateData(valuesToChange.id, updateExpense));
    }
    else{
      dispatch(addData(expense));
    }
    navigation.navigate("Home");
  };

  useEffect(() => {
    if (route.params) {
      setValuesToChange(memoizedObj);
      setIsUpdatePressed(true);
      setBtnName("Update");
    }
  }, [memoizedObj]);

  const hideDialog = () => setIsDeleteBtnPressed(false);

  const deleteExpense = () => {
    setIsDeleteBtnPressed(false);
    dispatch(deleteData(valuesToChange.id));
    navigation.navigate("Home");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add Expenses"
        navigation={navigation}
        isPlus={true}
        isUpdate={isUpdatePressed}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <View>
        <View
          style={{
            flexDirection: "row",
            marginLeft: 20,
            marginTop: 20,
            gap: 10,
          }}
        >
          {incomeExpenseBtns("Income")}
          {incomeExpenseBtns("Expense")}
        </View>

        <View style={{ margin: 20, marginBottom: 0, gap: 20 }}>
          {commonTextInput(expenseName, setExpenseName, selectedButton)}
          {commonTextInput(amountValue, setAmountValue, "Amount")}
        </View>

        <View style={{ flexDirection: "row", margin: 20, marginRight: 0 }}>
          {dateTextInput(dateValue)}
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
          onPress={handleAddOrUpdateExpense}
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
          {btnName}
        </Button>
      </View>

      <Portal>
        <Dialog visible={isDeleteBtnPressed} onDismiss={hideDialog}>
          <Dialog.Title>Delete expense?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The expense will be removed permanently
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={deleteExpense}
              mode="elevated"
              contentStyle={{ width: 60 }}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
            >
              Sure
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default PlusMoreHome;
