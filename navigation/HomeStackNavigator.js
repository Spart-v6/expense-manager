import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PlusMoreHome from "../screens/PlusMoreHome";
import SearchScreen from "../screens/SearchScreen";
import TransactionsListScreen from "../screens/TransactionsListScreen";

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PlusMoreHome" component={PlusMoreHome} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="TransactionsList" component={TransactionsListScreen} />
    </Stack.Navigator>
  );
}
