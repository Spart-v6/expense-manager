import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import React, { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const PlusMoreHome = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();
  const styles = makeStyles(theme);

  // States
  const [btnName, setBtnName] = useState("Add Expense");
  const [selectedButton, setSelectedButton] = useState("Income");
  const [expenseName, setExpenseName] = useState("");


  // Functions
  const incomeExpenseBtns = name => {
    return (
      <Button
        onPress={() =>
          name === "Income"
            ? setSelectedButton("Income")
            : setSelectedButton("Expense")
        }
        mode="outlined"
        labelStyle={{ fontSize: 15 }}
        style={[styles.btn, selectedButton === name && styles.selected]}
      >
        <Text
          style={[
            styles.textbtn,
            selectedButton === name && styles.selected.text,
          ]}
        >
          {name}
        </Text>
      </Button>
    );
  };


  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {incomeExpenseBtns("Income")}
        {incomeExpenseBtns("Expense")}
          <Button onPress={() => {}} mode="contained">
            <Text
              style={{
                color: theme.dark.onPrimary,
                fontSize: 20,
                lineHeight: 35,
              }}
            >
              {btnName}
            </Text>
          </Button>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    btn: {
      borderColor: "transparent",
      borderRadius: 10,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    selected: {
      borderColor: theme.dark.onPrimary,
      borderWidth: 1,
      borderRadius: 20,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      text: {
        color: theme.dark.onPrimary,
      },
    },
    textbtn: {
      color: theme.dark.onPrimary,
    },
  });


export default PlusMoreHome;
