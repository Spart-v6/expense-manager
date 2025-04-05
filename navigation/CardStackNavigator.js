import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CardsScreen from "../screens/CardsScreen";
import PlusMoreCard from "../screens/PlusMoreCard";

const Stack = createNativeStackNavigator();

export default function CardStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CardsScreen" component={CardsScreen} />
      <Stack.Screen name="PlusMoreCard" component={PlusMoreCard} />
    </Stack.Navigator>
  );
}
