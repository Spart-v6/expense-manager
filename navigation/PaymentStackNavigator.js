import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaymentsScreen from "../screens/PaymentsScreen";
import PlusMorePayment from "../screens/PlusMorePayment";

const Stack = createNativeStackNavigator();

export default function PaymentStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
      <Stack.Screen name="PlusMorePayment" component={PlusMorePayment} />
    </Stack.Navigator>
  );
}
