import React from "react";
import { Appbar } from "react-native-paper";
import { DrawerActions } from "@react-navigation/native";

const CustomHeader = ({ navigation, currentRoute }) => {
  const shouldShowMenuIcon =
    currentRoute === "Home" || currentRoute === "Settings";

  return (
    <Appbar.Header>
      {shouldShowMenuIcon && (
        <Appbar.Action
          icon="menu"
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        />
      )}
      <Appbar.Content title={currentRoute || ""} />
    </Appbar.Header>
  );
};

export default CustomHeader;
