import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import AppHeader from "../components/AppHeader";

const PlusMoreHome = ({navigation}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Add Expenses" navigation={navigation}/>
      <View>
        <Text>Plus more homesss!!!!!!! </Text>
      </View>
    </SafeAreaView>
  );
};

export default PlusMoreHome;
