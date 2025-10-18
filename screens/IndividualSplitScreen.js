import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text, TouchableRipple, DataTable } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { formatCurrency } from "../helper/formatCurrency";
import currencyObj from "../helper/currencyObj";
import { format, parseISO } from "date-fns";

const IndividualSplitScreen = ({ route }) => {
  const { splitId, groupId, createdAt } = route.params;
  const { theme } = useThemeContext();
  const [group, setGroup] = React.useState(null);
  const [split, setSplit] = React.useState(null);
  const [username, setUsername] = React.useState('');
  const tempCreatedDt = parseISO(createdAt);
  const createdAtDate = format(tempCreatedDt, "do MMM, yyyy 'at' h:mm a");
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
      getCurrency();
      fetchData();
    }, [])
  );

  React.useEffect(() => {
    const loadGroup = async () => {
      const storedGroups = await AsyncStorage.getItem("groups");
      const storedSplits = await AsyncStorage.getItem("splits");

      if (storedGroups) {
        const parsedGroups = JSON.parse(storedGroups);
        const foundGroup = parsedGroups.find((g) => g.id === groupId) || null;
        setGroup(foundGroup);
      }

      if (storedSplits) {
        const parsedSplits = JSON.parse(storedSplits);
        const foundSplit = parsedSplits.find((s) => s.id === splitId);
        setSplit(foundSplit || null);
      }
    };
    loadGroup();
  }, [groupId, splitId]);

  if (!split || !group) return null;

  const memberData = group.members.map((memberName, index) => ({
    name: memberName,
    amount: split.memberAmounts[index] || 0,
    paid: split.hasPaid?.[index] || false,
    index,
  }));

    const updateSplitInStorage = async (updatedSplit) => {
      try {
        const storedSplits = await AsyncStorage.getItem("splits");
        if (!storedSplits) return;

        let parsedSplits = JSON.parse(storedSplits);

        // find old version of this split before replacing it
        const oldSplit = parsedSplits.find((s) => s.id === updatedSplit.id);

        // replace with updated one
        parsedSplits = parsedSplits.map((s) =>
          s.id === updatedSplit.id ? updatedSplit : s
        );
        await AsyncStorage.setItem("splits", JSON.stringify(parsedSplits));

        // fetch global values
        const owedDataRaw = await AsyncStorage.getItem("groupOwedData");
        let owedData = owedDataRaw ? JSON.parse(owedDataRaw) : {};

        // Ensure the group exists
        if (!owedData[groupId]) {
          owedData[groupId] = { youAreOwed: 0, youOwe: 0 };
        }

        let { youAreOwed, youOwe } = owedData[groupId];

        // Adjust values for this group only
        if (oldSplit) {
          // Remove old split’s contribution
          youAreOwed -= oldSplit.youAreOwedForThisSplit || 0;
          youOwe -= oldSplit.youOweForThisSplit || 0;
        }

        // Add updated split’s contribution
        youAreOwed += updatedSplit.youAreOwedForThisSplit || 0;
        youOwe += updatedSplit.youOweForThisSplit || 0;

        // Update back in the group object
        owedData[groupId] = { youAreOwed, youOwe };

        // Save all groupsdata
        await AsyncStorage.setItem("groupOwedData", JSON.stringify(owedData));
      } catch (error) {
        console.error("Error updating split in storage:", error);
      }
    };

  // helper: recompute owed values from scratch
  const recomputeOwedValues = (updatedHasPaid) => {
    let youAreOwedForThisSplit = 0;
    let youOweForThisSplit = 0;

    if (split.paidBy === username) {
      // You paid → others owe you unless marked paid
      group.members.forEach((member, i) => {
        if (member !== username && !updatedHasPaid[i]) {
          youAreOwedForThisSplit += Number(split.memberAmounts[i] || 0);
        }
      });
    } else {
      // Someone else paid → you owe unless you’ve marked yourself paid
      const myIndex = group.members.indexOf(username);
      if (myIndex !== -1 && !updatedHasPaid[myIndex]) {
        youOweForThisSplit += Number(split.memberAmounts[myIndex] || 0);
      }
    }

    return {
      youAreOwedForThisSplit: Number(youAreOwedForThisSplit.toFixed(2)),
      youOweForThisSplit: Number(youOweForThisSplit.toFixed(2)),
    };
  };

  const handleTappedMember = async (memberName, index) => {
    // Rules:
    if (split.paidBy === username) {
      // you paid -> can toggle others, but not yourself
      if (memberName === username) return;
    } else {
      // you didn’t pay -> can toggle only yourself
      if (memberName !== username) return;
    }

    const updatedHasPaid = [...(split.hasPaid || new Array(group.members.length).fill(false))];
    updatedHasPaid[index] = !updatedHasPaid[index]; // flip

    // recompute values
    const { youAreOwedForThisSplit, youOweForThisSplit } = recomputeOwedValues(updatedHasPaid);

    const updatedSplit = {
      ...split,
      hasPaid: updatedHasPaid,
      youAreOwedForThisSplit,
      youOweForThisSplit,
    };

    setSplit(updatedSplit);
    await updateSplitInStorage(updatedSplit);
  };

  const renderItem = ({ item }) => {
    return (
    <DataTable.Row
      onPress={() => handleTappedMember(item.name, item.index)}
      style={{
        borderBottomWidth: 1,
        borderColor: "#6e6e6eff",
        marginLeft: 15,
        marginRight: 15,
        marginTop: 0,
      }}
      rippleColor={theme.dark.primaryContainer}
    >
      <DataTable.Cell style={{ flex: 1 }}>
        <Text
          style={[
            { fontSize: 16 },
            item.paid && {
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </DataTable.Cell>

      <DataTable.Cell numeric>
        <Text
          style={[
            { fontWeight: "bold", fontSize: 18 },
            item.paid && {
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            },
          ]}
        >
        {formatCurrency(item.amount, selectedCurrencyId, theme, {
          iconSize: 12,
          textVariant: "titleMedium",
        })}
        </Text>
      </DataTable.Cell>
    </DataTable.Row>
    );
  };

  return (
    <View>
      <View style={{ padding: 15 }}>
        <View style={{ justifyContent: "center", flexDirection: 'row'}}>
          <Text variant="titleMedium">
            Total amount: {" "}
          </Text>
          <Text>
            {formatCurrency(split.amount, selectedCurrencyId, theme, {
              iconSize: 12,
              textVariant: "titleMedium",
            })}
          </Text>
        </View>
        <Text style={{ justifyContent: "center", alignSelf: "center"}}>
          Paid by{" "}
          {split.paidBy === username ? "you" : split.paidBy}
        </Text>


      <View style={styles.container}>
        <Text style={styles.heading}>Summary</Text>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.headerText}>To receive</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.headerText}>To pay</Text>
            </View>
          </View>

          {/* Values Row */}
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text>
                {formatCurrency(split.youAreOwedForThisSplit, selectedCurrencyId, theme, {
                  iconSize: 12,
                  textVariant: "titleMedium",
                }) || 0}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                {formatCurrency(split.youOweForThisSplit, selectedCurrencyId, theme, {
                  iconSize: 12,
                  textVariant: "titleMedium",
                }) || 0}
              </Text>
            </View>
          </View>
        </View>

        <Text variant="bodySmall" style={{ color: 'gray', marginTop: 10, textAlign: 'center' }}>
          Created at: {createdAtDate}
        </Text>
      </View>

      </View>

      <FlatList
        data={memberData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});



export default IndividualSplitScreen;
