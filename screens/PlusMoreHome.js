import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from 'date-fns';
import IconComponent from "../components/IconComponent";


const PlusMoreHome = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();
  const styles = makeStyles(theme, colorScheme);

  const [btnName, setBtnName] = useState("Add Expense");
  const [selectedButton, setSelectedButton] = useState("Income");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [amountTitle, setAmountTitle] = useState("");
  const [descriptionTitle, setDescriptionTitle] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await AsyncStorage.getItem("cards");
        const parsedData = data ? JSON.parse(data) : [];
        setCardsData(parsedData);
      } catch (error) {
        console.error("Failed to load cards", error);
      }
    };
    loadCards();
  },[]);
  

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Top Buttons */}
          <View style={styles.toggleGroup}>
            <Button
              icon="cash-plus"
              mode={selectedButton === "Income" ? "contained" : "outlined"}
              onPress={() => setSelectedButton("Income")}
              style={styles.toggleBtn}
              labelStyle={styles.toggleLabel}
            >
              Income
            </Button>
            <Button
              icon="cash-minus"
              mode={selectedButton === "Expense" ? "contained" : "outlined"}
              onPress={() => setSelectedButton("Expense")}
              style={styles.toggleBtn}
              labelStyle={styles.toggleLabel}
            >
              Expense
            </Button>
          </View>


          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <TextInput
              mode="outlined"
              label="Expense Name"
              placeholder="e.g., Groceries"
              value={expenseTitle}
              onChangeText={setExpenseTitle}
              style={styles.input}
              left={<TextInput.Icon icon="tag-text-outline" />}
            />
            <TextInput
              mode="outlined"
              label="Amount"
              placeholder="e.g., 1250"
              value={amountTitle}
              onChangeText={setAmountTitle}
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="currency-inr" />}
            />
            <TextInput
              mode="outlined"
              label="Description"
              placeholder="Optional note"
              value={descriptionTitle}
              onChangeText={setDescriptionTitle}
              style={styles.input}
              left={<TextInput.Icon icon="text" />}
            />
          </View>
          <View>
            {/* Card Selector */}
            <Text style={styles.sectionTitle}>Select Card</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
              {cardsData.map((card) => {
                const isSelected = selectedCardId === card.id;
                const formattedExpiryDate = format(parseISO(card.expiryDate), "MM-yy");
                return (
                  <TouchableWithoutFeedback key={card.id} onPress={() => setSelectedCardId(card.id)}>
                    <View
                      style={[
                        styles.cardItem,
                        {
                          backgroundColor: isSelected
                            ? theme[colorScheme].primary
                            : theme[colorScheme].surfaceDim,
                          elevation: isSelected ? 4 : 2,
                        },
                      ]}
                    >
                      <Text style={[isSelected ? styles.cardTitle : {color: theme.dark.primary }]}>{card.name}</Text>
                      <Text style={[isSelected ? styles.cardDetails : {color: theme.dark.primary }]}>**** {card.last4Digits}</Text>
                      <Text style={[isSelected ? styles.cardDetails : {color: theme.dark.primary }]}>{formattedExpiryDate}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </ScrollView>

            {/* Date Picker */}
            <Text style={styles.sectionTitle}>Select Date</Text>
            <Button
              onPress={() => setShowDatePicker(true)}
              mode="outlined"
              icon="calendar"
              textColor={theme[colorScheme].primary}
              style={styles.dateButton}
            >
              {selectedDate.toDateString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
                textColor="red"
              />
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.bottomButton}>
            <Button
              onPress={async () => {
                // Validation
                if (!expenseTitle.trim() || !amountTitle.trim() || !descriptionTitle.trim() || !selectedCardId) {
                  setSnackbarMessage("All fields must be filled out.");
                  setSnackbarVisible(true);
                  return;
                }

                if (isNaN(amountTitle)) {
                  setSnackbarMessage("Amount must be a number.");
                  setSnackbarVisible(true);
                  return;
                }

                const newTransaction = {
                  id: Date.now().toString(),
                  type: selectedButton, // Income or Expense
                  title: expenseTitle,
                  amount: parseFloat(amountTitle),
                  description: descriptionTitle,
                  cardId: selectedCardId,
                  date: selectedDate.toISOString(), // Storing date in string format
                };

                try {
                  const existingData = await AsyncStorage.getItem("transactions");
                  const parsedData = existingData ? JSON.parse(existingData) : [];
                  const updatedData = [newTransaction, ...parsedData];
                  await AsyncStorage.setItem("transactions", JSON.stringify(updatedData));

                  // Optional: Clear form fields after saving
                  setExpenseTitle("");
                  setAmountTitle("");
                  setDescriptionTitle("");
                  setSelectedCardId(null);
                  setSelectedDate(new Date());

                  setSnackbarMessage("Transaction added successfully.");
                  setSnackbarVisible(true);
                  navigation.goBack();
                } catch (error) {
                  setSnackbarMessage("Failed to save transaction.");
                  setSnackbarVisible(true);
                  console.error("AsyncStorage Error: ", error);
                }
              }}
              mode="contained"
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>{btnName}</Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const makeStyles = (theme, colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    topButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
      marginBottom: 30,
    },
    btn: {
      borderColor: theme[colorScheme].outline,
      borderWidth: 2,
      borderRadius: 12,
      backgroundColor: "transparent",
      flex: 1,
      marginHorizontal: 5,
    },
    selectedBtn: {
      backgroundColor: theme[colorScheme].primary,
      borderColor: theme[colorScheme].primary,
    },
    textbtn: {
      color: theme[colorScheme].onSurfaceVariant,
      textAlign: "center",
    },
    selectedText: {
      color: theme[colorScheme].onPrimary,
    },
    inputsContainer: {
      marginBottom: 20,
    },
    input: {
      backgroundColor: "transparent",
      borderBottomWidth: 2,
      borderColor: theme[colorScheme].primary,
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 8,
      color: theme[colorScheme].onSurface,
    },
    cardScroll: {
      marginBottom: 20,
    },
    cardItem: {
      padding: 16,
      marginRight: 12,
      borderRadius: 12,
      minWidth: 160,
    },
    cardTitle: {
      color: theme[colorScheme].surface,
      fontWeight: "600",
      marginBottom: 4,
    },
    cardDetails: {
      color: theme[colorScheme].shadow,
    },
    dateButton: {
      borderColor: theme[colorScheme].outline,
      marginBottom: 20,
    },
    bottomButton: {
      marginTop: "auto",
      marginBottom: 20,
    },
    submitButton: {
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: theme[colorScheme].primary,
    },
    submitButtonText: {
      color: theme[colorScheme].onPrimary,
      fontSize: 18,
      textAlign: "center",
    },
    toggleGroup: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 24,
      gap: 12,
    },
    toggleBtn: {
      flex: 1,
      borderRadius: 12,
    },
    toggleLabel: {
      fontSize: 15,
      fontWeight: "500",
    },
    input: {
      marginBottom: 20,
      backgroundColor: theme[colorScheme].surface,
    },
  });

export default PlusMoreHome;
