import React from "react";
import { Appbar } from "react-native-paper";
import { DrawerActions } from "@react-navigation/native";
import { useNavigationState } from "@react-navigation/native";
import { getDeepestRouteName } from "../helper/getRouteNames";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { goBack } from '../navigation/RootNavigation';

const CustomHeader = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();

  const navState = useNavigationState((state) => state);
  const currentRoute = getDeepestRouteName(navState);

  const shouldShowMenuIcon =
    currentRoute === "HomeScreen" || currentRoute === "Settings";

  const shouldShowBackIcon = currentRoute === "PlusMoreHome";

  return (
    <Appbar.Header style={{ backgroundColor: theme.dark.surfaceDim }}>
      {shouldShowMenuIcon && (
        <Appbar.Action
          icon="menu"
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        />
      )}
      {shouldShowBackIcon && (
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={goBack}
        />
      )}
      <Appbar.Content title={currentRoute === "HomeScreen" ? "Home" : currentRoute || ""} />
    </Appbar.Header>
  );
};

export default CustomHeader;
