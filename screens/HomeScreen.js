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
import { format, isToday, isYesterday, parseISO, getYear, getMonth } from 'date-fns';
import { useFocusEffect } from "@react-navigation/native";
import { formatCurrency } from "../helper/formatCurrency";
import currencyObj from "../helper/currencyObj";

// function that calculates the yearly balance from the monthly summary array
const getYearlyBalance = (monthlySummary) => {
  if (!monthlySummary) return 0;

  return monthlySummary.reduce((acc, month) => {
    const income = month.income || 0;
    const expense = month.expense || 0;
    return acc + income - expense;
  }, 0);
};

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
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlySummary, setMonthlySummary] = useState(null);

  const [selectedCurrencyId, setSelectedCurrencyId] = useState(currencyObj[0].id);
  
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
      const getMonthlySummary = async () => {
        try {
          const monthlySummaryData = await AsyncStorage.getItem("monthlySummary");
          if (!monthlySummaryData) return;

          const summary = JSON.parse(monthlySummaryData);

          const now = new Date();
          const currentYear = getYear(now);
          const currentMonth = getMonth(now); // 0 = Jan, 7 = Aug

          const yearSummary = summary[currentYear];
          if (yearSummary) {
            const thisMonth = yearSummary[currentMonth];
            setMonthlyIncome(thisMonth.income);
            setMonthlyExpense(thisMonth.expense);
            setMonthlySummary(yearSummary);
          } else {
            setMonthlyIncome(0);
            setMonthlyExpense(0);
            setMonthlySummary(null);
          }
        } catch (error) {
          console.error("Failed to load monthly summary", error);
        }
      };

      const getCurrency = async () => {
        try {
          const storedId = await AsyncStorage.getItem("currencyId");
          if (storedId) {
            setSelectedCurrencyId(parseInt(storedId));
          }
        } catch (error) {
          console.error("Failed to load currency:", error);
        }
      };


      loadTransactions();
      getMonthlySummary();
      getCurrency();
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

      const txnToDelete = parsedTx.find(tx => tx.id === selectedTxn); // finding the transaction to delete (storing it - txnToDelete-  coz required later)
      if (!txnToDelete) return;

      const updatedTx = parsedTx.filter(tx => tx.id !== selectedTxn); // removing the transaction from the list
      await AsyncStorage.setItem("transactions", JSON.stringify(updatedTx));
      setTransactions(updatedTx);

      // also updating monthly salary - so when a transaction is deleted, the monthly summary for that current month is updated (subtract that deleted transaction amount from that mothn)
      const monthlySummaryData = await AsyncStorage.getItem("monthlySummary");
      let summary = monthlySummaryData ? JSON.parse(monthlySummaryData) : {};

      const txnDate = parseISO(txnToDelete.date); // coz stored ISO string (txnToDelete required here)
      const year = getYear(txnDate);
      const month = getMonth(txnDate);

      if (summary[year]) {
        if (txnToDelete.type === "Income") { // txnToDelete required here
          summary[year][month].income -= txnToDelete.amount;
          if (summary[year][month].income < 0) summary[year][month].income = 0;
        } else {
          summary[year][month].expense -= txnToDelete.amount;
          if (summary[year][month].expense < 0) summary[year][month].expense = 0;
        }

        await AsyncStorage.setItem("monthlySummary", JSON.stringify(summary));

        // immediately update UI states so that updated values are visible in UI
        const thisMonth = summary[year][month];
        setMonthlyIncome(thisMonth.income);
        setMonthlyExpense(thisMonth.expense);
        setMonthlySummary(summary[year]);
      }
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

  const TransactionItem = ({ item, onLongPressTxn, onPressTxnUpdate }) => {
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
      <TouchableOpacity style={styles.transactionCard} onPress={onPressTxnUpdate}  onLongPress={() => {Vibration.vibrate(10);onLongPressTxn();}}>
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
            {formatCurrency(item.type === "Income" ? item.amount : -item.amount, selectedCurrencyId, theme, {
              iconSize: 10
            })}
          </Text>
          {/* <Text style={styles.paymentType}>{item.title}</Text>  TODO: Need to fix this, get card details here */}
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
                  Total Balance - {getYear(new Date())}
                </Text>
              </View>

              <View style={{ alignItems: "center", marginTop: 10 }}>
                {formatCurrency(getYearlyBalance(monthlySummary), selectedCurrencyId, theme, {
                  textVariant: "displaySmall",
                  iconSize: 22,
                })}
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={{ paddingLeft: 16, paddingRight: 16, marginTop: 16 }}>
          <View style={styles.row}>
            <Card style={[styles.statCard, styles.expenseCard]}>
              <Card.Title title="Expenses" right={LeftContentExpense} />
              <Card.Content>
                <Text variant="titleLarge">  
                  {formatCurrency(monthlyExpense, selectedCurrencyId, theme, {
                    iconSize: 15,
                    textVariant: "titleLarge",
                  })}
                </Text>
                <Text variant="bodySmall">{format(new Date(), "MMMM")}</Text>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, styles.incomeCard]}>
              <Card.Title title="Income" right={RightContentIncome} />
              <Card.Content>
                <Text variant="titleLarge">
                  {formatCurrency(monthlyIncome, selectedCurrencyId, theme, {
                    iconSize: 15,
                    textVariant: "titleLarge",
                  })}
                </Text>
                <Text variant="bodySmall">{format(new Date(), "MMMM")}</Text>
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
        {
          transactions.length <= 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 150 }}>
              <Text style={styles.subText}>Add your first transaction to get started!</Text>
            </View>
          ): (
            <FlatList
              data={transactions.slice(0, 10)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionItem item={item} onLongPressTxn={() => showDialog(item.id)} 
              onPressTxnUpdate={() => navigation.navigate("PlusMoreHome", {title: "Update Expenses", item})}/>}
              showsVerticalScrollIndicator={true}
              ListFooterComponent={<View style={{ marginBottom: 200 }} />}
            />
          )
        }
      </View>
    </View>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("PlusMoreHome", { title: "Add Expenses", item: null })}
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
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    subText: {
      textAlign: "center",
      marginTop: 10,
      marginBottom: 20,
      fontSize: 14,
      opacity: 0.7,
    },
  });

export default HomeScreen;
