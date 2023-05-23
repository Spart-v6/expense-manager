import "react-native-gesture-handler";
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import store from "./redux/store";
import { Provider } from "react-redux";
import { useEffect } from "react";

import AppStack from "./navigation/AppStack";

const theme = {
  ...DefaultTheme,
  version: 3,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
  },
};

const App = () => {

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppStack />
      </PaperProvider>
    </Provider>
  );
};

export default App;
