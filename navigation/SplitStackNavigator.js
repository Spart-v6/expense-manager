import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplitScreen from "../screens/SplitScreen";
import PlusMoreSplit from "../screens/PlusMoreSplit";

const Stack = createNativeStackNavigator();

export default function SplitStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplitScreen" component={SplitScreen} />
      <Stack.Screen name="PlusMoreSplit" component={PlusMoreSplit} />
    </Stack.Navigator>
  );
}
