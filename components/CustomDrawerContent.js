import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "../components/MyText";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Divider } from "react-native-paper";
import appConfig from '../app.json'; 

const CustomDrawerContent = (props) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const appVersion = appConfig.expo.version;

  const { state, navigation } = props;

  const getDrawerItemStyle = (routeName) => {
    const currentRoute = state?.routeNames[state?.index];
    return routeName === currentRoute ? styles.activeItem : styles.inactiveItem;
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: allColors.backgroundColorPrimary,
      }}
    >
      {/* Drawer Header */}
      <View style={styles.headerContainer}>
        <MyText style={[styles.profileName, { color: allColors.textColorSecondary }]}>
          Thrifty
        </MyText>
      </View>

      <Divider style={{backgroundColor: allColors.backgroundColorSecondary}} bold={true}/>

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Home"
          icon={({focused, color, size}) => <FontAwesome name="home" size={20} color={allColors.textColorPrimary} style={{ marginLeft: 10 }} />}
          labelStyle={[styles.drawerLabel, { color: allColors.universalColor }]}
          onPress={() => props.navigation.navigate("Home")}
          style={getDrawerItemStyle("Home")}          
        />
        <DrawerItem
          label="Notifications"
          icon={({focused, color, size}) => <Ionicons name="notifications-outline" size={20} color={allColors.textColorPrimary} style={{ marginLeft: 10 }} />}
          labelStyle={[styles.drawerLabel, { color: allColors.universalColor }]}
          onPress={() => props.navigation.navigate("Notifications")}
          style={getDrawerItemStyle("Notifications")}          
        />
        <DrawerItem
          label="Upload File"
          icon={({focused, color, size}) => <Feather name="upload" size={20} color={allColors.textColorPrimary} style={{ marginLeft: 10  }} />}
          labelStyle={[styles.drawerLabel, { color: allColors.universalColor }]}
          onPress={() => props.navigation.navigate("Upload File")}
          style={getDrawerItemStyle("Upload File")}          
        />
        <DrawerItem
          label="Settings"
          icon={({focused, color, size}) => <Feather name="settings" size={20} color={allColors.textColorPrimary} style={{ marginLeft: 10 }} />}
          labelStyle={[styles.drawerLabel, { color: allColors.universalColor }]}
          onPress={() => props.navigation.navigate("Settings")}
          style={getDrawerItemStyle("Settings")}          
        />
      </View>

      <Divider style={{backgroundColor: allColors.backgroundColorSecondary}} bold={true}/>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
        >
          <MyText style={[styles.logoutText, { color: allColors.universalColor }]}>
            v {appVersion}
          </MyText>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const makeStyles = allColors =>
  StyleSheet.create({
  headerContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerItemsContainer: {
    flex: 1,
    marginTop: 20,
  },
  drawerLabel: {
    fontSize: 16,
    fontFamily: "Karla_400Regular",
  },
  footerContainer: {
    padding: 20,
  },
  logoutButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeItem: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'white',
    backgroundColor: allColors.backgroundColorCard,
    borderRadius: 25,
    elevation: 1,
  },
  inactiveItem: {
    fontSize: 16,
    color: "#555",
  },
});


export default CustomDrawerContent;
