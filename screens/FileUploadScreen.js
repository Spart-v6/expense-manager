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
import { addData, addRecentTransactions, storeCard } from "../redux/actions";

import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";

import {
  Dialog,
  Portal,
  Snackbar,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import React, { useState, useCallback } from "react";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";

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
  const onToggleSnackBar = () => setShowSnackbar(true);
  // Snackbar variables ends

  const [loading, setLoading] = useState(false);
  const importFile = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json"],
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const mimeType = result.assets[0].mimeType;
        const fileSize = result.assets[0].size;
  
        if (fileSize > 1 * 1024 * 1024) {
          onToggleSnackBar();
          setSnackbarContent(
            "The file is too large. Please upload a file smaller than 1MB"
          );
          return;
        }
  
        const fileContent = await fetch(fileUri).then((res) => res.text());
  
        if (mimeType === "application/json") {
          const jsonData = JSON.parse(fileContent);
          const validationResult = validateImportedData(jsonData, "json");
  
          if (validationResult.success) {
            setSnackbarContent(
              "JSON file has been uploaded and processed successfully"
            );
          } else {
            onToggleSnackBar();
            setSnackbarContent(validationResult.errors[0]);
          }
        }
      } else {
        onToggleSnackBar();
        setSnackbarContent("Document picker canceled or no files selected");
      }
    } catch (error) {
      onToggleSnackBar();
      console.log(error.message);
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

  const validateImportedData = (data, type) => {
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
  };

  console.log("Snack bar data ", snackbarContent);
  console.log("Snack bar boolean ", showSnackbar);

  return (
    <SafeAreaView style={{ height: 100, flex: 1 }}>
      <AppHeader title="Upload JSON file" navigation={navigation} isMenuNeeded={false}/>
      <View style={{ margin: 15, flex: 1, justifyContent: "space-between" }}>
        <View>
          <View style={{ paddingBottom: 10 }}>
            <MyText
              variant="bodyLarge"
              style={{ fontWeight: "bold", color: allColors.universalColor }}
            >
              File upload instructions
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ fontWeight: "bold", color: allColors.universalColor }}
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
              style={{ fontWeight: "bold", color: allColors.universalColor }}
            >
              Please ensure the file is properly formatted before uploading
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ fontWeight: "bold", color: allColors.universalColor }}
            >
              Below is an example for reference:
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {"[\n{"}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {'\t"amount" : "100",'}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {'\t"date" : "YYYY/MM/DD",'}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {'\t"desc" : "It is optional",'}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {'\t"name" : "The name of expense",'}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {
                '\t"paymentNetwork" : "Payment network, must match with existing card",'
              }
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {
                '\t"cardHolderName" : "Card holder name, must match with existing card",'
              }
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {'\t"type" : "Income",'}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {"},"}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {"// and more ..."}
            </MyText>
            <MyText
              variant="bodyMedium"
              style={{ color: allColors.universalColor }}
            >
              {"]"}
            </MyText>
          </View>
          <TouchableOpacity
            onPress={importFile}
            style={styles.button}
            activeOpacity={0.5}
            disabled={loading}
          >
            <MyText style={styles.buttonText} variant="bodyLarge">Attach file</MyText>
          </TouchableOpacity>
          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={allColors.universalColor}/>
              <MyText variant="bodyMedium" style={{ color: allColors.universalColor }} >
                Importing please wait...
              </MyText>
            </View>
          )}
        </View>
        {showSnackbar && (
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              margin: 5
            }}
          >
            <Feather name="info" size={20} color={allColors.warningColor} />
            <MyText style={{ color: allColors.warningColor }}>
              {snackbarContent}
            </MyText>
          </View>
        )}
      </View>
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
      fontWeight: "700",
    },
    loaderContainer: {
      // flex: 1,
      gap: 20,
      justifyContent: "center",
      alignItems: "center",
      height: 200,
      // width: '100%'
    },
  });

export default FileUploadScreen;
