import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { FAB, Button, Dialog, Portal, Snackbar } from "react-native-paper";
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
  const onToggleSnackBar = () => setShowSnackbar(!showSnackbar);
  const onDismissSnackBar = () => setShowSnackbar(false);
  // Snackbar variables ends

  const [onUpload, setOnUpload] = useState(false);
  const showDialog = () => setOnUpload(true);
  const hideDialog = () => setOnUpload(false);

  const importFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json'], // Allowing both CSV and JSON 
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
  
        // if (mimeType === 'text/csv') {
        //   hideDialog();

        //   const parsedData = Papa.parse(fileContent, { header: true }).data;
        //   validateImportedData(parsedData, "csv");

        //   onToggleSnackBar();
        //   setSnackbarContent("CSV file has been uploaded and processed successfully");
        // } 
        if (mimeType === 'application/json') {
          hideDialog();

          const jsonData = JSON.parse(fileContent);
          validateImportedData(jsonData, "json");

          onToggleSnackBar();
          setSnackbarContent("JSON file has been uploaded and processed successfully");
        }
      } else {
        hideDialog();
        onToggleSnackBar();
        setSnackbarContent("Document picker canceled or no files selected");
      }
    } catch (error) {
      hideDialog();
      onToggleSnackBar();
      setSnackbarContent("Error importing file ", error);
    }
  };


  // #region =========== Fetching card details here (required for validting imported data)
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

  const validateImportedData = (data, type) => {
    if (type === 'csv') {
      console.log("Validating CSV Data");
      // TODO: This feature will be added in the future
    }
    if (type === 'json') {
      var gotchaError = false;
      console.log("Validating JSON Data");
      // data.forEach(item => {
      //   if (!validCardIds.has(item.accCardSelected)) {
      //     console.log(`Error: accCardSelected ${item.accCardSelected} in expenseData does not match any id in cardsData.`);
      //     // prolly need to import the name rather than the accCardSelected ID 
      //     // compare the name and the exact name should be preesnt in accounts page
      //     // if one or more than same name of card is present, throw exception that more than one cards with exact same name exist, please change the name
      //     // after getting the name of card from improted data, loop thru cardsData and find out the id of the given name
      //     // then formulate a new object to be pushed to expenseData (addData and addRecentData whtever action)  
              //
              // for time u can add each second to each expense when adding to the AsyncStorage, and add a random ID to each expense and if date is not provdied use today's date (ofc this all happens inside a loop of "data" array)
      //   }
      // })

      const validCardsMap = new Map();
      cardsData.forEach(card => {
        if (!validCardsMap.has(card.paymentNetwork)) {
          validCardsMap.set(card.paymentNetwork, new Set());
        }
        validCardsMap.get(card.paymentNetwork).add(card.cardHolderName);
      });

      data.forEach(expense => {
        const { selectedCard, card_h_name, amount, name, desc, date, type } = expense;

        // Validating selectedCard and card holder name
        if (validCardsMap.has(selectedCard)) {
          if (!validCardsMap.get(selectedCard).has(card_h_name)) {
            console.log(`Error: Imported card holder name "${card_h_name}" and payment network "${selectedCard}" do not match existing card details.`);
            gotchaError = true;
          }
        } else {
          gotchaError =  true;
          console.log(`Error: "${selectedCard}" does not exist in the card details.`);
        }

        // validating amount
        if (isNaN(amount) || amount <= 0 || amount.length > 9) {
          console.log(`Error: Amount "${amount}" in expenseData is not a positive number or is not less than 10 digits`);
          gotchaError = true;
        }

        // validating date
        if (date && date.trim() !== "" && !moment(date, "YYYY/MM/DD", true).isValid()) {
          console.log(`Error: Date "${date}" in expenseData is not in the correct format.`);
          gotchaError = true;
        }


        // validating type
        if (type !== "Income" && type !== "Expense") {
          console.log(`Error: Type "${type}" in expenseData is not either "Income" or "Expense"`);
          gotchaError = true;
        }

        // valdating name
        if(name === undefined || name.length === 0) {
          console.log(`Error: Name "${name}" in expenseData is either empty or is undefined`);
          gotchaError = true;
        }

      });

      if(!gotchaError) {
        insertImportedData(data, type);
      }


    }
    else return;
  }

  const insertImportedData = (data, type) => {
    console.log("Validation successful, inserting data");

    const getCardId =(cardHolderName, paymentNetwork) => {
      const card = cardsData.find(card => card.cardHolderName === cardHolderName && card.paymentNetwork === paymentNetwork);
      if (card) return card.id;
      else return -1;
    }
    
    let timeOffset = 0; 
    data.forEach(expense => {
      const { selectedCard, card_h_name, amount, name, desc, date, type } = expense;

      const selectedCardId = getCardId(selectedCard, card_h_name);

      // Calculate the time by adding timeOffset seconds to the current time
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

      dispatch(addData(expenseToBeInserted));
      dispatch(addRecentTransactions(expenseToBeInserted));

      timeOffset += 1;
    });

    // in this method u will add a random ID to the data object, 
    // fetch the id (and key will be accCardSelected) with given card_h_name and selectedCard from cardsData 
    // add each second to curent time to "time" key when today's data is provided else use today's date and time toh aise hi karna hai
    // 
    // 
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
      <Dialog visible={onUpload} onDismiss={hideDialog}>
        {/* First Dialog Content */}
        {step === 1 && (
          <Animated.View
            entering={SlideInRight.duration(100)}
            exiting={SlideOutRight.duration(100)}
          >
            <Dialog.Title>Upload a JSON file</Dialog.Title>
            <Dialog.Content>
              <MyText variant="bodyLarge">File upload instructions</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>1. Type of Expense (Income or Expense)</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>2. Expense name</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>3. Amount</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>4. Description (optional)</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>5. Date (Current date will be used if not provided)</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>6. Payment network (Card name and payment network must match exactly in Accounts)</MyText>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={nextStep}>Next</Button>
            </Dialog.Actions>
          </Animated.View>
        )}

        {/* Second Dialog Content */}
        {step === 2 && (
          <Animated.View
            entering={SlideInLeft.duration(100)}
            exiting={SlideOutLeft.duration(100)}
          >
            <Dialog.Title>File Upload Format</Dialog.Title>
            <Dialog.Content>
              <MyText variant="bodyMedium">Please ensure the file is properly formatted before uploading.</MyText>
              <MyText variant="bodyMedium">Below is an example for reference:</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>{'[{'}</MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}> {'"amount" : "100"'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}> {'"date" : "YYYY/MM/DD"'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}> {'"desc" : "It is optional"'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}> {'"name" : "The name of expense"'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}> {'"selectedCard" : "Should be existing card with exact name"'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}> {'"card_h_name" : "Card holder name, must match with existing card"'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}> {'"type" : "Income"'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>{'},'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>{'// and more ...'} </MyText>
              <MyText variant="bodyMedium" style={{ fontWeight: 'bold' }}>{']'} </MyText>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={previousStep}>Back</Button>
              <Button onPress={importFile}>Attach file</Button>
            </Dialog.Actions>
          </Animated.View>
        )}
      </Dialog>
    </Portal>
      <Snackbar
        visible={showSnackbar}
        onDismiss={onDismissSnackBar}
        duration={5000}
        style={{backgroundColor: allColors.backgroundColorQuinary}}
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

export default HomeScreen;
