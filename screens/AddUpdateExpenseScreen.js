import { View, StyleSheet } from "react-native";
import { TextInput, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

const styles = StyleSheet.create({
  input: {
    borderColor: "red",
    backgroundColor: "white",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

const AddUpdateExpenseScreen = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [amountValue, setAmountValue] = useState(0);
  return (
    <View>
      <View>
        <Text>Income</Text>
        <Text>Expense</Text>
      </View>
      <View>
        <TextInput
          style={{
            borderRadius: 50,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            margin: 20,
            borderColor: "brown",
            borderWidth: 2,
            backgroundColor: isFocused ? "#F5DEB3" : "#FCE5CD",
            color:"#FCE5CD",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          value={expenseName}
          placeholder="Expense name"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={val =>setExpenseName(val)}
        />
        <TextInput
          style={{
            borderRadius: 50,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            margin: 20,
            borderColor: "brown",
            borderWidth: 2,
            backgroundColor: isFocused ? "#F5DEB3" : "#FCE5CD",
            color:"#FCE5CD",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          keyboardType="phone-pad"
          value={amountValue}
          placeholder="Amount"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={val => setAmountValue(val)}
        />
      </View>
    </View>
  );
};

export default AddUpdateExpenseScreen;
