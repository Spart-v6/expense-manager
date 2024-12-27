import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AppHeader from "../components/AppHeader";
import {
  TextInput,
  Button,
  Dialog,
  Portal,
  TouchableRipple,
} from "react-native-paper";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addData,
  deleteData,
  updateData,
  storeCard,
  addRecentTransactions,
  updateRecentTransactions,
  deleteRecentTransactions,
  deleteSms,
} from "../redux/actions";
import moment from "moment";
import Icon1 from "react-native-vector-icons/Octicons";
import useDynamicColors from "../commons/useDynamicColors";
import SnackbarComponent from "../commons/snackbar";
import MyText from "../components/MyText";
import IconPickerModal from "../components/IconPickerModal";
import { IconComponent } from "../components/IconPickerModal";
import DeleteDialog from "../components/DeleteDialog";
import Chip from "../components/Chip";
import DatePicker from "react-native-neat-date-picker";

const FrequentCategories = ({ handleSelectedCategory }) => {
  const allColors = useDynamicColors();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const handleSelectIcon = ({ iconName, iconCategory }) => {
    setSelectedIcon(iconName);
    handleSelectedCategory({ iconName, iconCategory });
  };

  return (
    <View
      style={{
        paddingTop: 30,
        backgroundColor: allColors.backgroundColorLessPrimary,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
      }}
    >
      <View>
        <IconPickerModal
          onSelectIcon={handleSelectIcon}
          textColor={allColors.textColorFive}
        />
      </View>
    </View>
  );
};

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
        fontFamily: "Poppins_400Regular",
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
      marginRight: 10,
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
    commonCardIconStyle: {
      padding: 5,
      backgroundColor: allColors.backgroundColorQuaternary,
      borderRadius: 50,
    },
  });

const PlusMoreHome = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const dispatch = useDispatch();

  // #region
  // error states
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("Please fill all the fields");
  const timeoutRef = React.useRef(null);

  //  states for the icon picker dialog
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.selectedCategory;
      }
    }
    return null;
  });

  const handleSelectedCategory = (category) => {
    setSelectedCategory(category);
    setOpenCategoryDialog(false);
  };

  // Update screen variables
  const [isUpdatePressed, setIsUpdatePressed] = useState(false);
  const [valuesToChange, setValuesToChange] = useState({});
  const [btnName, setBtnName] = useState("Add Expense");

  const [expenseName, setExpenseName] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.name;
      }
    }
    return "";
  });

  const [amountValue, setAmountValue] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.amount;
      }
      if (route.params.sms) {
        return route.params.sms.amount;
      }
    }
    return "";
  });

  const [selectedButton, setSelectedButton] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.type;
      }
      if (route.params.sms) {
        return route.params.sms.transactionType === "debited"
          ? "Expense"
          : "Income";
      }
    }
    return "Expense";
  });

  const [description, setDescription] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.desc;
      }
      if (route.params.sms) {
        return "Transaction via " + route.params.sms.bank;
      }
    }
    return "";
  });

  // cards
  const [selectedCardInExpense, setSelectedCardInExpense] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.selectedCard;
      }
    }
    return "";
  });

  const [selectedCardID, setSelectedCardID] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.accCardSelected;
      }
    }
    return 0;
  });

  const handlePress = (e) => {
    setSelectedCardID(e.id);
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
    } catch (e) {}
  };
  // =========== End

  const cardsData = useSelector((state) => state.cardReducer.allCards);

  // Date variables
  const [dateValue, setDateValue] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return moment(route.params.updateItem.date, "YYYY/MM/DD").format(
          "DD/MM/YYYY"
        );
      }
      if (route.params.sms) {
        return moment(route.params.sms.date, "YYYY-MM-DD").format("DD/MM/YYYY");
      }
    }
    return moment().format("DD/MM/YYYY");
  });

  const [date, setDate] = useState(() => {
    if (route.params) {
      if (route.params.updateItem) {
        return route.params.updateItem.date;
      }
      if (route.params.sms) {
        return moment(route.params.sms.date, "YYYY-MM-DD").format("YYYY/MM/DD");
      }
    }
    return moment().format("YYYY/MM/DD");
  });

  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);

  const openDatePickerSingle = () => setShowDatePickerSingle(true);

  const onCancelSingle = () => setShowDatePickerSingle(false);

  const onConfirmSingle = (output) => {
    setShowDatePickerSingle(false);
    setDateValue(
      moment(output.dateString, "ddd MMM DD YYYY HH:mm:ss").format("DD/MM/YYYY")
    );
    setDate(
      moment(output.dateString, "ddd MMM DD YYYY HH:mm:ss").format("YYYY/MM/DD")
    );
  };

  // Getting msgId (from notifications screen) so that current notification will be deleted that got recently added to expense screen
  const [msgIdFrmNotiScreen, setMsgIdFrmNotiScreen] = useState(() => {
    if (route.params) {
      if (route.params.sms) {
        return route.params.sms.msgId;
      }
    }
    return "";
  });

  //Delete variables
  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = useState(false);

  const memoizedObj = useMemo(
    () => route?.params?.updateItem,
    [route?.params?.updateItem]
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

  const commonTextInput = (
    name,
    setter,
    placeholder,
    keyboardType,
    style = {}
  ) => {
    const defaultPlaceholder = "";
    let resolvedPlaceholder =
      placeholder === "Income"
        ? "Income name"
        : placeholder === "Expense"
        ? "Expense name"
        : placeholder || defaultPlaceholder;

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
              borderColor: allColors.textColorPrimary,
              borderWidth: 2,
              backgroundColor: allColors.innerTextFieldColor,
              ...style,
            },
            (placeholder === "Expense" || placeholder === "Income") && {
              flex: 1,
            },
          ]}
          selectionColor={allColors.textSelectionColor}
          textColor={allColors.universalColor}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          cursorColor={allColors.universalColor}
          placeholderTextColor={allColors.placeholderTextColor}
          autoComplete="off"
          textContentType="none"
          value={name}
          contentStyle={{ fontFamily: "Poppins_400Regular" }}
          placeholder={resolvedPlaceholder}
          onChangeText={handleTextCheck}
          keyboardType={keyboardType}
        />
        {(placeholder === "Expense" || placeholder === "Income") && (
          <TouchableOpacity
            onPress={() => setOpenCategoryDialog(true)}
            style={{ margin: 12 }}
            activeOpacity={1}
          >
            {selectedCategory === null || selectedCategory === undefined ? (
              <Icon1
                name={"single-select"}
                color={allColors.universalColor}
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
        onPress={openDatePickerSingle}
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
            contentStyle={{ fontFamily: "Poppins_400Regular" }}
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

  const handleAddOrUpdateExpense = () => {
    const expense = {
      id: Math.random() + 10 + Math.random(),
      time: moment().format("HH:mm:ss"),
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      desc: description,
      date: date,
      selectedCard: selectedCardInExpense,
      selectedCategory: selectedCategory,
      accCardSelected: selectedCardID,
    };
    const updateExpense = {
      type: selectedButton,
      name: expenseName,
      amount: amountValue,
      desc: description,
      date: date,
      selectedCard: selectedCardInExpense,
      selectedCategory: selectedCategory,
      accCardSelected: selectedCardID,
    };
    const isValidNumber = (input) => {
      const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
      return numberRegex.test(input);
    };
    const checkError = () => {
      if (expenseName.length === 0) {
        setErrorMsg("Please enter a expense name");
        return true;
      }
      if (!isValidNumber(amountValue)) {
        setErrorMsg("Please enter a valid amount value");
        return true;
      }
      if (selectedCardInExpense.length === 0) {
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
    if (isUpdatePressed) {
      dispatch(updateData(valuesToChange.id, updateExpense));
      dispatch(updateRecentTransactions(valuesToChange.id, updateExpense));
    } else {
      // also works for (when adding via notifications)
      dispatch(addData(expense));
      dispatch(addRecentTransactions(expense));
      // Deleting the notification from notificationsScreen coz that expense is now added to expense (home) screen
      dispatch(deleteSms(msgIdFrmNotiScreen));
    }
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params) {
      if (route.params.updateItem) {
        setValuesToChange(memoizedObj);
        setIsUpdatePressed(true);
        setBtnName("Update Expense");
      }
    }
  }, [memoizedObj]);

  const hideDialog = () => setIsDeleteBtnPressed(false);

  const deleteExpense = () => {
    setIsDeleteBtnPressed(false);
    dispatch(deleteData(valuesToChange.id));
    dispatch(deleteRecentTransactions(valuesToChange.id));
    navigation.goBack();
  };

  // #endregion

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add Expense"
        navigation={navigation}
        isPlus={true}
        isUpdate={isUpdatePressed}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ margin: 20 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            gap: 10,
          }}
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
            {commonTextInput(
              expenseName,
              setExpenseName,
              selectedButton,
              "default"
            )}
            {commonTextInput(
              amountValue,
              setAmountValue,
              "Amount",
              "number-pad"
            )}
            {commonTextInput(
              description,
              setDescription,
              "Description",
              "default"
            )}
          </View>

          <View style={{ flexDirection: "row", marginRight: 10 }}>
            {dateTextInput(dateValue)}
          </View>

          <View style={{ ...styles.commonStyles, height: 150 }}>
            <MyText
              style={{ color: allColors.universalColor }}
              variant="bodyLarge"
            >
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
          <View style={{ flex: 1 }} />

          <View>
            <Button
              onPress={handleAddOrUpdateExpense}
              mode="contained"
              labelStyle={{ fontSize: 20 }}
              textColor={"black"}
              style={{
                borderColor: "transparent",
                backgroundColor: allColors.addBtnColors,
                borderRadius: 20,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
            >
              <MyText
                style={{
                  color: allColors.backgroundColorPrimary,
                  fontFamily: "Poppins_400Regular",
                  fontSize: 20,
                  lineHeight: 35,
                }}
              >
                {btnName}
              </MyText>
            </Button>
          </View>
        </ScrollView>
      </View>

      <DatePicker
        isVisible={showDatePickerSingle}
        mode={"single"}
        onCancel={onCancelSingle}
        onConfirm={onConfirmSingle}
        initialDate={moment(date, "YYYY/MM/DD").toDate()}
        maxDate={new Date(moment().format("YYYY-MM-DD"))} // locking till today's date
        colorOptions={{
          backgroundColor: allColors.backgroundColorLessPrimary,
          changeYearModalColor: allColors.selectedDateColor,
          headerColor: allColors.calendarTopColor,
          weekDaysColor: allColors.selectedDateColor,
          dateTextColor: allColors.universalColor,
          selectedDateBackgroundColor: allColors.textColorFive,
          selectedDateTextColor: allColors.universalColorInverted,
          headerTextColor: allColors.backgroundColorQuaternary,
          confirmButtonColor: allColors.textColorFive,
        }}
      />

      <Portal>
        <DeleteDialog
          visible={isDeleteBtnPressed}
          hideDialog={hideDialog}
          deleteExpense={deleteExpense}
          allColors={allColors}
          title={"expense"}
          content={"expense"}
        />
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
          theme={{
            colors: {
              backdrop: "#00000099",
            },
          }}
        >
          <Dialog.Title
            style={{
              color: allColors.universalColor,
              fontFamily: "Poppins_400Regular",
            }}
          >
            Choose a category
          </Dialog.Title>
          <FrequentCategories handleSelectedCategory={handleSelectedCategory} />
        </Dialog>
      </Portal>
      {error && <SnackbarComponent errorMsg={errorMsg} />}
    </SafeAreaView>
  );
};

export default PlusMoreHome;
