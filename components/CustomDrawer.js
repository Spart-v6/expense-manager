import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Divider, Text } from "react-native-paper";
import appConfig from "../app.json";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const CustomDrawer = (props) => {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();
  const styles = makeStyles(theme);

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
        backgroundColor: theme.dark.surfaceContainer,
      }}
    >
      {/* Drawer Header */}
      <View style={styles.headerContainer}>
        <Text
          style={[styles.profileName, { color: theme.dark.tertiary }]}
          fontWeight="bold"
        >
          Thrifty
        </Text>
      </View>

      <Divider
        style={{ backgroundColor: theme.dark.onTertiaryContainer }}
        bold={true}
      />

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Home"
          icon={({ focused, color, size }) => (
            <FontAwesome
              name="home"
              size={20}
              color={theme.dark.onTertiary}
              style={{ marginLeft: 10 }}
            />
          )}
          labelStyle={[styles.drawerLabel, { color: theme.dark.onTertiary }]}
          onPress={() => props.navigation.navigate("Main")}
          style={getDrawerItemStyle("Main")}
        />
        {/* <DrawerItem
          label="Overview"
          icon={({ focused, color, size }) => (
            <MaterialIcons
              name="insights"
              size={20}
              color={theme.dark.onTertiary}
              style={{ marginLeft: 10 }}
            />
          )}
          labelStyle={[styles.drawerLabel, { color: theme.dark.onTertiary }]}
          onPress={() => props.navigation.navigate("Overview")}
          style={getDrawerItemStyle("Overview")}
        /> */}
        <DrawerItem
          label="Settings"
          icon={({ focused, color, size }) => (
            <Feather
              name="settings"
              size={20}
              color={theme.dark.onTertiary}
              style={{ marginLeft: 10 }}
            />
          )}
          labelStyle={[styles.drawerLabel, { color: theme.dark.onTertiary }]}
          onPress={() => props.navigation.navigate("Settings")}
          style={getDrawerItemStyle("Settings")}
        />
      </View>

      <Divider
        style={{ backgroundColor: theme.dark.onTertiaryContainer }}
        bold={true}
      />

      {/* Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text
            style={[styles.logoutText, { color: theme.dark.onTertiary }]}
            fontWeight="bold"
          >
            v {appVersion}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    headerContainer: {
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 18,
    },
    drawerItemsContainer: {
      flex: 1,
      marginTop: 20,
    },
    drawerLabel: {
      fontSize: 16,
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
    },
    activeItem: {
      fontSize: 16,
      color: "white",
      backgroundColor: theme.dark.onTertiaryContainer,
      borderRadius: 25,
      elevation: 1,
    },
    inactiveItem: {
      fontSize: 16,
      color: "#555",
    },
  });

export default CustomDrawer;
