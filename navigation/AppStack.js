import React from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./DrawerNavigator";

const AppStack = () => {
  return (
    <NavigationContainer >
      <StatusBar backgroundColor="transparent" translucent />
      <View style={{ flex: 1, backgroundColor: 'green'}}>
        <DrawerNavigator />
      </View>
    </NavigationContainer>
  );
};

export default AppStack;
