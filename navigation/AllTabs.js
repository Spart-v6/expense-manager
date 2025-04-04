import React from "react";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import HomeStackNavigator from "./HomeStackNavigator";
import CardStackNavigator from "./CardStackNavigator";
import PaymentsScreen from "../screens/PaymentsScreen";
import SplitScreen from "../screens/SplitScreen";
import HomeScreen from "../screens/HomeScreen";
import CardsScreen from "../screens/CardsScreen";

const Tab = createNativeBottomTabNavigator();
const TabArr = [
  {
    label: "Home",
    icon: "../assets/home.svg",
    component: HomeScreen,
  },
  {
    label: "Cards",
    icon: "../assets/card.svg",
    component: CardsScreen,
  },
  {
    label: "Split",
    icon: "../assets/share.svg",
    component: SplitScreen,
  },
  {
    label: "Bills",
    icon: "../assets/loop.svg",
    component: PaymentsScreen,
  },
];

const AllTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.label}
            component={item.component}
            options={{
                tabBarIcon: () => require("../assets/card.svg"),
            }}
          />
        );
      })}
    </Tab.Navigator>

    // <Tab.Navigator
    //   screenOptions={{
    //     tabBarActiveTintColor: theme.dark.primary,
    //   }}
    //   hapticFeedbackEnabled
    //   labeled
    // >
    //   <Tab.Screen
    //     name="Home"
    //     component={HomeStackNavigator}
    //     options={{
    //       tabBarIcon: () => require("../assets/home.svg"),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Cards"
    //     component={CardStackNavigator}
    //     options={{
    //       tabBarIcon: () => require("../assets/card.svg"),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Split"
    //     component={SplitScreen}
    //     options={{
    //       tabBarIcon: () => require("../assets/share.svg"),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Payments"
    //     component={PaymentsScreen}
    //     options={{
    //       tabBarIcon: () => require("../assets/loop.svg"),
    //     }}
    //   />
    // </Tab.Navigator>
  );
};

export default AllTabs;
