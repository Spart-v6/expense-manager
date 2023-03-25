import React,  { useEffect, useRef }  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import * as Animatable from 'react-native-animatable';
import Animated, { ZoomIn, ZoomOut, Layout } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import allColors from "../commons/allColors.js";
import * as NavigationBar from "expo-navigation-bar";
import { Easing, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { duration } from 'moment';

const Stack = createStackNavigator();
const StackApp = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const navOptions = () => ({
    headerShown: false
})

const TabArr = [
    { route: 'Home', label: 'Home', icon: 'home', component: HomeScreen},
    { route: 'Accounts', label: 'Accounts', icon: 'bank', component: AccountsScreen}
];

const circle1 = { 0: { scale: 0 }, 0.3: { scale: .9 }, 0.5: { scale: .2 }, 0.8: { scale: .7 }, 1: { scale: 1 } }
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.transition({width: 0}, {width: 100});
      // circleRef.current.transition({translateY: 0,}, {translateY: 100});
      textRef.current.transition({scaleX: 0}, {scaleX: 1});
    } else {
      viewRef.current.transition({width: 100}, {width: 0});
      // circleRef.current.transition({translateY: 100,}, {translateY: 0});
      textRef.current.transition({scaleX: 1}, {scaleX: 0});
      // textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ position: "relative", width: 90, height: 40}}>
        <Animatable.View ref={viewRef}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            position: 'absolute',
            bottom: 0,
            top: 0,
            left: 0,
            height: 30,
            backgroundColor: allColors.backgroundColorQuaternary, // TODO: Add Icon background and text color
            zIndex: 1,
          }}/>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginTop: 8,
            width: 100,
            height: 30,
            zIndex: 2
          }}
        >
          <View style={{marginBottom: 5}}>
            <Icon type={item.type} name={item.icon} color={"white"} size={20}/>
          </View>
          <Animatable.Text ref={textRef} style={{color: "white"}}>{item.label}</Animatable.Text>
        </View>
      </View>

    </TouchableOpacity>
  );
};


const HomeTabs = () => {
    return (
        <Tab.Navigator 
            initialRouteName='Home'
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor:"red",
              tabBarStyle: {
                  backgroundColor: allColors.backgroundColorLessPrimary,
                  height: 75
              },
              unmountOnBlur: true
            }}
        >
            {TabArr.map((item, index) => {
                return (
                <Tab.Screen key={index} name={item.route} component={item.component}
                    options={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarButton: (props) => <TabButton {...props} item={item} />
                    }}
                />
                )
            })}
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
          backgroundColor: allColors.backgroundColorPrimary,
          width: 200,
        },
      }}>
        <Drawer.Screen name='MenuTab' component={TabNavigator} options={navOptions}/>
        <Drawer.Screen name='SettingsScreen' component={SettingsScreen} options={navOptions}/>
    </Drawer.Navigator>
)

const AppStack = () => {
    NavigationBar.setBackgroundColorAsync("#000");
    const theme = useTheme();
    const flag = true;

    return (
        <NavigationContainer theme={{ colors: { background: allColors.backgroundColorPrimary } }}>
            <StackApp.Navigator initialRouteName={flag ? 'HomeApp' :'WelcomeScreen'}>
                <StackApp.Screen name="HomeApp" component={DrawerNavigator} options={navOptions}/>
                <StackApp.Screen name="WelcomeScreen" component={WelcomeScreen} options={navOptions}/>
            </StackApp.Navigator>
        </NavigationContainer>
    )
}

export default AppStack