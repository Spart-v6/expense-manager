import { Appbar, Button } from "react-native-paper";
import { MD3DarkTheme as DefaultTheme } from "react-native-paper";
import React from "react";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const AppHeader = ({ title, isParent, navigation }) => {
  return (
    <Appbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      {
        isParent ? 
        <Button icon="menu" onPress={() => navigation.openDrawer()}/>
        :
        <Button icon="arrow-left" onPress={() => navigation.goBack()}/>
      }
      
      <Appbar.Content title={title} />
      <Appbar.Action icon="magnify" onPress={() => {}} />
    </Appbar.Header>
  );
};

export default AppHeader;
