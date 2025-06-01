import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Vibration
} from "react-native";
import { Dialog, Portal, Button, Text, Card, FAB, Avatar, TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeContext } from "../context/ThemeContext";
import IconComponent from "../components/IconComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useFocusEffect } from "@react-navigation/native";

const iconStyles = {
  "silverware-fork-knife": {
    backgroundColor: "#4d1f00", // dark orange
    color: "#ff9933", // bright orange
  },
  "briefcase-outline": {
    backgroundColor: "#003366",
    color: "#3399ff",
  },
  "pill": {
    backgroundColor: "#1c1c1c",
    color: "#00ffcc",
  },
  // Add more as needed
};

const HomeScreen = ({ navigation }) => {
  // AsyncStorage.clear();
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();
  const styles = makeStyles(theme);

  const [visible, setVisible] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const [transactions, setTransactions] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const loadTransactions = async () => {
        try {
          const data = await AsyncStorage.getItem("transactions");
          const parsed = data ? JSON.parse(data) : [];
          setTransactions(parsed);
        } catch (error) {
          console.error("Failed to load transactions", error);
        }
      };
      loadTransactions();
    }, [])
  );

  const showDialog = txn => {
    setSelectedTxn(txn);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedTxn(null);
  };
  
  const handleConfirmDelete = async () => {
    try {
      if (!selectedTxn) return;

      const storedTx = await AsyncStorage.getItem("transactions");
      const parsedTx = storedTx ? JSON.parse(storedTx) : [];
      const updatedTx = parsedTx.filter(tx => tx.id !== selectedTxn);
      await AsyncStorage.setItem("transactions", JSON.stringify(updatedTx));
      setTransactions(updatedTx);

      hideDialog();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  

  // fidning height dynamically for scrolling the transactions list
  const [topContentHeight, setTopContentHeight] = useState(0);
  const screenHeight = Dimensions.get("window").height;
  const remainingHeight = screenHeight - topContentHeight;
  

  const LeftContentExpense = (props) => (
    <Avatar.Icon
      {...props}
      icon="trending-down"
      size={36}
      style={{ backgroundColor: theme.dark.surface, marginRight: 8 }}
      color="#e62e44"
    />
  );

  const RightContentIncome = (props) => (
    <Avatar.Icon
      {...props}
      icon="trending-up"
      size={36}
      style={{ backgroundColor: theme.dark.surface, marginRight: 8 }}
      color="#1cba1c"
    />
  );

  const TransactionItem = ({ item, onLongPressTxn }) => {
    const iconStyle = iconStyles[item.iconName] || { backgroundColor: "#222", color: "#fff", };
    const date = new Date(item.date);
    let formattedDate;
    if (isToday(date)) {
      formattedDate = `Today, ${format(date, 'hh:mm a')}`;
    } else if (isYesterday(date)) {
      formattedDate = `Yesterday, ${format(date, 'hh:mm a')}`;
    } else {
      formattedDate = format(date, 'MMM dd, yyyy');
    }


    return (
      <TouchableOpacity style={styles.transactionCard}  onLongPress={() => {Vibration.vibrate(10);onLongPressTxn();}}>
        <IconComponent
          iconSet={"MaterialIcons"}
          iconName={"money-off"}
          backgroundColor={theme.dark.surface}
          color={theme.dark.surfaceTint}
          size={24}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amount,
            { color: item.type === "Income" ? "#00ff7f" : "#ff4d4d" }
          ]}>
            {item.type === "Income" ? "+" : "-"}${Math.abs(item.amount).toFixed(2)}
          </Text>
          <Text style={styles.paymentType}>Cash</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View onLayout={(e) => setTopContentHeight(e.nativeEvent.layout.height)}>
       
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20, paddingLeft: 16, paddingRight: 16 }}>
          <Card style={styles.welcomeCard}>
            <Card.Content>
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                <Text style={{ flex: 1, textAlign: "center", fontSize: 16, color: theme.dark.primary }}>
                  Total Balance
                </Text>
              </View>

              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text variant="displaySmall">$5,20,000</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={{ paddingLeft: 16, paddingRight: 16, marginTop: 16 }}>
          <View style={styles.row}>
            <Card style={[styles.statCard, styles.expenseCard]}>
              <Card.Title title="Expenses" right={LeftContentExpense} />
              <Card.Content>
                <Text variant="titleLarge">-$42,000</Text>
                <Text variant="bodySmall">Monthly</Text>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, styles.incomeCard]}>
              <Card.Title title="Income" right={RightContentIncome} />
              <Card.Content>
                <Text variant="titleLarge">$42,000</Text>
                <Text variant="bodySmall">Monthly</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

    </View>


    <View style={{ height: remainingHeight, paddingHorizontal: 16, }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Text variant="titleMedium" style={{padding: 8}}>Transactions</Text>
        <TouchableRipple onPress={() => navigation.navigate("TransactionsList")} style={{ padding: 8, borderRadius: 8 }}>
          <Text variant="titleMedium" style={{color: theme.dark.primary}}>Show All</Text>
        </TouchableRipple>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={transactions.slice(0, 10)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} onLongPressTxn={() => showDialog(item.id)}/>}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={<View style={{ marginBottom: 200 }} />}
        />
      </View>
    </View>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("PlusMoreHome")}
        variant="tertiary"
        mode="flat"
        color={theme.dark.onPrimaryContainer}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Delete transaction?</Dialog.Title>
          <Dialog.Content>
            <Text>This will delete the selected transaction. Are you sure?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleConfirmDelete} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>

  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.dark.background,
    },
    innerContainer: {
      flex: 1,
      // padding: 16,
    },
    gradient: {
      padding: 0,
      paddingBottom: 40,
    },
    welcomeCard: {
      marginBottom: 5,
      backgroundColor: theme.dark.primaryContainer,
      borderColor: "transparent",
      elevation: 5,
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      width: "100%",
      alignSelf: "center",
    },

    title: {
      fontSize: 24,
    },
    subtitle: {
      fontSize: 16,
    },
    actions: {
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingBottom: 8,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
    },
    expenseCard: {
      backgroundColor: theme.dark.onSecondary,
    },
    incomeCard: {
      backgroundColor: theme.dark.onSecondary,
    },
    fab: {
      backgroundColor: theme.dark.primaryContainer,
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
     transactionCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#111",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    transactionDetails: {
      flex: 1,
      marginLeft: 12,
    },
    title: {
      fontSize: 16,
      color: "#fff",
    },
    date: {
      fontSize: 12,
      color: "#aaa",
    },
    transactionAmount: {
      alignItems: "flex-end",
    },
    amount: {
      fontSize: 16,
      fontWeight: "bold",
    },
    paymentType: {
      fontSize: 12,
      color: "#888",
    },
  });

export default HomeScreen;
