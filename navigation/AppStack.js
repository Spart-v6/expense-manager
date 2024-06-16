import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import AllExpensesScreen from "../screens/AllExpensesScreen";
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
import MyText from "../components/MyText";
import { IconComponent } from "../components/IconPickerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useDynamicColors from "../commons/useDynamicColors";
import * as NavigationBar from "expo-navigation-bar";
import { View, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions, Animated } from "react-native";

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
    icon: "home-outline",
    focused: "home",
    category: "Ionicons",
    component: HomeScreen,
  },
  {
    route: "Accounts",
    label: "Accounts",
    icon: "bank-outline",
    focused: "bank",
    category: "MaterialCommunityIcons",
    component: AccountsScreen,
  },
  {
    route: "SplitMoney",
    label: "Split",
    icon: "share-social-outline",
    focused: "share-social",
    category: "Ionicons",
    component: SplitMoneyScreen,
  },
  {
    route: "RecurrenceScreen",
    label: "Recur",
    icon: "repeat",
    focused: "repeat",
    category: "Feather",
    component: RecurrenceScreen,
  },
];

const TabButton = (props) => {
  const allColors = useDynamicColors();
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  
  const widthAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(widthAnimation, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      if (animation) animation.stop();
    };
  }, [focused, widthAnimation]);

  const interpolatedWidth = widthAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['65%', '70%'],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ position: "relative" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginTop: 8,
            width:   Dimensions.get("screen").width / 4.5,
            height: 30,
            zIndex: 2,
          }}
        >
          <Animated.View style={[{paddingBottom: 5, paddingTop: 5}, focused && { backgroundColor: allColors.tabBtnColor, width: interpolatedWidth, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }]}>
            <IconComponent
              name={focused ? item.focused :item.icon}
              category={item.category}
              size={20}
            />
          </Animated.View>
          <MyText style={[{ color: allColors.universalColor }, focused && {fontFamily: "Karla_400Regular"}]}>{item.label}</MyText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeTabs = () => {
  const allColors = useDynamicColors();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: allColors.backgroundColorLessPrimary,
          height: 80,
          borderColor: 'transparent',
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
      name="AllExpensesScreen"
      component={AllExpensesScreen}
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
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={navOptions}
    />
    <Stack.Screen
      name="WelcomeScreen"
      component={WelcomeScreen}
      options={navOptions}
    />
  </Stack.Navigator>
);

const WelcomeNavigator = () => (
  <Stack.Navigator
    initialRouteName="WelcomeScreen1"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen
      name="WelcomeScreen1"
      component={WelcomeScreen1}
      options={navOptions}
    />
    <Stack.Screen
      name="WelcomeScreen"
      component={WelcomeScreen}
      options={navOptions}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  const allColors = useDynamicColors();
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
      } catch (error) {} 
      finally {
        setIsLoading(false);
      }
    };

    checkWelcomeScreen();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: allColors.backgroundColorPrimary,
        }}
      >
        <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
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
