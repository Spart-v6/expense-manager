import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const StackHome = createStackNavigator();
const StackAccount = createStackNavigator();
const StackApp = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

const navOptions = () => ({
    headerShown: false
})

const HomeStack = () => {
    return (
        <StackHome.Navigator initialRouteName='HomeScreen'>
            <StackHome.Screen name="HomeScreen" component={HomeScreen} options={navOptions}/>
            <StackHome.Screen name="PlusMoreHome" component={PlusMoreHome} options={navOptions}/>
        </StackHome.Navigator>
    )
}
const AccountStack = () => {
    return (
        <StackAccount.Navigator initialRouteName='AccountsScreen'>
            <StackAccount.Screen name="AccountsScreen" component={AccountsScreen} options={navOptions}/>
            <StackAccount.Screen name="PlusMoreAccount" component={PlusMoreAccount} options={navOptions}/>
        </StackAccount.Navigator>
    )
}

const TabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: "home-account" }} />
        <Tab.Screen name="Accounts" component={AccountStack} options={{ tabBarIcon: "message-text-outline" }}/>
    </Tab.Navigator>
);

const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName='MenuTab' drawerContent={props => DrawerContent(props)}>
        <Drawer.Screen name='MenuTab' component={TabNavigator} options={navOptions}/>
        <Drawer.Screen name='SettingsScreen' component={SettingsScreen} options={navOptions}/>
    </Drawer.Navigator>
)

const AppStack = () => {
    const flag = true;

    return (
        <NavigationContainer>
            <StackApp.Navigator initialRouteName={flag ? 'HomeApp' :'WelcomeScreen'}>
                <StackApp.Screen name="HomeApp" component={DrawerNavigator} options={navOptions}/>
                <StackApp.Screen name="WelcomeScreen" component={WelcomeScreen} options={navOptions}/>
            </StackApp.Navigator>
        </NavigationContainer>
    )
}

export default AppStack