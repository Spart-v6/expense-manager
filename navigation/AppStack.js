import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import AccountsScreen from "../screens/AccountsScreen";
import PlusMoreHome from "../screens/PlusMoreHome";
import PlusMoreAccount from "../screens/PlusMoreAccount";
import PlusMoreRecurrence from "../screens/PlusMoreRecurrence";
import SearchScreen from "../screens/SearchScreen";
import CardDetailsScreen from "../screens/CardDetailsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PlusMoreGroup from "../screens/PlusMoreGroup";
import SplitSection from "../screens/SplitSection";
import PlusMoreSplitSection from "../screens/PlusMoreSplitSection";
import SplitMoneyScreen from "../screens/SplitMoneyScreen";
import SplitDetailScreen from "../screens/SplitDetailScreen";
import RecurrenceScreen from "../screens/RecurrenceScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import WelcomeScreen1 from "../screens/WelcomeScreen1";
import { useTheme, Text } from "react-native-paper";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import allColors from "../commons/allColors.js";
import * as NavigationBar from "expo-navigation-bar";
import { View, TouchableOpacity, ActivityIndicator  } from "react-native";

const Stack = createStackNavigator();
const StackApp = createStackNavigator();
const Tab = createBottomTabNavigator();

const navOptions = () => ({
  headerShown: false,
});

const TabArr = [
  {
    route: "Home",
    label: "Home",
    icon: "home",
    iconFilled: "home",
    component: HomeScreen,
  },
  {
    route: "Accounts",
    label: "Accounts",
    icon: "credit-card",
    iconFilled: "credit-card",
    component: AccountsScreen,
  },
  {
    route: "SplitMoney",
    label: "Split",
    icon: "people",
    iconFilled: "people",
    component: SplitMoneyScreen,
  },
  {
    route: "RecurrenceScreen",
    label: "Recurrence",
    icon: "repeat",
    iconFilled: "repeat",
    component: RecurrenceScreen,
  },
];

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ position: "relative", width: 100, height: 40 }}>
        {focused && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              position: "absolute",
              bottom: 0,
              top: 0,
              left: 10,
              width: 80,
              height: 28,
              opacity: 0.4,
              backgroundColor: allColors.backgroundColorQuaternary, // TODO: Add Icon background and text color
              zIndex: 1,
            }}
          />
        )}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginTop: 8,
            width: 100,
            height: 30,
            zIndex: 2,
          }}
        >
          <View style={{ marginBottom: 5 }}>
            <Icon type={item.type} name={item.icon} color={"white"} size={20} />
          </View>
          <Text style={{ color: "white" }}>{item.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "red",
        tabBarStyle: {
          backgroundColor: allColors.backgroundColorLessPrimary,
          height: 80,
        },
        unmountOnBlur: true,
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const TabNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeTab" component={HomeTabs} options={navOptions} />
    <Stack.Screen
      name="PlusMoreHome"
      component={PlusMoreHome}
      options={navOptions}
    />
    <Stack.Screen
      name="PlusMoreAccount"
      component={PlusMoreAccount}
      options={navOptions}
    />
    <Stack.Screen
      name="CardDetailsScreen"
      component={CardDetailsScreen}
      options={navOptions}
    />
    <Stack.Screen
      name="PlusMoreRecurrence"
      component={PlusMoreRecurrence}
      options={navOptions}
    />
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={navOptions}
    />
    {/* For split screen */}
    <Stack.Screen
      name="PlusMoreGroup"
      component={PlusMoreGroup}
      options={navOptions}
    />
    <Stack.Screen
      name="SplitSection"
      component={SplitSection}
      options={navOptions}
    />
    <Stack.Screen
      name="PlusMoreSplitSection"
      component={PlusMoreSplitSection}
      options={navOptions}
    />
    <Stack.Screen
      name="SplitDetailScreen"
      component={SplitDetailScreen}
      options={navOptions}
    />
  </Stack.Navigator>
);

const WelcomeNavigator = () => (
  <Stack.Navigator initialRouteName="WelcomeScreen1" screenOptions={{headerShown: false}}>
    <Stack.Screen name="WelcomeScreen1" component={WelcomeScreen1} options={navOptions} />
    <Stack.Screen
      name="WelcomeScreen"
      component={WelcomeScreen}
      options={navOptions}
    />
  </Stack.Navigator>
)

const AppStack = () => {
  NavigationBar.setBackgroundColorAsync("#000");
  const [initialRoute, setInitialRoute] = React.useState("WelcomeNavigator");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkWelcomeScreen = async () => {
      try {
        const hasSeenWelcomeScreen = await AsyncStorage.getItem(
          "hasSeenWelcomeScreen"
        );
        const flag = hasSeenWelcomeScreen === "true";
        setInitialRoute(flag ? "HomeApp" : "WelcomeNavigator");
      } catch (error) {
        console.log("Error retrieving data from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWelcomeScreen();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: allColors.backgroundColorPrimary }}>
        <ActivityIndicator size={50} color={allColors.textColorFive} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{ colors: { background: allColors.backgroundColorPrimary } }}
    >
      <StackApp.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <StackApp.Screen name="HomeApp" component={TabNavigator} />
        <StackApp.Screen
          name="WelcomeNavigator"
          component={WelcomeNavigator}
          options={{ gestureEnabled: false }}
        />
      </StackApp.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
