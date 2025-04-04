import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import BottomTabNavigator from "./BottomTabNavigator";
import SettingsScreen from "../screens/SettingsScreen";
import CustomDrawer from "../components/CustomDrawer";
import CustomHeader from "../components/CustomHeader";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={({ route, navigation }) => {
        let activeRouteName = getFocusedRouteNameFromRoute(route);

        if (!activeRouteName && route.name === "Main") activeRouteName = "Home";
        if (route.name === "Settings") {
          activeRouteName = "Settings";
        }

        return {
          header: () => (
            <CustomHeader navigation={navigation} currentRoute={activeRouteName} />
          ),
          drawerStyle: { width: 240 }
        };
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Main" component={BottomTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
