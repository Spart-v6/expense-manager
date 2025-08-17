import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplitScreen from "../screens/SplitScreen";
import PlusMoreSplit from "../screens/PlusMoreSplit";
import SplitDetailsScreen from "../screens/SplitDetailsScreen";
import PlusMoreSplitDetailScreen from "../screens/PlusMoreSplitDetailScreen";
import IndividualSplitScreen from "../screens/IndividualSplitScreen";

const Stack = createNativeStackNavigator();

export default function SplitStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplitScreen" component={SplitScreen} />
      <Stack.Screen name="PlusMoreSplit" component={PlusMoreSplit} />
      <Stack.Screen name="SplitDetailsScreen" component={SplitDetailsScreen} />
      <Stack.Screen name="PlusMoreSplitDetailScreen" component={PlusMoreSplitDetailScreen} />
      <Stack.Screen name="IndividualSplitScreen" component={IndividualSplitScreen} />
    </Stack.Navigator>
  );
}
