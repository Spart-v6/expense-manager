import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import {
  exportCardsData,
  exportExpenseData,
  exportDataToFileInDownloadsDir,
} from "../commons/exportData";
import AppHeader from "../components/AppHeader";
import { Button, Dialog, Portal } from "react-native-paper";

const LegacyDataScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const [loading, setLoading] = React.useState(false);

  const [visible, setVisible] = React.useState(false);

  const [showStatus, setShowStatus] = React.useState("");

  const handleOpenDialogBox = () => {
    setVisible(true);
  }

  const handleExportExpenses = async () => {
    try {
      setLoading(true);
      const expensesFileData = await exportExpenseData();
      const loc = await exportDataToFileInDownloadsDir(expensesFileData, "expenses_data");
      const fileName = loc.split('/').pop();
      setShowStatus("Success. Expenses saved in your phone's storage as: " + fileName);
    } catch (error) {
      setShowStatus("Error", "Failed to export expenses. " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCards = async () => {
    try {
      setLoading(true);
      const cardsFileData = await exportCardsData();
      const loc = await exportDataToFileInDownloadsDir(cardsFileData, "cards_data");
      const fileName = loc.split('/').pop();
      setShowStatus("Success. Cards saved in your phone's storage as: " + fileName);
    } catch (error) {
      setShowStatus("Error", "Failed to export cards. " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEverything = async () => {
    try {
      await AsyncStorage.clear();
      setShowStatus("Success", "All data deleted successfully.");
      navigation.replace("WelcomeNavigator");
      // TODO: add a Proceed button, check if both export expense/card is pressed, if yes then only enable is process button,
    } catch (error) {
      setShowStatus("Error", "Failed to delete data. " + error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={allColors.barStyle}
      />
      <AppHeader
        title="Legacy Data Management"
        navigation={navigation}
        isMenuNeeded={true}
        isParent={true}
      />
      <View style={{flex: 1, padding: 20, marginLeft: 15, marginRight: 15}}>
        <MyText
          variant="headlineMedium"
          style={{ color: allColors.universalColor }}
        >
          Important Update
        </MyText>
        <View style={{ gap: 10}}>
          <MyText
            variant="bodyMedium"
            style={{ color: allColors.universalColor }}
          >
            This version of the app brings significant updates to enhance your experience. To transition smoothly, you have two options:
          </MyText>
          <MyText>
            1. Export and Reimport Your Data: Export your expenses and cards to save them, then delete the old data in the app. After that, you can reimport your saved data.
          </MyText>
          <MyText>
            2. Start Fresh: If you don’t want to save your existing data, simply delete everything to begin with a clean slate.
          </MyText>
          <MyText>
            Please note that this app does not rely on any third-party storage systems or online connections. It operates entirely offline, relying solely on your phone’s internal storage to ensure your data remains private and secure.
          </MyText>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={handleExportCards}
            style={styles.button}
            activeOpacity={0.5}
            disabled={loading}
          >
            <MyText style={styles.buttonText} variant="bodyLarge">
              Export cards
            </MyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExportExpenses}
            style={styles.button}
            activeOpacity={0.5}
            disabled={loading}
          >
            <MyText style={styles.buttonText} variant="bodyLarge">
              Export expenses
            </MyText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleOpenDialogBox}
          >
            <MyText style={styles.buttonText}>Delete Everything</MyText>
          </TouchableOpacity>
        </View>
        <MyText variant="bodyMedium" style={{color: allColors.universalColor, marginBottom: 20}}>
         {showStatus}
        </MyText>
        <View>
          <MyText style={{ color: allColors.universalColor }}>
            Note: You will not be able to proceed without completing 
            above actions.
          </MyText>
        </View>
      </View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Title
            style={{
              color: allColors.textColorSecondary,
              fontFamily: "Karla_400Regular",
            }}
          >
            Delete everything?
          </Dialog.Title>
          <Dialog.Content>
            <MyText style={{ color: allColors.textColorSecondary }}>
              Are you sure you want to delete everything? 
            </MyText>
            <MyText>
              This action cannot be undone.
            </MyText>
            <MyText>
              Please make sure you have exported expenses and cards if needed
            </MyText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDeleteEverything}>
              <MyText style={{ color: allColors.textColorPrimary }}>
                OK
              </MyText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const makeStyles = (allColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    deleteButton: {
      width: "80%",
      padding: 15,
      backgroundColor: allColors.errorColor,
      borderRadius: 15,
      alignItems: "center",
      marginVertical: 20,
    },
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
      marginTop: 20,
    },
    buttonText: {
      color: allColors.backgroundColorPrimary,
      fontWeight: "700",
    },
  });

export default LegacyDataScreen;
