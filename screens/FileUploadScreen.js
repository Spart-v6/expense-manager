import MyText from "../components/MyText";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  SlideInRight,
  SlideOutRight,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import moment from "moment";
import Feather from "react-native-vector-icons/Feather";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addCard, addData, addRecentTransactions, storeCard } from "../redux/actions";

import { View, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";

import {
  Dialog,
  Portal,
  Snackbar,
  Divider,
  ActivityIndicator,
  TouchableRipple,
} from "react-native-paper";
import React, { useState, useCallback } from "react";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";
import LottieView from "lottie-react-native";

const FileUploadScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const dispatch = useDispatch();

  // for animating next and back dialog box screen
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(2);
  };

  const previousStep = () => {
    setStep(1);
  };

  // For snackbar variables
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarContent, setSnackbarContent] = React.useState("");
  const [gotchaError, setGotchaError] = React.useState(false);
  const [titleOfImport, setTitleOfImport] = React.useState("");
  const [typeOfImport, setTypeOfImport] = React.useState("");
  const onToggleSnackBar = () => setShowSnackbar(true);


  const [showDialogBox, setShowDialogBox] = React.useState(false);
  const handleShowDialogBox = type => {
    if (type === "expense") setTitleOfImport("Importing expenses");
    if (type === "card") setTitleOfImport("Importing cards");
    setTypeOfImport(type);
    setShowDialogBox(true);
  }

  // Snackbar variables ends

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const importFile = async (type) => {
    try {
      setLoading(true);
      setShowSuccess(false);
      setShowError(false);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json"],
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const mimeType = result.assets[0].mimeType;
        const fileSize = result.assets[0].size;
  
        if (fileSize > 1 * 1024 * 1024) {
          onToggleSnackBar();
          setShowError(true);
          setSnackbarContent(
            "The file is too large. Please upload a file smaller than 1MB"
          );
          return;
        }
  
        const fileContent = await fetch(fileUri).then((res) => res.text());
  
        if (mimeType === "application/json") {
          const jsonData = JSON.parse(fileContent);
          let validationResult = {};
          if (type === "expense") validationResult = validateImportedExpenseData(jsonData, "json");
          if (type === "card") validationResult = validateImportedCardsData(jsonData, "json");

          // TODO: add validation part for cards when imported
          // TODO: Add a dialog box that contains the loading in there only... dismissable of dialog box should be false, meaning if u click outside of dialog box it should not dismiss
          // TODO: When importing the expense data, in dialog box show a Caution: Cards data should be imported first before importing expense to not cause problems, add three buttons, in dialog box, done, dismiss and import card data (which should call importFile(type = 'card')) function!
          // TODO: Sso that dialog box for Importing expense data should show loading (like getting ready) then it should show the caution then proceed with imprting
          // TODO: dialog box for card import data should show getting ready only...
  
          if (validationResult.success) {
            onToggleSnackBar();
            setSnackbarContent(
              "JSON file has been imported and processed successfully"
            );
          } else {
            onToggleSnackBar();
            setShowError(true);
            setSnackbarContent(validationResult.errors[0]);
          }
        }
      } else {
        onToggleSnackBar();
        setShowError(true);
        setSnackbarContent("Document picker canceled or no files selected");
      }
    } catch (error) {
      onToggleSnackBar();
      setShowError(true);
      console.log("This is the error " + error.message);
      setSnackbarContent("Error importing file ");
    } finally {
      setLoading(false);
    }
  };
  

  // #region  Fetching card details here (required for validting imported data)
  useFocusEffect(
    useCallback(() => {
      fetchAllCardsData();
    }, [dispatch])
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

  const validateImportedExpenseData = (data, type) => {
    let validationErrors = [];
  
    if (data.length === 0) {
      validationErrors.push(`Error: No data to add.`);
    }
  
    if (type === "json") {
      const validCardsMap = new Map();
      cardsData.forEach((card) => {
        const paymentNetworkTrimmed = card.paymentNetwork.trim();
        const cardHolderNameTrimmed = card.cardHolderName.trim();
        if (!validCardsMap.has(paymentNetworkTrimmed)) {
          validCardsMap.set(paymentNetworkTrimmed, new Set());
        }
        validCardsMap.get(paymentNetworkTrimmed).add(cardHolderNameTrimmed);
      });
  
      const isEmptyObject = (obj) =>
        Object.keys(obj).length === 0 && obj.constructor === Object;
      const hasSingleEmptyObject = data.length === 1 && isEmptyObject(data[0]);
  
      if (hasSingleEmptyObject) {
        validationErrors.push(`Error: No data to add.`);
      } else {
        data.forEach((expense) => {
          const {
            paymentNetwork: selectedCard,
            cardHolderName: card_h_name,
            amount,
            name,
            desc,
            date,
            type,
          } = expense;
          const selectedCardTrimmed = selectedCard.trim();
          const card_h_nameTrimmed = card_h_name.trim();
  
          if (!validCardsMap.has(selectedCardTrimmed)) {
            validationErrors.push(
              `Error: "${selectedCardTrimmed}" does not exist in the card details.`
            );
            return;
          }
  
          if (!validCardsMap.get(selectedCardTrimmed).has(card_h_nameTrimmed)) {
            validationErrors.push(
              `Error: Imported card holder name "${card_h_nameTrimmed}" and payment network "${selectedCardTrimmed}" do not match existing card details.`
            );
            return;
          }
  
          if (isNaN(amount) || amount <= 0 || amount.length > 9) {
            validationErrors.push(
              `Error: Amount "${amount}" in expenseData is not a positive number or is greater than 9 digits.`
            );
          }
  
          if (
            date &&
            date.trim() !== "" &&
            !moment(date, "YYYY/MM/DD", true).isValid()
          ) {
            validationErrors.push(
              `Error: Date "${date}" in expenseData is not in the correct format.`
            );
          }
  
          if (type !== "Income" && type !== "Expense") {
            validationErrors.push(
              `Error: Type "${type}" in expenseData is not either "Income" or "Expense"`
            );
          }
  
          if (!name || name.length === 0) {
            validationErrors.push(
              `Error: Name "${name}" in expenseData is either empty or is undefined`
            );
          }
        });
      }
    }
  
    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    } else {
      insertImportedData(data, type);
      return { success: true, errors: [] };
    }
  };

  const validateImportedCardsData = (data, type) => {
    let validationErrors = [];
  
    if (data.length === 0) {
      validationErrors.push(`Error: No data to add.`);
    }

    if (type === "json") {
      //  [{"cardHolderName": "Daily Use", "checked": "debit", "id": 10.739132225563198, "month": "", "paymentNetwork": "ICICI", "year": ""}]

      const validCardTypes = ["credit", "debit"];
  
      const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;
      const hasSingleEmptyObject = data.length === 1 && isEmptyObject(data[0]);
  
      if (hasSingleEmptyObject) {
        validationErrors.push(`Error: No data to add.`);
      } else {
        data.forEach((card) => {
          const {
            cardHolderName,
            checked,
            month,
            year,
            paymentNetwork
          } = card;
          
          if (!(moment(month, "M", true).isValid() &&  moment(month, "M", true).month() < 12) && month !== "") {
            validationErrors.push(
              `Error: Month "${month}" in cardsData is invalid.`
            );
          }
          if (!(moment(year, "YY", true).isValid()) && year !== "") {
            validationErrors.push(
              `Error: Month "${month}" in cardsData is invalid.`
            );
          }
  
          if (!validCardTypes.includes(checked)) {
            validationErrors.push(
              `Error: Card Type "${checked}" in cardsData is not either "debit" or "credit"`
            );
          }
  
          if (!cardHolderName || cardHolderName.length === 0) {
            validationErrors.push(
              `Error: cardHolderName "${cardHolderName}" in cardsData is either empty or is undefined`
            );
          }
          if (!paymentNetwork || paymentNetwork.length === 0) {
            validationErrors.push(
              `Error: paymentNetwork "${paymentNetwork}" in cardsData is either empty or is undefined`
            );
          }
        });
      }
    }
    
    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    } else {
      insertImportedCardsData(data, type);
      return { success: true, errors: [] };
    }
  }

  const insertImportedData = (data, type) => {
    const getCardId = (cardHolderName, paymentNetwork) => {
      const card = cardsData.find(
        (card) =>
          card.cardHolderName.trim() === cardHolderName.trim() &&
          card.paymentNetwork.trim() === paymentNetwork.trim()
      );
      return card ? card.id : -1;
    };

    let timeOffset = 0;
    let allExpenses = [];
    let recentTransactions = [];

    data.forEach((expense) => {
      const {
        paymentNetwork: selectedCard,
        cardHolderName: card_h_name,
        amount,
        name,
        desc,
        date,
        type,
      } = expense;

      const selectedCardId = getCardId(card_h_name, selectedCard);
      const currentTime = moment()
        .add(timeOffset, "seconds")
        .format("HH:mm:ss");

      const expenseToBeInserted = {
        id: Math.random() + 10 + Math.random(),
        time: currentTime,
        type: type,
        name: name,
        amount: amount,
        desc: desc,
        date: date || moment().format("YYYY/MM/DD"),
        selectedCard: selectedCard,
        selectedCategory: null,
        accCardSelected: selectedCardId,
      };

      allExpenses.push(expenseToBeInserted);
      recentTransactions.push(expenseToBeInserted);

      timeOffset += 1;
    });

    dispatch(addData(allExpenses));
    dispatch(addRecentTransactions(recentTransactions));
    setShowSuccess(true);
    setShowError(false);
  };

  const insertImportedCardsData = (data, type) => {
    const allCards = [];

    data.forEach(card => {
      const {
        cardHolderName,
        paymentNetwork,
        month,
        year,
        checked,
      } = card

      const cardDetailsToBeInserted = {
        id: Math.random() + 10 + Math.random(),
        cardHolderName: cardHolderName,
        paymentNetwork: paymentNetwork,
        month: month,
        year: year,
        checked,
      };

      allCards.push(cardDetailsToBeInserted);  
    });

    dispatch(addCard(allCards));
    setShowSuccess(true);
    setShowError(false);
  }

  const handleDialogBoxDismissle = val => {
    setShowDialogBox(val);
    setShowSuccess(false);
    setShowError(false);
    setSnackbarContent("");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Import JSON file" navigation={navigation} isMenuNeeded={false} isParent={true}/>
      <ScrollView style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 20, flex: 1 }} contentContainerStyle={{justifyContent: "space-between", gap: 10}}>
        <View style={{ padding: 10}}>
          <View style={{ paddingBottom: 10 }}>
            <MyText
              variant="bodyLarge"
              style={{ color: allColors.textColorPrimary }}
              fontWeight="bold"
            >
              Instructions for importing expense data
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
              fontWeight="bold"
            >
              Make sure it contains:
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              1. Type of Expense (Income or Expense)
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              2. Expense name
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              3. Amount
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              4. Description (optional)
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              5. Date (Current date will be used if not provided)
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              6. Payment network (Card name and payment network must match
              exactly in Accounts)
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              Note: Only files up to 1MB can be uploaded.
            </MyText>
          </View>

          <Divider />
          <View style={{ paddingTop: 10 }}>
            <MyText
              variant="bodyLarge"
              style={{ color: allColors.universalColor }}
            >
              Please ensure the file is properly formatted before uploading
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              Below is an example for reference:
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"[\n{"}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"amount" : "100",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"date" : "YYYY/MM/DD",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"desc" : "It is optional",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"name" : "The name of expense",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {
                '\t"paymentNetwork" : "Payment network, must match with existing card",'
              }
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {
                '\t"cardHolderName" : "Card holder name, must match with existing card",'
              }
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"type" : "Income",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"},"}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"// and more ..."}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"]"}
            </MyText>
          </View>
          <TouchableOpacity
            onPress={() => handleShowDialogBox("expense")}
            style={styles.button}
            activeOpacity={0.5}
            disabled={loading}
          >
            <MyText style={styles.buttonText} variant="bodyLarge">Import Expenses</MyText>
          </TouchableOpacity>
        </View>
  
        <Divider style={{backgroundColor: allColors.addBtnColors, paddingTop: 2, paddingBottom: 2, borderRadius: 100}} bold/>

        <View style={{ padding: 10}}>
          <View style={{ paddingBottom: 10 }}>
            <MyText
              variant="bodyLarge"
              style={{ color: allColors.textColorPrimary }}
              fontWeight="bold"
            >
              Instructions for importing card data
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
              fontWeight="bold"
            >
              Make sure it contains:
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              1. Card Holder Name
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              2. Card Type (Credit/Debit)
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              3. Expiry Month (optional, "1 to 12")
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              4. Expiry Year (optional, "YY")
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              5. Payment Network
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              Note: Only files up to 1MB can be uploaded.
            </MyText>
          </View>

          <Divider />
          <View style={{ paddingTop: 10 }}>
            <MyText
              variant="bodyLarge"
              style={{ color: allColors.universalColor }}
            >
              Ensure the file is properly formatted
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              Below is an example for reference:
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"[\n{"}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"cardHolderName" : "Daily Use",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"checked" : "debit",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"month" : "Optional (0 to 12)",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {'\t"year" : "Optional (valid year only)",'}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {
                '\t"paymentNetwork" : "Payment network",'
              }
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"},"}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"// and more ..."}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: allColors.universalColor }}
            >
              {"]"}
            </MyText>
          </View>
          <TouchableOpacity
            onPress={() => handleShowDialogBox("card")}
            style={styles.button}
            activeOpacity={0.5}
            disabled={loading}
          >
            <MyText style={styles.buttonText} variant="bodyLarge">Import Cards</MyText>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <Portal>
        <Dialog 
          visible={showDialogBox}
          onDismiss={() => handleDialogBoxDismissle(false)}
          dismissable={!loading}
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
          <Dialog.Title style={{color: allColors.universalColor}}>{titleOfImport}</Dialog.Title>
          <Dialog.Content >
            {loading || showSuccess || showError ? (
              <View style={styles.loaderContainer}>
                {showSuccess || showError ? (
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", padding: 10 }}>
                    {showSuccess && (
                      <LottieView
                      source={require("../assets/success.json")}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      autoPlay
                      loop={false}
                      colorFilters={[
                        {
                          keypath: "tick",
                          color: allColors.textColorPrimary,
                        },
                        {
                          keypath: "circle",
                          color: allColors.backgroundColorQuaternary,
                        },
                      ]}
                      />
                    )}
                    {showError && (
                      <LottieView
                      source={require("../assets/warning.json")}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      autoPlay
                      loop={false}
                      colorFilters={[
                        {
                          keypath: "Line",
                          color: allColors.textColorTertiary,
                        },
                        {
                          keypath: "Dot",
                          color: allColors.textColorTertiary,
                        },
                        {
                          keypath: "Tri Outlines",
                          color: allColors.backgroundColorQuaternary,
                        },
                        {
                          keypath: "Plate_white",
                          color: allColors.backgroundColorLessPrimary,
                        },
                      ]}
                      />
                    )}
                    <MyText variant="bodySmall" style={{ color: allColors.universalColor, marginLeft: 10, flex: 1 }}
                      ellipsizeMode='tail' numberOfLines={5}
                    >
                      {snackbarContent}
                    </MyText>
                </View>
                ) : (
                  <>
                    <ActivityIndicator size="small" color={allColors.universalColor}/>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }} >
                      Importing please wait...
                    </MyText>
                  </>
                )}
              </View>
            ) : (
              <>
                <MyText style={{ color: allColors.universalColor }}>
                  Getting ready for {titleOfImport}
                </MyText>
                <MyText style={{ color: allColors.universalColor }}>
                  Please note: Import cards first before importing expenses
                </MyText>
              </>
            )}
            </Dialog.Content>
          <Dialog.Actions>
            {
              typeOfImport === "expense" ?
              <View style={{flexDirection: "row", gap: 10}}>
                <TouchableRipple
                  onPress={() => importFile("expense")}
                  rippleColor={allColors.rippleColor}
                  centered
                  >
                  <View style={[{padding: 10, borderRadius: 10}, {backgroundColor: allColors.addBtnColors, }]}>
                    <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Import expense</MyText>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => importFile("card")}
                  rippleColor={allColors.rippleColor}
                  centered
                  >
                  <View style={[{padding: 10, borderRadius: 10}, {backgroundColor: allColors.addBtnColors, }]}>
                    <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Import Cards</MyText>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => handleDialogBoxDismissle((prevVal) => !prevVal)}
                  rippleColor={allColors.rippleColor}
                  centered
                  >
                  <View style={[{padding: 10, borderRadius: 10}, {backgroundColor: allColors.addBtnColors, }]}>
                    <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Dismiss</MyText>
                  </View>
                </TouchableRipple>

              </View>
              :
              <View style={{flexDirection: "row", gap: 10}}>
                <TouchableRipple
                  onPress={() => importFile("card")}
                  rippleColor={allColors.rippleColor}
                  centered
                  >
                  <View style={[{padding: 10, borderRadius: 10}, {backgroundColor: allColors.addBtnColors, }]}>
                    <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Import Cards</MyText>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => handleDialogBoxDismissle((prevVal) => !prevVal)}
                  rippleColor={allColors.rippleColor}
                  centered
                  >
                  <View style={[{padding: 10, borderRadius: 10}, {backgroundColor: allColors.addBtnColors, }]}>
                    <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Dismiss</MyText>
                  </View>
                </TouchableRipple>
              </View>

            }
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const makeStyles = (allColors) =>
  StyleSheet.create({
    button: {
      borderColor: "transparent",
      backgroundColor: allColors.addBtnColors,
      borderRadius: 15,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,     
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20
    },
    buttonText: {
      color: allColors.backgroundColorPrimary,
    },
    loaderContainer: {
      // flex: 1,
      flexDirection: "row",
      gap: 20,
      justifyContent: "center",
      alignItems: "center",
      height: 50,
      // width: '100%'
    },
  });

export default FileUploadScreen;
