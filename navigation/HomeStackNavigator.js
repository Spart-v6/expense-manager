import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import PlusMoreHome from "../screens/PlusMoreHome";

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: {backgroundColor: 'black'}, animation: "fade_from_bottom" }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PlusMoreHome" component={PlusMoreHome} />
    </Stack.Navigator>
  );
}
