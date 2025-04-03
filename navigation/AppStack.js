import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  useColorScheme,
  NativeModules,
  StatusBar,
} from "react-native";
import { View } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";

const Tab = createNativeBottomTabNavigator();
const { NavigationBarModule } = NativeModules;

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const AppStack = () => {
  const changeNavBarColor = (color) => {
    NavigationBarModule.setNavigationBarColor(color);
  };

  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();

  useEffect(() => {
    if (colorScheme === "dark")
      changeNavBarColor(theme.dark.onTertiaryContainer);
    else changeNavBarColor(theme.light.onTertiaryContainer);
  }, [colorScheme]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"transparent"} translucent />
      {/* <View
        style={[
          {
            height: "100%",
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          },
          colorScheme === "dark"
            ? { backgroundColor: theme.dark.primaryContainer }
            : { backgroundColor: theme.light.primaryContainer },
        ]}
      >
        <Text style={{ color: "red" }}>App Stack</Text>
      </View> */}
       <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: theme.dark.primary,
          }}
          >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: () => require('../assets/home.svg')
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: () => require('../assets/card.svg')
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default AppStack;
