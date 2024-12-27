import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import useDynamicColors from "../commons/useDynamicColors";
import { exportExpenseData, exportCardsData, exportDataToFileInDownloadsDir } from "../commons/exportData";

const ExportFileScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const [loading, setLoading] = React.useState(false);

  const exportExpenses = async () => {
    setLoading(true);
    const expensesFileData = await exportExpenseData();
    const expenseDataSavedLocation = await exportDataToFileInDownloadsDir(expensesFileData, "expenses_data");
    setLoading(false);
  }

  const exportCards = async () => {
    setLoading(true);
    const cardsFileData = await exportCardsData();
    const cardsDataSavedLocation = await exportDataToFileInDownloadsDir(cardsFileData, "cards_data");
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Export JSON file"
        navigation={navigation}
        isMenuNeeded={false}
        isParent={true}
      />
      <View style={{ marginLeft: 30, marginRight: 30, marginTop: 20 }}>
        <View style={{ flexDirection: "column", gap: 10 }}>
          <View>
            <MyText style={{ color: allColors.universalColor }}>
              Export your data to JSON file in a few simple steps
            </MyText>
            <MyText style={{ color: allColors.universalColor }}>
              Your data is safe and will be stored securely on your device.
            </MyText>
            <MyText style={{ color: allColors.universalColor }}>
              You can import exported data anytime via Import Data option in the
              app.
            </MyText>
            <MyText variant="bodyMedium" style={{ color: allColors.universalColor, marginTop: 10 }}>
                <MyText style={{ fontWeight: 'bold', color: allColors.universalColor }}>Note:</MyText> When exporting expenses, make sure to export card data as well.
            </MyText>
                <MyText style={{ color: allColors.universalColor}}>Expenses rely on specific cards for proper mapping.</MyText>
          </View>
          <TouchableOpacity
            onPress={exportExpenses}
            style={styles.button}
            activeOpacity={0.5}
            disabled={loading}
          >
            <MyText style={styles.buttonText} variant="bodyLarge">
              Export expenses
            </MyText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={exportCards}
            style={styles.button}
            activeOpacity={0.5}
            disabled={loading}
          >
            <MyText style={styles.buttonText} variant="bodyLarge">
              Export cards
            </MyText>
          </TouchableOpacity>
        </View>
        <MyText style={styles.feedback} variant="bodySmall">
          Export might take time if data is large.
        </MyText>
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
      marginTop: 20,
    },
    buttonText: {
      color: allColors.backgroundColorPrimary,
    },
    feedback: {
      fontSize: 14,
      textAlign: "center",
      color: "#666",
      marginBottom: 20,
      marginTop: 10
    },
  });

export default ExportFileScreen;
