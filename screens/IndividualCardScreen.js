import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  useColorScheme,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Svg, { Circle } from "react-native-svg";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { Text } from "react-native-paper";

const { width } = Dimensions.get("window");

const IndividualCardScreen = ({ route }) => {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();
  const styles = makeStyles(theme);

  const {
    cardName = "Visa",
    last4 = "3534",
    expiry = "29/4",
    transactions = [],
  } = route.params;

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          margin: 20,
          paddingTop: 20,
        }}
      >
        <Text variant="displayLarge">$2,800</Text>
        <Text variant="titleSmall" style={{ paddingTop: 10 }}>
          Available Balance
        </Text>
      </View>

      <View>
        <View style={styles.card}>
          {/* Top Section */}
          <View style={styles.topSection}>
            {/* Background random shapes */}
            <Svg style={StyleSheet.absoluteFill}>
              <Circle cx="50" cy="40" r="30" fill="rgba(255,255,255,0.1)" />
              <Circle cx="150" cy="80" r="25" fill="rgba(255,255,255,0.1)" />
              <Circle cx="250" cy="40" r="20" fill="rgba(255,255,255,0.1)" />
            </Svg>

            <View style={styles.topContent}>
              <Icon name="contactless-payment" size={24} color="white" />
              <Text style={styles.visaText}>{cardName}</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.cardNumber}>•••• {last4}</Text>
            <Text style={styles.expiry}>{expiry}</Text>
          </View>
        </View>
      </View>

      {/* Transactions */}
      <Text style={{ margin: 20 }} variant="bodyLarge">Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.transactions}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.txnTitle}>{item.title}</Text>
            <Text style={styles.txnAmount}>₹{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default IndividualCardScreen;

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      width: width - 22,
      height: 200,
      borderRadius: 20,
      overflow: "hidden",
      alignSelf: "center",
      marginVertical: 20,
      elevation: 4,
    },
    topSection: {
      flex: 1.5,
      backgroundColor: theme.dark.onPrimary,
      justifyContent: "center",
      paddingHorizontal: 20,
      position: "relative",
    },
    topContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    visaText: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    bottomSection: {
      flex: 1,
      backgroundColor: theme.dark.surface,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      alignItems: "center",
    },
    cardNumber: {
      color: "white",
      fontSize: 16,
      letterSpacing: 2,
    },
    expiry: {
      color: "white",
      fontSize: 16,
    },
    transactions: {
      paddingBottom: 100,
    },
    transactionItem: {
      margin: 20,
      paddingLeft: 10,
      paddingRight: 10,
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    txnTitle: {
      fontSize: 16,
    },
    txnAmount: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
