import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AccountsScreen from '../screens/AccountsScreen';
import PlusMoreHome from "../screens/PlusMoreHome";
import PlusMoreAccount from "../screens/PlusMoreAccount";
import SettingsScreen from '../screens/SettingsScreen';
import DrawerContent from "../components/DrawerContent";
import WelcomeScreen from '../screens/WelcomeScreen';
import { useTheme } from 'react-native-paper';
import { Easing, TouchableWithoutFeedback } from 'react-native';
import allColors from "../commons/allColors.js";

const customEasing = Easing.bezier(0.42, 0, 0.58, 1);

const Stack = createStackNavigator();
const StackApp = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

const buttonWithoutFeedback = ({ children, style, ...props }) => (
    <TouchableWithoutFeedback {...props}>
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
);

const navOptions = () => ({
    headerShown: false
})

const HomeTabs = () => {
    return (
        <Tab.Navigator 
            initialRouteName='Home' 
            sceneAnimationEnabled={true}
            sceneAnimationType="shifting"
            sceneAnimationEasing={customEasing}
            shifting={true}
            barStyle={{ backgroundColor: allColors.backgroundColorSecondary, }}
            inactiveColor={"gray"}
            compact
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: "home" }} />
            <Tab.Screen name="Accounts" component={AccountsScreen} options={{ tabBarIcon: "bank" }}/>
        </Tab.Navigator>
    )
}

const TabNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="HomeTab" component={HomeTabs} options={navOptions}/>
        <Stack.Screen name="PlusMoreHome" component={PlusMoreHome} options={navOptions} />
        <Stack.Screen name="PlusMoreAccount" component={PlusMoreAccount} options={navOptions}/>
    </Stack.Navigator>
);

const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName='MenuTab' drawerContent={props => DrawerContent(props)} screenOptions={{
        drawerStyle: {
          backgroundColor: '#c6cbef',
          width: 240,
        },
      }}>
        <Drawer.Screen name='MenuTab' component={TabNavigator} options={navOptions}/>
        <Drawer.Screen name='SettingsScreen' component={SettingsScreen} options={navOptions}/>
    </Drawer.Navigator>
)

const AppStack = () => {
    const theme = useTheme();
    const flag = true;

    return (
        // gotta change this color to some global color
        <NavigationContainer theme={{ colors: { background: allColors.backgroundColorPrimary } }}>
            <StackApp.Navigator initialRouteName={flag ? 'HomeApp' :'WelcomeScreen'}>
                <StackApp.Screen name="HomeApp" component={DrawerNavigator} options={navOptions}/>
                <StackApp.Screen name="WelcomeScreen" component={WelcomeScreen} options={navOptions}/>
            </StackApp.Navigator>
        </NavigationContainer>
    )
}

export default AppStack