import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import React, { useState } from "react";
import { StyleSheet, useColorScheme, Keyboard, TouchableWithoutFeedback } from "react-native";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const PlusMoreHome = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const styles = makeStyles(theme, colorScheme);

  // States
  const [btnName, setBtnName] = useState("Add Expense");
  const [selectedButton, setSelectedButton] = useState("Income");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [amountTitle, setAmountTitle] = useState("");
  const [descriptionTitle, setDescriptionTitle] = useState("");

  // Functions
  const incomeExpenseBtns = (name) => {
    const isSelected = selectedButton === name;
    return (
      <Button
        onPress={() => setSelectedButton(name)}
        mode="contained"
        labelStyle={{ fontSize: 15 }}
        style={[styles.btn, isSelected && styles.selectedBtn]}
      >
        <Text style={[styles.textbtn, isSelected && styles.selectedText]}>
          {name}
        </Text>
      </Button>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Top Buttons */}
          <View style={styles.topButtons}>
            {incomeExpenseBtns("Income")}
            {incomeExpenseBtns("Expense")}
          </View>

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <TextInput
              mode="flat"
              style={styles.input}
              selectionColor={theme[colorScheme].primary}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme[colorScheme].primary}
              placeholderTextColor={theme[colorScheme].onSurfaceVariant}
              autoComplete="off"
              textContentType="name"
              value={expenseTitle}
              placeholder="Expense name"
              onChangeText={(text) => setExpenseTitle(text)}
            />
            <TextInput
              mode="flat"
              style={styles.input}
              selectionColor={theme[colorScheme].primary}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme[colorScheme].primary}
              placeholderTextColor={theme[colorScheme].onSurfaceVariant}
              autoComplete="off"
              keyboardType="number-pad"
              value={amountTitle}
              placeholder="Amount"
              onChangeText={(text) => setAmountTitle(text)}
            />
            <TextInput
              mode="flat"
              style={styles.input}
              selectionColor={theme[colorScheme].primary}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor={theme[colorScheme].primary}
              placeholderTextColor={theme[colorScheme].onSurfaceVariant}
              autoComplete="off"
              textContentType="name"
              value={descriptionTitle}
              placeholder="Description"
              onChangeText={(text) => setDescriptionTitle(text)}
            />
          </View>

          <View style={styles.bottomButton}>
            <Button onPress={() => {}} mode="contained" style={styles.submitButton}>
              <Text style={styles.submitButtonText}>{btnName}</Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
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
      marginBottom: 40,
    },
    input: {
      backgroundColor: "transparent",
      borderBottomWidth: 2,
      borderColor: theme[colorScheme].primary,
      marginBottom: 25,
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
  });

export default PlusMoreHome;
