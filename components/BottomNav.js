import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Portal, FAB } from 'react-native-paper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Home from '../screens/Home';
import Accounts from '../screens/Accounts';

const Tab = createMaterialBottomTabNavigator();

export const BottomNav = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const openModal = () => {
    navigation.navigate("AddExpense");
  }

  return (
    <>
    <Tab.Navigator
      initialRouteName="Home"
      shifting={true}
      sceneAnimationEnabled={true}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: 'home-account',
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={Accounts}
        options={{
          tabBarIcon: 'message-text-outline',
        }}
      />
    </Tab.Navigator>
    <Portal>
      <FAB
        icon="plus"
        onPress={openModal}
        visible={isFocused}
        style={{
          position: 'absolute',
          bottom: 100,
          right: 16,
        }}
      />
    </Portal>
    </>

  );
};