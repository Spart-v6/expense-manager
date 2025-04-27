import React, { useEffect, useState, useRef } from "react";
import { Appbar, Searchbar, Text, TextInput } from "react-native-paper";
import { DrawerActions, useNavigationState } from "@react-navigation/native";
import { getDeepestRouteName } from "../helper/getRouteNames";
import { TouchableOpacity, useColorScheme, View, Animated } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { goBack } from "../navigation/RootNavigation";

const routeConfig = {
  "Home": ['HomeScreen', 'Home'],
  "Settings": ['SettingsScreen', 'Settings'],
  "Cards": ['CardsScreen', 'Cards'],
  "Payments": ['PaymentsScreen', 'Payments'],
  "Split": ['SplitScreen', 'Split'],
  "Search": ['SearchScreen', 'Search'],
  "Add expenses": ['PlusMoreHome'],
  "Add cards": ['PlusMoreCard'],
};

const getRouteInfo = (currentRoute) => {
  for (const [key, values] of Object.entries(routeConfig)) {
    if (values.includes(currentRoute)) {
      return key;
    }
  }
  return currentRoute || "";
};

const CustomHeader = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const navState = useNavigationState((state) => state);
  const currentRoute = getDeepestRouteName(navState);

  const routeKey = getRouteInfo(currentRoute);

  const showMenu = ['Home', 'Settings', 'Cards', 'Payments', 'Split', 'Search'].includes(routeKey);
  const showBack = ['Add expenses', 'Add cards', 'Search'].includes(routeKey);
  const showSearch = routeKey === 'Home';
  const showGreeting = routeKey === 'Home';

  const [searchQuery, setSearchQuery] = useState('');
  const [displayTitle, setDisplayTitle] = useState('Search expenses');
  const [greetingAlreadyShown, setGreetingAlreadyShown] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showGreeting && !greetingAlreadyShown) {
      // First time landing on Home
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {        
        setDisplayTitle('Search expenses');
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
        setGreetingAlreadyShown(true);
      });
    } else {
      // Normal behavior after first time
      setDisplayTitle('Search expenses');
      opacity.setValue(1);
    }
  }, [routeKey]);
  

  useEffect(() => {
    if (routeKey !== "Search") {
      setSearchQuery('');
    }
  }, [routeKey]);

  const searchExpense = () => {
    // your search logic
  };

  const showAppBarContent = () => {
    if (routeKey !== "Search" && !showGreeting) {
      return (
        <Appbar.Content title={routeKey} />
    )}
    if (showGreeting) {
      return (
      <Animated.View style={{ flex: 1, opacity, alignItems: "center"}}>
        <Appbar.Content title={greetingAlreadyShown ? displayTitle : "Good evening, John!"} style={{alignContent: "center", justifyContent: "center"}}/>
      </Animated.View>
    )}
    else {
      return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
        <Appbar.Content
          title={
            <TextInput
              label={
                <Text style={{ color: theme.dark.primary }}>
                  {"Search your expenses"}
                </Text>
              }
              style={{ backgroundColor: "transparent" }}
              textColor={theme.dark.primary}
              selectionColor={theme.dark.primaryContainer}
              value={searchQuery}
              underlineColor={theme.dark.primary}
              activeUnderlineColor={theme.dark.primary}
              onChangeText={setSearchQuery}
              autoFocus
            />
          }
        />
        <Appbar.Action
          icon="close"
          onPress={() => {
            setSearchQuery("");
          }}
          color={theme.dark.primary}
        />
      </View>
    )}
  }

  return (
    <Appbar.Header style={{ backgroundColor: theme.dark.surfaceDim }}>
      {showMenu && !showBack && (
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      )}
      {showBack && (
        <Appbar.Action icon="keyboard-backspace" onPress={goBack} />
      )}

      {showAppBarContent()}

      {showSearch && ( // inside Main > Home > SearchScreen
        <Appbar.Action
          icon="magnify"
          onPress={() =>
            navigation.navigate("Main", {
              screen: "Home",
              params: {
                screen: "SearchScreen",
              },
            })
          }
        />
      )}
    </Appbar.Header>
  );
};

export default CustomHeader;
