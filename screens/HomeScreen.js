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
import { useDispatch } from "react-redux";
import { storeCard } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import { IconComponent } from "../components/IconPickerModal";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import RecentTransaction from "../components/RecentTransaction";
import * as DocumentPicker from 'expo-document-picker';
import Papa from 'papaparse';

const AppHeaderMemoized = React.memo(AppHeader);

const HomeScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();

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
        type: ['text/csv', 'application/json'], // Allowing both CSV and JSON 
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
  
        if (mimeType === 'text/csv') {
          hideDialog();
          const parsedData = Papa.parse(fileContent, { header: true }).data;
          console.log("Parsed CSV Data: ", parsedData);
          onToggleSnackBar();
          setSnackbarContent("CSV file has been uploaded and processed successfully");
        } else if (mimeType === 'application/json') {
          hideDialog();
          const jsonData = JSON.parse(fileContent);
          console.log("Parsed JSON Data: ", jsonData);
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
      setSnackbarContent("Error importing file:", error);
    }
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
          <Dialog.Title>Upload a JSON or CSV file</Dialog.Title>
          <Dialog.Content>
            <MyText variant="bodyMedium">Alert: The contents of the file must include:</MyText>
            <MyText variant="bodyMedium" style ={{fontWeight: "bold"}}>1. Type of Expense</MyText>
            <MyText variant="bodyMedium" style ={{fontWeight: "bold"}}>2. Expense name</MyText>
            <MyText variant="bodyMedium" style ={{fontWeight: "bold"}}>3. Amount</MyText>
            <MyText variant="bodyMedium" style ={{fontWeight: "bold"}}>4. Description (optional)</MyText>
            <MyText variant="bodyMedium" style ={{fontWeight: "bold"}}>5. Date (If not provided current date will be used)</MyText>
            <MyText variant="bodyMedium" style ={{fontWeight: "bold"}}>6. Payment network (Card should be present in Accounts page)</MyText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={importFile}>Attach file</Button>
          </Dialog.Actions>
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
