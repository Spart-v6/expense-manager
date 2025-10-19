import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, useColorScheme } from "react-native";
import { Text, TextInput, RadioButton, Button, ToggleButton, Snackbar } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import IconComponent from "../components/IconComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { formatCurrency } from "../helper/formatCurrency";
import currencyObj from "../helper/currencyObj";

const updateOwedAggregates = async (split, username, groupId) => {
  try {
    const owedDataRaw = await AsyncStorage.getItem('groupOwedData');
    let owedData = owedDataRaw ? JSON.parse(owedDataRaw) : {};

    // Ensure group entry exists
    if (!owedData[groupId]) {
      owedData[groupId] = { youAreOwed: 0, youOwe: 0 };
    }

    const { youAreOwed, youOwe } = owedData[groupId];

    // Calculate new values
    const total = Number(split.amount) || 0;
    const yourShare = Number(split.memberAmounts?.[0]) || 0;

    let newYouAreOwed = youAreOwed;
    let newYouOwe = youOwe;

    if (split.paidBy === username) {
      newYouAreOwed += (total - yourShare);
    } else {
      newYouOwe += yourShare;
    }
    // Update the group's data
    owedData[groupId] = { youAreOwed: newYouAreOwed, youOwe: newYouOwe };

    await AsyncStorage.setItem('groupOwedData', JSON.stringify(owedData));

    return owedData[groupId];
  } catch (e) {
    console.error('Failed updating owed aggregates', e);
    return null;
  }
};

const PlusMoreSplitDetailScreen = ({ route, navigation }) => {
  const { groupId, members } = route.params;
  const { theme } = useThemeContext();
  const colorScheme = useColorScheme();
  const styles = makeStyles(theme, colorScheme);

  const [splitName, setSplitName] = useState("");
  const [amount, setAmount] = useState("");
  const [splitMode, setSplitMode] = useState("equal"); // 'equal', 'percent', 'manual'
  const [paidBy, setPaidBy] = useState(members[0]);
  const [memberAmounts, setMemberAmounts] = useState([]);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [username, setUsername] = useState('');

  const [selectedCurrencyId, setSelectedCurrencyId] = React.useState(currencyObj[0].id);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const name = await AsyncStorage.getItem("username");
          setUsername(name);
        } catch (error) {
          console.error("Failed to load data:", error);
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
      fetchData();
      getCurrency();
    }, [])
  );
  

  useEffect(() => {
    if (splitMode === "equal" && amount && members.length > 0) {
      const perMember = (parseFloat(amount) / members.length).toFixed(2);
      setMemberAmounts(members.map(() => perMember));
    }
  }, [splitMode, amount, members]);

  const onToggleBasedOnSplitMode = value => {
    if (value) setSplitMode(value);
    if (value !== "equal") {
      setMemberAmounts([]);
    }
  }

  const renderManualSplit = () => {
    let total = memberAmounts.reduce((sum, val) => sum + Number(val), 0);
    let pendingAmount = amount - total;
    return (
      <View style={{marginBottom: 10, marginTop: 10}}>
        <View style={{ flexDirection: "row" }}>
          <Text> Pending amount: {""} </Text>
          <Text style={pendingAmount < 0 ? { color: "red" } : { color: "green" }}>
            {formatCurrency(pendingAmount, selectedCurrencyId, theme, colorScheme, 
            pendingAmount < 0 && "#ff4d4d",
            {
              iconSize: 12,
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderPercentageSplit = () => {
    let totalPercent = 100;
    let total = memberAmounts.reduce((sum, val) => sum + Number(val), 0);
    let pendingPercent = totalPercent - total;
    let pendingAmount = (pendingPercent / 100) * Number(amount || 0);

    return (
      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text> Pending percentage:{" "} </Text>
            <Text style={pendingPercent < 0 ? { color: "red" } : { color: "green" }}>{pendingPercent}%</Text>
          </View>


          <View style={{ flexDirection: "row" }}>
            <Text> Pending amount:{" "} </Text>
            <Text style={pendingPercent < 0 ? { color: "red" } : { color: "green" }}>
              {formatCurrency(pendingAmount, selectedCurrencyId, theme, colorScheme, 
              pendingPercent < 0  && "#ff4d4d",
              {
                iconSize: 12,
                // textVariant: "titleMedium",
              })}
            </Text>
          </View>

        </View>
      </View>

    );
  }

  const showError = (msg) => {
    setError(msg);
    setSnackbarVisible(true);
  };

  const handleSaveNewSplit = async () => {
    if (!splitName || !amount || !paidBy) {
      return showError("Please fill all fields");
    }

  // Manual validation
    if (splitMode === "manual") {
      if ((memberAmounts.some(val => val === "" || val === undefined) || memberAmounts.length === 0)) {
        return showError("Please enter amounts for all members");
      }
      const totalAmount = memberAmounts.reduce((sum, val) => sum + Number(val), 0);
      if (totalAmount !== Number(amount)) {
        return showError("Total manual amounts must equal the split amount");
      }
    }

    // Percent validation
    if (splitMode === "percent") {
      if ((memberAmounts.some(val => val === "" || val === undefined) || memberAmounts.length === 0)) {
        return showError("Please enter % for all members");
      }
      const totalPercent = memberAmounts.reduce((sum, val) => sum + Number(val), 0);
      if (totalPercent !== 100) {
        return showError("Total % must be exactly 100%");
      }
    }

    // IMP: Transforrming the percent values to actual amounts
    let finalAmounts = memberAmounts;
    if (splitMode === "percent") {
      finalAmounts = memberAmounts.map(p => (Number(amount) * Number(p)) / 100);
    }

    // IMP: adding youOweForThisSplit and youAreOwedForThisSplit 
    // const username = await AsyncStorage.getItem('username'); // e.g. "Happy"
    let youAreOwedForThisSplit = 0;
    let youOweForThisSplit = 0;

    const totalForThisSplit     = Number(amount) || 0;
    const yourShareForThisSplit = Number(finalAmounts?.[0]) || 0;

    if (paidBy === username) {
      youAreOwedForThisSplit += (totalForThisSplit - yourShareForThisSplit);
    } else {
      youOweForThisSplit += yourShareForThisSplit;
    }

    const hasPaid = members.map((m, idx) => {
      if (paidBy === username) {
        return m === username;
      } else {
        return m === paidBy;
      }
    });



    const newSplit = {
      id: Date.now().toString(),
      groupId, // saving groupId to associate with this split, and use it in SplitDetailsScreen to fitler the related splits
      createdAt: new Date().toISOString(), // saving at what time it was created
      name: splitName.trim(),
      amount: parseFloat(amount),
      splitMode,
      paidBy,
      memberAmounts: finalAmounts.map(val => Number(val)),
      youAreOwedForThisSplit,
      youOweForThisSplit,
      hasPaid // an array to keep track of who has paid in boolean values (since all index (in all diffferent arr) matches their names - amounts and has paid or not)
    };

    // NOTE: Creating "You are owed", and "You owe" amounts for you (total aggregates - for indivvidual groups)
    await updateOwedAggregates(newSplit, username, groupId);

    try {
      const storedSplits = await AsyncStorage.getItem('splits');
      const splits = storedSplits ? JSON.parse(storedSplits) : [];
      splits.push(newSplit);
      await AsyncStorage.setItem('splits', JSON.stringify(splits));
      navigation.goBack();
    } catch (err) {
      console.error('Error saving Split', err);
      showError('Failed to save Split.');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Split Name"
        value={splitName}
        onChangeText={setSplitName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => {
          let cleaned = text.replace(/[^0-9.]/g, ''); // no special characters and characters
          let parts = cleaned.split('.');

          // limit integer part to 7 digits
          if (parts[0].length > 7) {
            parts[0] = parts[0].slice(0, 7);
          }

          // limit decimal part to 3 digits if present
          if (parts.length > 1) {
            parts[1] = parts[1].slice(0, 3);
          }

          // if more dots (decimals) then get only 1st one
          cleaned = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];

          setAmount(cleaned);

          // setting setMemberAmounts to empty if amount is changed to 0 or empty
          if (cleaned === "" || cleaned === "0") {
            setMemberAmounts([]);
          }
        }}

        mode="outlined"
        style={styles.input}
      />

      <ToggleButton.Row
        onValueChange={value => onToggleBasedOnSplitMode(value)}
        value={splitMode}
        style={[styles.toggleRow, splitMode === "equal" && {marginBottom: 20 }]}
      >
        <ToggleButton icon={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconComponent
              iconSet={"FontAwesome6"}
              iconName={"equals"}
              backgroundColor={theme[colorScheme].surface}
              color={theme[colorScheme].surfaceTint}
              size={15}
            />
            <Text style={{ marginLeft: 5 }}>Equal</Text>
          </View>
        )} value="equal" style={{flex: 1, borderWidth: 2}}/>

        <ToggleButton icon={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconComponent
                iconSet={"MaterialIcons"}
                iconName={"percent"}
                backgroundColor={theme[colorScheme].surface}
                color={theme[colorScheme].surfaceTint}
                size={15}
              />
            <Text style={{ marginLeft: 5 }}>Percent</Text>
          </View>
        )} value="percent"  style={{flex: 1, borderWidth: 2}} />

        <ToggleButton icon={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconComponent
                iconSet={"Ionicons"}
                iconName={"calculator-outline"}
                backgroundColor={theme[colorScheme].surface}
                color={theme[colorScheme].surfaceTint}
                size={15}
              />
            <Text style={{ marginLeft: 5 }}>Manual</Text>
          </View>
        )} value="manual"  style={{flex: 1, borderWidth: 2}} />
      </ToggleButton.Row>

      {splitMode === "manual" && renderManualSplit()}
      {splitMode === "percent" && renderPercentageSplit()}

      <FlatList
        data={members}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View style={[styles.memberRow, { marginBottom: 5, marginLeft: 5 }]}>
            <Text style={[styles.headerText, { flex: 0.25 }]}>Paid by</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Name</Text>
            <Text style={[styles.headerText, { width: 100 }]}>Amount</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View style={styles.memberRow}>
            <RadioButton
              value={item}
              status={paidBy === item ? "checked" : "unchecked"}
              onPress={() => setPaidBy(item)}
            />
            <Text style={styles.memberName}>{item}</Text>
            <TextInput
              mode="outlined"
              style={styles.amountInput}
              value={memberAmounts[index]?.toString() || ""}
              onChangeText={(val) => {
                const cleaned = val.replace(/[^0-9.]/g, "").slice(0, 4);
                const updated = [...memberAmounts];
                updated[index] = cleaned;
                setMemberAmounts(updated);
              }}
              keyboardType="number-pad"
              right={
                splitMode === "percent"
                  ? <TextInput.Affix text="%" />
                  : null
              }
            />
          </View>
        )}
      />

      <Button mode="contained" style={styles.saveBtn} onPress={handleSaveNewSplit}>
        Save Split
      </Button>

      <Snackbar
        style={{
          position: "absolute",
          left: 20,
          right: 0,
          bottom: 0,
        }}
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: { marginBottom: 10 },
    toggleRow: { marginVertical: 10, marginTop: 10 },
    memberRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      marginLeft: 6
    },
    memberName: { flex: 1, fontSize: 16, marginLeft: 20 },
    amountInput: { width: 100, height: 40 },
    saveBtn: { marginTop: 20 },
    headerText: {
      fontWeight: "bold",
      fontSize: 14
    }
  });

export default PlusMoreSplitDetailScreen;
