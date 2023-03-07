import { Appbar } from "react-native-paper";
import { MD3DarkTheme as DefaultTheme } from "react-native-paper";
import React from "react";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const AppHeader = ({ options, route }) => {
  return (
    <Appbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      <Appbar.Content title={options?.headerTitle || "Home"} />
    </Appbar.Header>
  );
};

export default AppHeader;
