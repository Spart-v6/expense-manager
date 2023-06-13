import {
  View,
  SafeAreaView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
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
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addData, deleteData, updateData, storeCard } from "../redux/actions";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon1 from "react-native-vector-icons/AntDesign";
import allColors from "../commons/allColors";
import SnackbarComponent from "../commons/snackbar";
import { AntDesign } from "@expo/vector-icons";
import IconPickerModal from "../components/IconPickerModal";
import { IconComponent } from "../components/IconPickerModal";
import MyDatePicker from "../components/DatePicker";

const FrequentCategories = ({ handleSelectedCategory }) => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const handleSelectIcon = ({ iconName, iconCategory }) => {
    setSelectedIcon(iconName);
    handleSelectedCategory({ iconName, iconCategory });
  };

  return (
    <View
      style={{
        paddingLeft: 10,
        paddingTop: 30,
        backgroundColor: allColors.backgroundColorLessPrimary
      }}
    >
      <View>
        <IconPickerModal onSelectIcon={handleSelectIcon} />
      </View>
    </View>
  );
};

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
  commonStyles: {
    gap: 20,
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
  commonCardIconStyle: {
    padding: 5,
    backgroundColor: allColors.backgroundColorQuaternary,
    borderRadius: 50,
  },
});

const PlusMoreHome = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // #region
  // error states
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("Please fill all the fields");
  const timeoutRef = React.useRef(null);

  //  states for the icon picker dialog
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (route.params) return route.params.updateItem.selectedCategory;
    return null;
  });

  const handleSelectedCategory = (category) => {
    setSelectedCategory(category);
    setOpenCategoryDialog(false);
  };

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
    return "Expense";
  });

  const [description, setDescription] = useState(() => {
    if (route.params) return route.params.updateItem.desc;
    return "";
  });

  // cards
  const [selectedCardInExpense, setSelectedCardInExpense] = useState(() => {
    if (route.params) return route.params.updateItem.selectedCard;
    return "";
  });
  const handlePress = (e) => {
    setSelectedCardInExpense(e.paymentNetwork);
  };

  // =========== Fetching card details here also (coz it's when updating it returns back)
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
  // =========== End

  const cardsData = useSelector((state) => state.cardReducer.allCards);

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

  // for icons
  // TODO: Do chips and Icon Picker + Tabs in modal

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
      <View
        style={
          (placeholder === "Expense" || placeholder === "Income") && {
            flexDirection: "row",
          }
        }
      >
        <TextInput
          style={[
            {
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              borderColor: "black",
              borderWidth: 2,
              backgroundColor: allColors.backgroundColorQuinary,
              ...style,
            },
            (placeholder === "Expense" || placeholder === "Income") && {
              flex: 1,
            },
          ]}
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
        {(placeholder === "Expense" || placeholder === "Income") && (
          <TouchableOpacity
            onPress={() => setOpenCategoryDialog(true)}
            style={{ margin: 12 }}
            activeOpacity={1}
          >
            {selectedCategory === null || selectedCategory === undefined ? (
              <Icon1
                name={"select1"}
                color={allColors.backgroundColorQuinary}
                size={30}
              />
            ) : (
              <IconComponent
                name={selectedCategory?.iconName}
                category={selectedCategory?.iconCategory}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
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
      time: moment().format("HH:mm:ss"),
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      desc: description,
      date: tempDate,
      selectedCard: selectedCardInExpense,
      selectedCategory: selectedCategory
    };
    const updateExpense = {
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      desc: description,
      date: tempDate,
      selectedCard: selectedCardInExpense,
      selectedCategory: selectedCategory
    };
    const checkError = () => {
      if (expenseName.length === 0) {
        setErrorMsg("Please enter a expense name");
        return true;
      }
      if (amountValue.length === 0) {
        setErrorMsg("Please enter a amount value");
        return true;
      }
      if (selectedCardInExpense.length === 0) {
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

  // #endregion
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add Expenses"
        navigation={navigation}
        isPlus={true}
        isUpdate={isUpdatePressed}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <View style={{ margin: 20, gap: 10, flex: 1 }}>
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
          {commonTextInput(expenseName, setExpenseName, selectedButton)}
          {commonTextInput(amountValue, setAmountValue, "Amount")}
          {commonTextInput(description, setDescription, "Description")}
        </View>

        <View style={{ flexDirection: "row", marginRight: 10 }}>
          {dateTextInput(dateValue)}
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{ margin: 12 }}
            activeOpacity={1}
          >
            <Icon
              name={"calendar"}
              color={allColors.backgroundColorQuinary}
              size={30}
            />
          </TouchableOpacity>
        </View>

        <MyDatePicker />

        <View style={{ ...styles.commonStyles, height: 150 }}>
          <Text>Payment network</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.commonTouchableStyle}
              onPress={() => navigation.navigate("PlusMoreAccount")}
              activeOpacity={0.5}
            >
              <View style={styles.moreCardStyle}>
                <AntDesign
                  name="pluscircle"
                  size={30}
                  color={allColors.textColorPrimary}
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
              borderTopLeftRadius: 15
            }}
          >
            <Text
              style={{
                color: allColors.textColorPrimary,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {btnName}
            </Text>
          </Button>
        </View>
      </View>

      <Portal>
        
        <Modal animationType="fade" transparent={true} visible={open} onDismiss={() => setOpen(false)}>
          <View style={styles.centeredView}>
            <SafeAreaView style={styles.modalView}>
              <DatePicker
                options={{
                  backgroundColor: allColors.backgroundColorLessPrimary.toString(),
                  mainColor: '#d6d6d6',
                  selectedTextColor: "black",
                  textHeaderColor: 'white',
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
      </Portal>

      <Portal>
        <Dialog
          visible={isDeleteBtnPressed}
          onDismiss={hideDialog}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Title>Delete expense?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The expense will be removed permanently
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>
              <Text style={{color: allColors.textColorPrimary}}> Cancel </Text>
            </Button>
            <Button
              onPress={deleteExpense}
              mode="elevated"
              contentStyle={{ width: 60 }}
              buttonColor={allColors.warningColor}
            >
              <Text style={{ color: allColors.textColorTertiary }}>Sure</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        {/* Dialog box for viewing icons */}
        <Dialog
          visible={openCategoryDialog}
          onDismiss={() => setOpenCategoryDialog(false)}
          style={{
            height: 400,
            backgroundColor: allColors.backgroundColorLessPrimary,
          }}
        >
          <Dialog.Title>Choose a category</Dialog.Title>
          <FrequentCategories
            handleSelectedCategory={handleSelectedCategory}
          />
        </Dialog>
      </Portal>
      {error && <SnackbarComponent errorMsg={errorMsg}/>}
    </SafeAreaView>
  );
};

export default PlusMoreHome;
