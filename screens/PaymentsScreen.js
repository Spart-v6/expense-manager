import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { Text, FAB } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";

const PaymentsScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme, initialized, themeColor } = useThemeContext();
  const styles = makeStyles(theme);
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Payments Screen
        </Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("PlusMorePayment")}
          variant="tertiary"
          mode="flat"
          color={theme.dark.onPrimaryContainer}
        />
      </View>
    </>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    fab: {
      backgroundColor: theme.dark.primaryContainer,
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

export default PaymentsScreen;
