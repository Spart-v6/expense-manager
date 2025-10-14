import React, { useEffect, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

const PlusMoreHome = ({ navigation, route }) => {
  const { item } = route.params;
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();
  const styles = makeStyles(theme, colorScheme);  

  const [btnName, setBtnName] = useState(() => {
    if (item && item.id) { // this im writing for Update expenses (reusing the same component)
      return "Update ";
    }
    return "Add ";
  });
  const [selectedButton, setSelectedButton] = useState(() => {
    if (item && item.type) {
      return item.type;
    }
    return "Expense";
  });
  const [expenseTitle, setExpenseTitle] = useState(() => {
    if (item && item.title) {
      return item.title;
    }
    return "";
  });
  const [amountTitle, setAmountTitle] = useState(() => {
    if (item && item.amount) {
      return item.amount.toString();
    }
    return "";
  });
  const [descriptionTitle, setDescriptionTitle] = useState(() => {
    if (item && item.description) {
      return item.description;
    }
    return "";
  });
  const [selectedCardId, setSelectedCardId] = useState(() => {
    if (item && item.cardId) {
      return item.cardId;
    }
    return null;
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    if (item && item.date) {
      return new Date(item.date);
    }
    return new Date();
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [cardsData, setCardsData] = useState([]);

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

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
            <Text style={styles.sectionTitle}>Select Card</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
              {cardsData.length <= 0 ? (
                  <View>
                    <Text style={{ color: theme[colorScheme].onSurface, textAlign: 'center' }}>
                      No cards available. Please add a card first.
                    </Text>

                  </View>
              ) : 
              cardsData.map((card) => {
                const isSelected = selectedCardId === card.id;
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
                          gap: 10
                        },
                      ]}
                    >
                      <Text style={[isSelected ? styles.cardTitle : {color: theme.dark.primary }]}>{card.name}</Text>
                      <Text style={[isSelected ? styles.cardDetails : {color: theme.dark.primary }]}>{card.last4Digits}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </ScrollView>

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

          <View style={styles.bottomButton}>
            <Button
              onPress={async () => {
                // Validation
                if (!expenseTitle.trim() || !amountTitle.trim() || !selectedCardId) {
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
                  id: item && item.id ? item.id : Date.now().toString(),
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
                  let updatedData;
                  if (item && item.id) {
                    // Update case
                    updatedData = parsedData.map((txn) =>
                      txn.id === item.id ? newTransaction : txn
                    );
                  } else {
                    // New transaction case
                    updatedData = [newTransaction, ...parsedData];
                  }
                  await AsyncStorage.setItem("transactions", JSON.stringify(updatedData));

                  // Optional: Clear form fields after saving (why optional? coz u are navigating back anyways so new screen will be opened next time with empty values)
                  setExpenseTitle("");
                  setAmountTitle("");
                  setDescriptionTitle("");
                  setSelectedCardId(null);
                  setSelectedDate(new Date());

                  setSnackbarMessage("Transaction added successfully.");
                  setSnackbarVisible(true);


                  // Adding/Keeping track of monthly summary expenses/income
                  const monthlySummaryData = await AsyncStorage.getItem("monthlySummary");
                  let summary = monthlySummaryData ? JSON.parse(monthlySummaryData) : {};

                  const dateObj = new Date(newTransaction.date);
                  const year = dateObj.getFullYear();
                  const month = dateObj.getMonth(); // 0 = Jan, 7 = Aug

                  // If year not in summary  initialize it
                  if (!summary[year]) {
                    summary[year] = Array(12).fill(null).map(() => ({ income: 0, expense: 0 }));
                  }

                  // Update corresponding month
                  // if (newTransaction.type === "Income") {
                  //   summary[year][month].income += newTransaction.amount;
                  // } else {
                  //   summary[year][month].expense += newTransaction.amount;
                  // }

                  if (item && item.id) {
                    // Update case

                    // Get old transaction's date
                    const oldDateObj = new Date(item.date);
                    const oldYear = oldDateObj.getFullYear();
                    const oldMonth = oldDateObj.getMonth();

                    // Ensure old year is initialized
                    if (!summary[oldYear]) {
                      summary[oldYear] = Array(12).fill(null).map(() => ({ income: 0, expense: 0 }));
                    }

                    // Subtract old transaction
                    if (item.type.toLowerCase() === "income") {
                      summary[oldYear][oldMonth].income -= item.amount;
                    } else {
                      summary[oldYear][oldMonth].expense -= item.amount;
                    }

                    // Add new transaction
                    if (newTransaction.type.toLowerCase() === "income") {
                      summary[year][month].income += newTransaction.amount;
                    } else {
                      summary[year][month].expense += newTransaction.amount;
                    }
                  } else {
                    // New transaction case
                    if (newTransaction.type.toLowerCase() === "income") {
                      summary[year][month].income += newTransaction.amount;
                    } else {
                      summary[year][month].expense += newTransaction.amount;
                    }
                  }

                  await AsyncStorage.setItem("monthlySummary", JSON.stringify(summary));

                  navigation.goBack();
                } catch (error) {
                  setSnackbarMessage("Failed to save transaction / monthly summary.");
                  setSnackbarVisible(true);
                  console.error("AsyncStorage Error: ", error);
                }
              }}
              mode="contained"
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>{btnName + selectedButton}</Text>
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
