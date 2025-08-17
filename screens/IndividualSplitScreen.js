import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { FlatList, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";

const IndividualSplitScreen = ({ route }) => {
  const { splitId, groupId } = route.params;
  const { theme } = useThemeContext();
  const [group, setGroup] = React.useState(null);
  const [split, setSplit] = React.useState(null);
  const username = "Happy"; // later fetch from AsyncStorage if needed

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
        const [owedRaw, oweRaw] = await Promise.all([
          AsyncStorage.getItem("youAreOwed"),
          AsyncStorage.getItem("youOwe"),
        ]);

        let youAreOwed = owedRaw ? JSON.parse(owedRaw) : 0;
        let youOwe = oweRaw ? JSON.parse(oweRaw) : 0;

        if (oldSplit) {
          // remove old split contribution
          youAreOwed -= oldSplit.youAreOwedForThisSplit || 0;
          youOwe -= oldSplit.youOweForThisSplit || 0;
        }

        // add new split contribution
        youAreOwed += updatedSplit.youAreOwedForThisSplit || 0;
        youOwe += updatedSplit.youOweForThisSplit || 0;

        // save new totals
        await Promise.all([
          AsyncStorage.setItem("youAreOwed", JSON.stringify(youAreOwed)),
          AsyncStorage.setItem("youOwe", JSON.stringify(youOwe)),
        ]);
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
      // you paid → can toggle others, but not yourself
      if (memberName === username) return;
    } else {
      // you didn’t pay → can toggle only yourself
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
      <TouchableRipple
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderBottomWidth: 1,
          borderColor: "#6e6e6eff",
          marginLeft: 15,
          marginRight: 15,
          marginTop: 2,
        }}
        rippleColor={theme.dark.primaryContainer}
        onPress={() => handleTappedMember(item.name, item.index)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={[
              { fontSize: 16, flex: 1 },
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
          <Text
            style={[
              { fontWeight: "bold", fontSize: 18 },
              item.paid && {
                textDecorationLine: "line-through",
                textDecorationStyle: "solid",
              },
            ]}
          >
            ₹ {item.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableRipple>
    );
  };

  return (
    <View>
      <View style={{ padding: 15 }}>
        <Text>Total Amount: ₹ {split.amount.toFixed(2)}</Text>
        <Text>
          {split.paidBy === username ? "You paid" : `${split.paidBy} paid`}
        </Text>
        <Text>You Are Owed: ₹ {(split.youAreOwedForThisSplit || 0).toFixed(2)}</Text>
        <Text>You Owe: ₹ {(split.youOweForThisSplit || 0).toFixed(2)}</Text>
      </View>

      <FlatList
        data={memberData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default IndividualSplitScreen;
