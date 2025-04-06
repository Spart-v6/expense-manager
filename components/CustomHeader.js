import React from "react";
import { Appbar } from "react-native-paper";
import { DrawerActions, useNavigationState } from "@react-navigation/native";
import { getDeepestRouteName } from "../helper/getRouteNames";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { goBack } from "../navigation/RootNavigation";


const routeConfig = {
  "Home": ['HomeScreen', 'Home'],
  "Settings": ['SettingsScreen', 'Settings'],
  "Cards": ['CardsScreen', 'Cards'],
  "Payments": ['PaymentsScreen', 'Payments'],
  "Split": ['SplitScreen', 'Split'],
  // All 'goBack()' screen cases
  "Add expenses": ['PlusMoreHome'], 
  "Add cards ": ['PlusMoreCard'], 
};

const getRouteInfo = (currentRoute) => {
  for (const [key, values] of Object.entries(routeConfig)) {
    
    if (values.includes(currentRoute)) {
      return key;
    }
  }
  return currentRoute || "";
};

const CustomHeader = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const navState = useNavigationState((state) => state);
  const currentRoute = getDeepestRouteName(navState);

  
  const routeKey = getRouteInfo(currentRoute);
  const showMenu = ['Home', 'Settings', 'Cards', 'Payments', 'Split'].includes(routeKey); // these screens to show menu
  const showBack = currentRoute.includes('PlusMore'); // these screens to show back button
  const showSearch = routeKey === 'Home'; // show search icon only on Home screen
  
  return (
    <Appbar.Header style={{ backgroundColor: theme.dark.surfaceDim }}>
      {showMenu && !showBack && (
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      )}
      {showBack && (
        <Appbar.Action icon="keyboard-backspace" onPress={goBack} />
      )}

      <Appbar.Content title={routeKey} />

      {showSearch && (
        <Appbar.Action icon="magnify" onPress={() => console.log("Search tapped")} />
      )}
    </Appbar.Header>
  );
};

export default CustomHeader;
