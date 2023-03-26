import {
  View,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
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
import DatePicker from "react-native-modern-datepicker";
import { useDispatch } from "react-redux";
import { addData, deleteData, updateData } from "../redux/actions";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import allColors from "../commons/allColors";

DatePicker.prototype = false; //temporarily disabling warnings

const styles = StyleSheet.create({
  btn: {
    borderColor: "transparent",
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  selected: {
    borderRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: allColors.backgroundColorQuaternary,
    text: {
      color: allColors.textColorTertiary,
      fontWeight: 700,
    },
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: allColors.backgroundColorLessPrimary,
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

const PlusMoreHome = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Update screen variables
  const [isUpdatePressed, setIsUpdatePressed] = useState(false);
  const [valuesToChange, setValuesToChange] = useState({});
  const [btnName, setBtnName] = useState("Add");

  const [expenseName, setExpenseName] = useState(() => {
    if (route.params) return route.params.updateItem.name;
    return "";
  });
  const [amountValue, setAmountValue] = useState(() => {
    if (route.params) return route.params.updateItem.amount;
    return "";
  });
  const [selectedButton, setSelectedButton] = useState(() => {
    if (route.params) return route.params.updateItem.type;
    return "Income";
  });

  // Date variables
  const [dateValue, setDateValue] = useState(() => {
    if (route.params) {
      return moment(route.params.updateItem.date, "YYYY/MM/DD").format(
        "Do MMMM YYYY"
      );
    }
    return moment().format("Do MMMM YYYY");
  });
  const [open, setOpen] = useState(false);

  const [tempDate, setTempDate] = useState(() => {
    if (route.params) {
      const dateString = route.params.updateItem.date;
      return dateString;
    }
    return moment().format("YYYY/MM/DD");
  });

  //Delete variables
  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = useState(false);

  const memoizedObj = useMemo(
    () => route?.params?.updateItem,
    [route?.params?.updateItem]
  );

  const changeDate = useCallback(
    (params) => {
      setOpen(false);
      setTempDate(params);
      setDateValue(moment(params, "YYYY/MM/DD").format("Do MMMM YYYY"));
    },
    [setOpen, setTempDate]
  );

  const incomeExpenseBtns = (name) => {
    return (
      <Button
        onPress={() =>
          name === "Income"
            ? setSelectedButton("Income")
            : setSelectedButton("Expense")
        }
        mode="contained"
        buttonColor={allColors.backgroundColorTertiary}
        labelStyle={{ fontSize: 15 }}
        style={[styles.btn, selectedButton === name && styles.selected]}
      >
        <Text style={selectedButton === name && styles.selected.text}>
          {name}
        </Text>
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
          borderColor: "black",
          borderWidth: 2,
          backgroundColor: allColors.backgroundColorQuinary,
          ...style,
        }}
        selectionColor={allColors.textColorFour}
        textColor={allColors.textColorFour}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        placeholderTextColor={allColors.textColorFour}
        autoComplete="off"
        textContentType="none"
        value={name}
        placeholder={resolvedPlaceholder}
        onChangeText={(val) => setter(val)}
        keyboardType={placeholder === "Amount" ? "phone-pad" : "default"}
      />
    );
  };

  const dateTextInput = (name) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          borderRadius: 15,
          borderColor: "black",
          borderWidth: 2,
          backgroundColor: allColors.backgroundColorQuinary,
          flex: 1,
          justifyContent: "center",
          paddingLeft: 15,
          alignItems: "flex-start",
        }}
        onPress={() => setOpen(true)}
      >
        <Text style={{ color: allColors.textColorFour, fontWeight: 700 }}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleAddOrUpdateExpense = () => {
    const expense = {
      id: Math.random() + 10 + Math.random(),
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      date: tempDate,
    };
    const updateExpense = {
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      date: tempDate,
    };
    if (isUpdatePressed) {
      dispatch(updateData(valuesToChange.id, updateExpense));
    } else {
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
  };

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

        <View style={{ flexDirection: "row", margin: 20, marginRight: 10 }}>
          {dateTextInput(dateValue)}
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{ margin: 20 }}
            activeOpacity={1}
          >
            <Icon
              name={"calendar"}
              color={allColors.backgroundColorQuinary}
              size={30}
            />
          </TouchableOpacity>
        </View>

        <Modal animationType="fade" transparent={true} visible={open}>
          <View style={styles.centeredView}>
            <SafeAreaView style={styles.modalView}>
              <DatePicker
                options={{
                  backgroundColor: allColors.backgroundColorLessPrimary,
                  mainColor: allColors.backgroundColorQuaternary,
                  selectedTextColor: "black",
                  textHeaderColor: allColors.textColorPrimary,
                  borderColor: "transparent",
                  textDefaultColor: "white",
                  textSecondaryColor: "white",
                }}
                mode="calendar"
                selected={tempDate}
                onDateChange={changeDate}
              />

              <Button
                onPress={() => setOpen(false)}
                mode="elevated"
                contentStyle={{ width: 100 }}
                buttonColor={allColors.backgroundColorQuaternary}
              >
                <Text
                  style={{ color: allColors.textColorFour, fontWeight: 800 }}
                >
                  Cancel
                </Text>
              </Button>
            </SafeAreaView>
          </View>
        </Modal>
      </View>

      <View style={{ flex: 1, flexDirection: "column-reverse" }}>
        <Button
          onPress={handleAddOrUpdateExpense}
          mode="contained"
          labelStyle={{ fontSize: 15 }}
          textColor={"black"}
          style={{
            borderColor: "transparent",
            backgroundColor: allColors.backgroundColorLessPrimary,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            margin: 10,
          }}
        >
          <Text
            style={{
              color: allColors.textColorPrimary,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {" "}
            {btnName}{" "}
          </Text>
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
