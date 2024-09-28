import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FAB, Dialog, Portal, Snackbar, Divider, ActivityIndicator } from "react-native-paper";
import { HomeHeader, ExpensesList } from "../components";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addData, addRecentTransactions, storeCard } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import { IconComponent } from "../components/IconPickerModal";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import RecentTransaction from "../components/RecentTransaction";
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';
import { useFocusEffect } from "@react-navigation/native";
import Animated, { SlideInRight, SlideOutRight, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import moment from "moment";

const AppHeaderMemoized = React.memo(AppHeader);

const HomeScreen = ({ navigation, route }) => {
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
  const onToggleSnackBar = () => setShowSnackbar(!showSnackbar);
  const onDismissSnackBar = () => setShowSnackbar(false);
  // Snackbar variables ends

  const [onUpload, setOnUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const showDialog = () => setOnUpload(true);
  const hideDialog = () => setOnUpload(false);

  const importFile = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json'],
        // type: ['text/csv', 'application/json'], // Allowing both CSV and JSON 
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const mimeType = result.assets[0].mimeType;
        const fileSize = result.assets[0].size;

        // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
        if (fileSize > 5 * 1024 * 1024) {
          hideDialog();
          onToggleSnackBar();
          setSnackbarContent("The file is too large. Please upload a file smaller than 5MB");
          return;
        }

        const fileContent = await fetch(fileUri).then(res => res.text());

        if (mimeType === 'application/json') {
          hideDialog();

          const jsonData = JSON.parse(fileContent);
          validateImportedData(jsonData, "json");

          onToggleSnackBar();
          if(!gotchaError) setSnackbarContent("JSON file has been uploaded and processed successfully");
        }
      } else {
        hideDialog();
        onToggleSnackBar();
        setSnackbarContent("Document picker canceled or no files selected");
      }
    } catch (error) {
      hideDialog();
      onToggleSnackBar();
      console.log(error.message);
      setSnackbarContent("Error importing file ", error);

    } finally {
      setLoading(false);
    }
  };


  // #region =========== Fetching card details here (required for validting imported data)
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
  
    if (type === 'json') {
      const validCardsMap = new Map();
      cardsData.forEach(card => {
        if (!validCardsMap.has(card.paymentNetwork)) {
          validCardsMap.set(card.paymentNetwork, new Set());
        }
        validCardsMap.get(card.paymentNetwork).add(card.cardHolderName);
      });
  
      const isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;
      const hasSingleEmptyObject = data.length === 1 && isEmptyObject(data[0]);
  
      if (hasSingleEmptyObject) {
        validationErrors.push(`Error: No data to add.`);
      } else {
        data.forEach(expense => {
          const { paymentNetwork: selectedCard, cardHolderName: card_h_name, amount, name, desc, date, type } = expense;
  
          if (!validCardsMap.has(selectedCard)) {
            validationErrors.push(`Error: "${selectedCard}" does not exist in the card details.`);
            return;
          }
          
          if (!validCardsMap.get(selectedCard).has(card_h_name)) {
            validationErrors.push(`Error: Imported card holder name "${card_h_name}" and payment network "${selectedCard}" do not match existing card details.`);
            return;
          }
  
          if (isNaN(amount) || amount <= 0 || amount.length > 9) {
            validationErrors.push(`Error: Amount "${amount}" in expenseData is not a positive number or is greater than 9 digits.`);
          }
  
          if (date && date.trim() !== "" && !moment(date, "YYYY/MM/DD", true).isValid()) {
            validationErrors.push(`Error: Date "${date}" in expenseData is not in the correct format.`);
          }
  
          if (type !== "Income" && type !== "Expense") {
            validationErrors.push(`Error: Type "${type}" in expenseData is not either "Income" or "Expense"`);
          }
  
          if (!name || name.length === 0) {
            validationErrors.push(`Error: Name "${name}" in expenseData is either empty or is undefined`);
          }
        });
      }
    }

    if (validationErrors.length > 0) {
      setGotchaError(true);
      setSnackbarContent(validationErrors.join("\n"));
      onToggleSnackBar();
      return;
    } else {
      insertImportedData(data, type);
    }
  };

  const insertImportedData = (data, type) => {
    const getCardId = (cardHolderName, paymentNetwork) => {
      const card = cardsData.find(card => card.cardHolderName === cardHolderName && card.paymentNetwork === paymentNetwork);
      return card ? card.id : -1;
    };
  
    let timeOffset = 0;
    let allExpenses = [];
    let recentTransactions = [];
  
    data.forEach(expense => {
      const { paymentNetwork: selectedCard, cardHolderName: card_h_name, amount, name, desc, date, type } = expense;
  
      const selectedCardId = getCardId(card_h_name, selectedCard);
      const currentTime = moment().add(timeOffset, 'seconds').format("HH:mm:ss");
  
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
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeaderMemoized
        title="Home"
        isParent={true}
        navigation={navigation}
        isHome
        needSearch={true}
        onUpload={onUpload}
        setOnUpload={setOnUpload}
      />
      <ScrollView>
        <AnimatedEntryScreen>
          <HomeHeader />
          <View style={{margin: 16, gap: 10, marginTop: 0}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <MyText style={{padding: 15, paddingLeft: 0, color: allColors.universalColor}} variant="titleMedium">
                Recently added
              </MyText>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10
                }}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("AllExpensesScreen")}
              >
                <MyText variant="titleMedium" style={{ color: allColors.universalColor}}>View all</MyText>
                <IconComponent
                  name={"arrow-right"}
                  category={"Octicons"}
                  color={allColors.addBtnColors}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <RecentTransaction/>
          </View>
        </AnimatedEntryScreen>
      </ScrollView>
      <FAB
        animated
        icon="plus"
        color={allColors.universalColor}
        onPress={() => navigation.navigate("PlusMoreHome")}
        mode="elevated"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        customSize={70}
      />
    <Portal>
    <Dialog
      visible={onUpload}
      onDismiss={hideDialog}
      style={{
        backgroundColor: allColors.backgroundColorLessPrimary,
        overflow: "hidden"
      }}
      theme={{
        colors: {
          backdrop: "#00000099",
        },
      }}
    >
        <>
          {/* First Dialog Content */}
          {step === 1 && (
            <Animated.View
              entering={SlideInLeft.duration(300)}
              exiting={SlideOutLeft.duration(300)}
            >
              <Dialog.Title style={{ color: allColors.universalColor }}>Upload a JSON file</Dialog.Title>
              <Divider />
              <Dialog.Content style={{ paddingTop: 10 }}>
                <MyText variant="bodyLarge" style={{ fontWeight: 'bold', color: allColors.universalColor }}>File upload instructions</MyText>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>1. Type of Expense (Income or Expense)</MyText>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>2. Expense name</MyText>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>3. Amount</MyText>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>4. Description (optional)</MyText>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>5. Date (Current date will be used if not provided)</MyText>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>6. Payment network (Card name and payment network must match exactly in Accounts)</MyText>
                <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>Note: Only files up to 5MB can be uploaded.</MyText>
              </Dialog.Content>
              <Dialog.Actions>
                <TouchableOpacity onPress={nextStep} style={styles.button} activeOpacity={0.5}>
                  <MyText style={styles.buttonText}>Next</MyText>
                </TouchableOpacity>
              </Dialog.Actions>
            </Animated.View>
          )}

          {/* Second Dialog Content */}
          {step === 2 && (
            <Animated.View
              entering={SlideInRight.duration(300)}
              exiting={SlideOutRight.duration(300)}
            >
              <Dialog.Title style={{ color: allColors.universalColor }}>File Upload Format</Dialog.Title>
              <Divider />
              <Dialog.Content style={{ paddingTop: 10 }}>
                {loading ? 
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={allColors.universalColor} />
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>Importing please wait...</MyText>
                  </View>
                : (
                  <>
                    <MyText variant="bodyMedium" style={{ fontWeight: 'bold', color: allColors.universalColor }}>Please ensure the file is properly formatted before uploading.</MyText>
                    <MyText variant="bodyMedium" style={{ fontWeight: 'bold', color: allColors.universalColor }}>Below is an example for reference:</MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>{'[{'}</MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}> {'"amount" : "100",'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}> {'"date" : "YYYY/MM/DD",'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}> {'"desc" : "It is optional",'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}> {'"name" : "The name of expense",'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}> {'"paymentNetwork" : "Payment network, must match with existing card",'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}> {'"cardHolderName" : "Card holder name, must match with existing card",'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}> {'"type" : "Income",'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>,</MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>{'// and more ...'} </MyText>
                    <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>{']'} </MyText>
                  </>
                  )}
                </Dialog.Content>
                <Dialog.Actions style={{ gap: 10 }}>
                  <TouchableOpacity onPress={previousStep} style={styles.button} activeOpacity={0.5} disabled={loading}>
                    <MyText style={styles.buttonText}>Back</MyText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={importFile} style={styles.button} activeOpacity={0.5} disabled={loading}>
                    <MyText style={styles.buttonText}>Attach file</MyText>
                  </TouchableOpacity>
                </Dialog.Actions>
            </Animated.View>
          )}
        </>
    </Dialog>
    </Portal>
      <Snackbar
        visible={showSnackbar}
        onDismiss={onDismissSnackBar}
        duration={5000}
        style={{backgroundColor: allColors.backgroundColorQuinary, height: 50}}
        action={{
          label: "Dismiss",
          onPress: () => {
            onDismissSnackBar();
          },
        }}
      >
        {snackbarContent}
      </Snackbar>
    </SafeAreaView>
  );
};

const makeStyles = allColors =>
  StyleSheet.create({
    button: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: allColors.textColorSecondary,
      fontSize: 16,
      fontWeight: '700',
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

export default HomeScreen;
