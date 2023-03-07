import { View, Text } from "react-native";
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React from "react";

const AddExpense = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {
          navigation.goBack();
        }}/>
        <Appbar.Content title="Title" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
    </View>
  );
};

export default AddExpense;
