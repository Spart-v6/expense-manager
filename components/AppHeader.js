import { Appbar, Button } from "react-native-paper";
import { MD3DarkTheme as DefaultTheme } from "react-native-paper";
import React from "react";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const AppHeader = ({ title, isParent, navigation, isPlus }) => {
  return (
    <Appbar.Header style={{backgroundColor: theme.colors.primaryContainer}}>
      {
        isParent ? 
        <Button icon="menu" onPress={() => navigation.openDrawer()} textColor={theme.colors.primary}/>
        :
        <Button icon="arrow-left" onPress={() => navigation.goBack()} textColor={theme.colors.primary}/>
      }
      
      <Appbar.Content title={title} color={theme.colors.primary}/>
      { !isPlus &&  <Appbar.Action icon="magnify" onPress={() => {}} color={theme.colors.primary}/> }
    </Appbar.Header>
  );
};

export default AppHeader;
