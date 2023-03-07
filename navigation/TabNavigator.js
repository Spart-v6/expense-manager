import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Portal, FAB } from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import AddUpdateExpenseScreen from "../screens/AddUpdateExpenseScreen";
import AccountsScreen from "../screens/AccountsScreen";
import AccountCardScreen from "../screens/AccountCardScreen";
import AppHeader from "../components/AppHeader";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const StackAboveScreens = (props) => {
  let nameOfParentScreen = props?.route?.params?.value;
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name={nameOfParentScreen === "HomeScr" ? "HomeScreen" : "AccountsScreen"}
        component={nameOfParentScreen === "HomeScr" ? HomeScreen : AccountsScreen }
        options={({ navigation }) => ({
          title: `${nameOfParentScreen === "HomeScr" ? "Home" : "Accounts"}`,
          headerLeft: () => (
            <Ionicons
              name={"md-menu"}
              size={24}
              style={{ marginLeft: 10 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name="AddUpdateExpenseScreen"
        component={AddUpdateExpenseScreen}
        options={{ headerTitle: "Add Expense" }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  return (
    <>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        shifting={true}
        sceneAnimationEnabled={true}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: "#AD40AF" },
          tabBarInactiveTintColor: "#fff",
          tabBarActiveTintColor: "yellow",
        }}
      >
        <Tab.Screen
          name="Home"
          component={StackAboveScreens}
          options={{ 
            tabBarIcon: "home-account",
          }}
          initialParams={{ value: "HomeScr" }}
        />
        <Tab.Screen
          name="Accounts"
          component={StackAboveScreens}
          options={{
            tabBarIcon: "message-text-outline",
          }}
          initialParams={{ value: "AccScr" }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;
