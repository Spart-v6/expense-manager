import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { Appbar, Searchbar, Text, TextInput } from "react-native-paper";
import { DrawerActions, useFocusEffect, useNavigationState } from "@react-navigation/native";
import { getDeepestRoute } from "../helper/getRouteNames";
import { TouchableOpacity, useColorScheme, View, Animated } from "react-native";
import { goBack } from "../navigation/RootNavigation";
import { useThemeContext } from "../context/ThemeContext";
import { SearchContext } from "../context/SearchContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
};


const routeConfig = {
  "Home": ['HomeScreen', 'Home'],
  "Settings": ['SettingsScreen', 'Settings'],
  "Cards": ['CardsScreen', 'Cards'],
  "Payments": ['PaymentsScreen', 'Payments'],
  "Split": ['SplitScreen', 'Split'],
  "Reports" : ['Reports'],
  "Search": ['SearchScreen', 'Search'],
  "Add expenses": ['PlusMoreHome'],
  "Add cards": ['PlusMoreCard'],
  "Add group": ['PlusMoreSplit'],
  "Add a new split": ['PlusMoreSplitDetailScreen'],
  "Add payments": ['PlusMorePayment'],
  "Transactions": ['TransactionsList']
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
  const [username, setUsername] = useState('');

  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const colorScheme = useColorScheme();
  // const { theme } = useMaterial3Theme();
    const { theme, initialized, themeColor } = useThemeContext(); 

  const navState = useNavigationState((state) => state);

  const { name: currentRoute, params } = getDeepestRoute(navState);
  const routeKey = getRouteInfo(currentRoute);

  // For custom titles use this below (for static use routeConfig and place ur screen names there)
  const title = params?.title || routeKey;


  const showMenu = ['Home', 'Settings', 'Cards', 'Payments', 'Split', 'Reports'].includes(routeKey);
  const showBack = ['Add expenses', 'Add cards', 'Search', 'IndividualCardScreen', 'Add group', 'Add a new split', 'Add payments', 'Transactions', 'SplitDetailsScreen', 'IndividualSplitScreen'].includes(routeKey); // add the screen name (doesn't matter if custom title is used or not - use original screen name for back button) 
  const showSearch = routeKey === 'Home';
  const showGreeting = routeKey === 'Home';

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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const name = await AsyncStorage.getItem("username");
          setUsername(name);
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      };
      fetchData();
    }, [])
  );
  
  useEffect(() => {
    if (routeKey !== "Search") {
      setSearchQuery('');
    }
  }, [routeKey]);

  const searchExpense = () => {
    // TODO: your search logic
  };

  const showAppBarContent = () => {
    if (routeKey !== "Search" && !showGreeting) {
      return (
        <Appbar.Content title={title} />
    )}
    if (showGreeting) {
      return (
        <Animated.View style={{ flex: 1, opacity, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Main", {
                screen: "Home",
                params: { screen: "SearchScreen" },
              })
            }
          >
            <Appbar.Content
              title={
                greetingAlreadyShown
                  ? displayTitle
                  : `${getGreeting()}, ${username}!`
              }
              style={{
                alignContent: "center",
                justifyContent: "center",
                opacity: 0.8,
              }}
              titleStyle={{
                width: 250,
                textAlign: "center",
                numberOfLines: 1,
                ellipsizeMode: "tail",
              }}
            />
          </TouchableOpacity>
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
