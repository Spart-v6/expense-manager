import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { BottomNav } from "./components/BottomNav";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import store from "./redux/store";
import { Provider } from "react-redux";

// @Component
import AddExpense from "./screens/AddExpense";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const Header = ({ options, route }) => {
  if(route.name !== "AddExpense")
  return (
    <Appbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      <Appbar.Content title={options?.headerTitle || "Home"} />
    </Appbar.Header>
  );
};

const App = () => {

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              header: ({ options, route }) => <Header options={options} route={route} />,
            }}
          >
            <Stack.Screen
              name="BottomNav"
              component={BottomNav}
              options={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
                return { headerTitle: routeName };
              }}
            />
            <Stack.Screen name="AddExpense" component={AddExpense} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
