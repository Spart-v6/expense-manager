import { View, Text } from "react-native";
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React from "react";

const AddUpdateExpenseScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View>
        <Text>Income</Text>
        <Text>Expense</Text>
      </View>
      <View>
        <TextInput/>
      </View>
    </View>
  );
};

export default AddUpdateExpenseScreen;
