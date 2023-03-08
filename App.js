import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import store from "./redux/store";
import { Provider } from "react-redux";

import DrawerNav from "./navigation/DrawerNav";
import AppStack from './navigation/AppStack';

const theme = {
  ...DefaultTheme,
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
