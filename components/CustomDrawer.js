import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Divider, Text } from "react-native-paper";
import appConfig from "../app.json";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import Svg, { Path } from "react-native-svg";
import { useThemeContext } from "../context/ThemeContext";

const ThriftyLogo = () => {
  const colorScheme = useColorScheme();
  const { theme, initialized, themeColor } = useThemeContext();

  return (
    <View style={{ width: 40, height: 40 }}>
      <Svg width="100%" height="100%" viewBox="0 0 1024 1024">
        <Path
          d="M522.5 224C598.485 224 671.357 254.185 725.086 307.914C778.815 361.643 809 434.515 809 510.5C809 586.484 778.815 659.357 725.086 713.086C671.357 766.815 598.485 797 522.5 797L522.5 510.5L522.5 224Z"
          fill={theme[colorScheme].secondaryContainer}
        />
        <Path
          d="M520.488 355C544.665 368.97 565.536 393.018 580.536 424.188C595.536 455.358 604.011 492.291 604.919 530.445C605.826 568.599 599.126 606.311 585.644 638.944C572.161 671.577 545.332 699.584 521.878 716L521.878 687.406L512.003 661.59C528.49 650.051 542.322 631.682 551.799 608.744C561.277 585.806 565.986 559.297 565.348 532.477C564.71 505.658 558.753 479.697 548.209 457.787C537.665 435.877 522.994 418.973 506 409.153L520.488 355Z"
          fill={theme[colorScheme].onSecondary}
        />
        <Path
          d="M325 266C393.161 266 458.53 293.077 506.726 341.274C554.923 389.47 582 454.839 582 523C582 591.161 554.923 656.53 506.726 704.726C458.53 752.923 393.161 780 325 780L325 523L325 266Z"
          fill={theme[colorScheme].tertiary}
        />
      </Svg>
    </View>
  );
};

const CustomDrawer = (props) => {
  const colorScheme = useColorScheme();
  const { theme, initialized, themeColor } = useThemeContext();
  const styles = makeStyles(theme, colorScheme);

  const appVersion = appConfig.expo.version;

  const { state, navigation } = props;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme[colorScheme].surfaceContainer,
      }}
    >
      {/* Drawer Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.profileName, { color: theme[colorScheme].tertiary }]}>
          Thrifty
        </Text>
        <ThriftyLogo />
      </View>

      <Divider
        style={{ backgroundColor: theme[colorScheme].onSecondaryContainer }}
        bold={true}
      />

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => {
            const isFocused = state?.routeNames[state.index] === "Main";
            return (
              <AntDesign
                name="home"
                size={20}
                color={
                  isFocused
                    ? theme[colorScheme].onTertiaryContainer
                    : theme[colorScheme].secondary
                }
                style={{ marginLeft: 10 }}
              />
            );
          }}
          labelStyle={{
            color:
              state?.routeNames[state.index] === "Main"
                ? theme[colorScheme].onTertiaryContainer
                : theme[colorScheme].secondary,
            marginLeft: 5,
          }}
          onPress={() => props.navigation.navigate("Main")}
          style={[
            styles.drawerItem,
            state?.routeNames[state.index] === "Main" && styles.activeItem,
          ]}
        />

        <DrawerItem
          label="Settings"
          icon={({ color, size }) => {
            const isFocused = state?.routeNames[state.index] === "Settings";
            return (
              <Feather
                name="settings"
                size={20}
                color={
                  isFocused
                    ? theme[colorScheme].onTertiaryContainer
                    : theme[colorScheme].secondary
                }
                style={{ marginLeft: 10 }}
              />
            );
          }}
          labelStyle={{
            color:
              state?.routeNames[state.index] === "Settings"
                ? theme[colorScheme].onTertiaryContainer
                : theme[colorScheme].secondary,
            marginLeft: 5,
          }}
          onPress={() => props.navigation.navigate("Settings")}
          style={[
            styles.drawerItem,
            state?.routeNames[state.index] === "Settings" && styles.activeItem,
          ]}
        />
        {/* <DrawerItem
          label="Reports"
          icon={({ color, size }) => {
            const isFocused = state?.routeNames[state.index] === "Reports";
            return (
              <Ionicons
                name="stats-chart"
                size={20}
                color={
                  isFocused
                    ? theme.dark.onTertiaryContainer
                    : theme.dark.secondary
                }
                style={{ marginLeft: 10 }}
              />
            );
          }}
          labelStyle={{
            color:
              state?.routeNames[state.index] === "Reports"
                ? theme.dark.onTertiaryContainer
                : theme.dark.secondary,
            marginLeft: 5,
          }}
          onPress={() => props.navigation.navigate("Reports")}
          style={[
            styles.drawerItem,
            state?.routeNames[state.index] === "Reports" && styles.activeItem,
          ]}
        /> */}
      </View>

      <Divider
        style={{ backgroundColor: theme[colorScheme].onSecondaryContainer }}
        bold={true}
      />

      {/* Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text
            style={[styles.logoutText, { color: theme[colorScheme].tertiary }]}
            fontWeight="bold"
          >
            v {appVersion}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const makeStyles = (theme, colorScheme) =>
  StyleSheet.create({
    headerContainer: {
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    profileName: {
      fontSize: 24,
      fontWeight: "bold",
      marginRight: 10,
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
    drawerItem: {
      marginHorizontal: 10,
      borderRadius: 10,
    },
    activeItem: {
      backgroundColor: theme[colorScheme].primaryContainer,
      borderRadius: 10,
      elevation: 1,
    },
    inactiveItem: {
      fontSize: 16,
      color: "#555",
    },
  });

export default CustomDrawer;
