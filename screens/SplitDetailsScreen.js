import React from "react";
import { View, StyleSheet, FlatList, useColorScheme } from "react-native";
import {
  Text,
  Avatar,
  FAB,
  IconButton,
  Portal,
  Dialog,
  List,
  Card,
  Button,
} from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplitDetailsScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { theme } = useThemeContext();
  const colorScheme = useColorScheme();
  const styles = makeStyles(theme, colorScheme);
  const [group, setGroup] = React.useState(null); // to get the groupId of current group (from list of groups and match with the one which we passed)
  const [membersVisible, setMembersVisible] = React.useState(false);
  const [splits, setSplits] = React.useState([]);
  const [youAreOwed, setYouAreOwed] = React.useState(0);
  const [youOwe, setYouOwe] = React.useState(0);

    // const username = await AsyncStorage.getItem('username'); 
  const username = "Happy";


  React.useEffect(() => {
    const loadGroup = async () => {
      const storedGroups = await AsyncStorage.getItem("groups");      

      let foundGroup = null;
      if (storedGroups) {
        const parsedGroups = JSON.parse(storedGroups);
        foundGroup = parsedGroups.find((g) => g.id === groupId) || null;
        setGroup(foundGroup);
      }
    };
    loadGroup();
  }, [groupId]);

  useFocusEffect(
    React.useCallback(() => {
      const loadSplits = async () => {
        const storedSplits = await AsyncStorage.getItem("splits");
        const youAreOwedAmount = await AsyncStorage.getItem("youAreOwed");
        const youOweAmount = await AsyncStorage.getItem("youOwe");
        if (storedSplits) {
          const parsedSplits = JSON.parse(storedSplits);
          const groupSplits = parsedSplits.filter(
            (split) => split.groupId === groupId
          );
          setSplits(groupSplits);
        };
        if (youAreOwedAmount) {
          const parsedYouAreOwed = JSON.parse(youAreOwedAmount);     
          setYouAreOwed(Number(parsedYouAreOwed));
        };
        if (youOweAmount) {
          const parsedYouOwe = JSON.parse(youOweAmount);
          setYouOwe(Number(parsedYouOwe));
        };
      };
      loadSplits();
    }, [])
  );


  const ShowAllMembers = () => {
    return (
      <View style={{ marginLeft: 20, marginRight: 20 }}>
        <Button
          mode="contained"
          style={styles.showMembersBtn}
          labelStyle={{ fontSize: 15 }}
          onPress={() => setMembersVisible(true)}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Show all members
          </Text>
        </Button>
      </View>
    );
  };

  const renderSplitCard = (split) => (
    <Card style={{ margin: 10 }} key={split.id}
      onPress={() =>
        navigation.navigate("IndividualSplitScreen", {
          splitId: split.id,
          groupId: groupId,
          title: split.name,
        })
    }>
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, flex: 1, }} numberOfLines={1} ellipsizeMode="tail" >
            {split.name}
          </Text>
          <Text style={{ color: "#666", marginLeft: 10, flexShrink: 1, textAlign: "right", }} numberOfLines={1} ellipsizeMode="tail" >
            Paid by: {split.paidBy}
          </Text>
        </View>

        <View style={{ height: 10 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }} numberOfLines={1} ellipsizeMode="tail" >
            ₹ {split.amount.toFixed(2)}
          </Text>
          <Text style={{ color: split.paidBy === username ? "green" : "red", flexShrink: 1, textAlign: "right", }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {split.paidBy === username
              ? `You receive: ${split.youAreOwedForThisSplit}`
              : `You pay: ${split.youOweForThisSplit}`}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );


  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <Card style={[styles.summaryCard, { backgroundColor: "#1d581dff" }]}>
          <Text style={styles.summaryTitle}>Others owe you</Text>
          <Text style={styles.summaryAmount}>₹ {youAreOwed}</Text>
        </Card>
        <Card style={[styles.summaryCard, { backgroundColor: "#631212ff" }]}>
          <Text style={styles.summaryTitle}>You owe others</Text>
          <Text style={styles.summaryAmount}>₹ {youOwe}</Text>
        </Card>
      </View>

      <View style={{ flex: 1 }}>
        <ShowAllMembers />
        {splits.length > 0 ? (
          splits.map((split) => renderSplitCard(split))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No splits yet. Add one using the + button.
          </Text>
        )}
      </View>

      <Portal>
        <Dialog
          visible={membersVisible}
          onDismiss={() => setMembersVisible(false)}
        >
          <Dialog.Title>Group Members</Dialog.Title>
          <Dialog.Content>
            {group?.members.map((m, idx) => (
              <Text key={idx} style={{ marginBottom: 5 }}>
                {m}
              </Text>
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() =>
          navigation.navigate("PlusMoreSplitDetailScreen", { groupId: group.id, members: group.members })
        }
        variant="tertiary"
        mode="flat"
        color={theme.dark.onPrimaryContainer}
      />
    </View>
  );
};

const makeStyles = (theme, colorScheme) =>
StyleSheet.create({
    container: { flex: 1 },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    summaryCard: {
        flex: 1,
        margin: 5,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    summaryTitle: { fontSize: 14, fontWeight: "bold" },
    summaryAmount: { fontSize: 18, fontWeight: "bold" },
    fab: {
        backgroundColor: theme.dark.primaryContainer,
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        elevation: 5,
    },
    showMembersBtn: {
        paddingVertical: 2,
        borderRadius: 0,
        backgroundColor: theme[colorScheme].primaryContainer
    },
});

export default SplitDetailsScreen;
