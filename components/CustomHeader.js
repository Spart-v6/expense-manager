import React from "react";
import { Appbar, Searchbar, Text, TextInput } from "react-native-paper";
import { DrawerActions, useNavigationState } from "@react-navigation/native";
import { getDeepestRouteName } from "../helper/getRouteNames";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { goBack } from "../navigation/RootNavigation";


const routeConfig = {
  "Home": ['HomeScreen', 'Home'],
  "Settings": ['SettingsScreen', 'Settings'],
  "Cards": ['CardsScreen', 'Cards'],
  "Payments": ['PaymentsScreen', 'Payments'],
  "Split": ['SplitScreen', 'Split'],
  "Search": ['SearchScreen', 'Search'],
  // All 'goBack()' screen cases
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
  const showMenu = ['Home', 'Settings', 'Cards', 'Payments', 'Split', 'Search'].includes(routeKey); // these screens to show menu
  const showBack = ['Add expenses', 'Add cards', 'Search'].includes(routeKey);  // these screens to show back button (should match with key in routeConfig)
  const showSearch = routeKey === 'Home'; // show search icon only on Home screen
  
  // States
  const [searchQuery, setSearchQuery] = React.useState('');

  // Effects
  React.useEffect(() => {
    if (routeKey !== "Search") {
      setSearchQuery('');
    }
  }, [routeKey]);

  // Searching logic
  const searchExpense = () => {
    
  };

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

      {routeKey !== "Search" ? (
        <Appbar.Content title={routeKey} />
      ) : (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
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
