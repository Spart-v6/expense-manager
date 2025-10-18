import React from "react";
import { View, StyleSheet, useColorScheme, FlatList, Dimensions } from "react-native";
import { Text, FAB, Card, Avatar } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Portal, Dialog, Button } from "react-native-paper";

const SplitScreen = ({ navigation }) => {
  const screenHeight = Dimensions.get("window").height;
  const cardHeight = 300; 
  const initialSpacerHeight = screenHeight / 2 - cardHeight / 2;


  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();
  const styles = makeStyles(theme, colorScheme);
  const [groups, setGroups] = React.useState([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState(null);

  const handleLongPress = (groupId) => {
    setSelectedGroupId(groupId);
    setDeleteDialogVisible(true);
  };

  const deleteGroup = async () => {
    try {
      const stored = await AsyncStorage.getItem("groups");
      if (stored) {
        const parsed = JSON.parse(stored).filter(
          (g) => g.id !== selectedGroupId
        );
        await AsyncStorage.setItem("groups", JSON.stringify(parsed));
        setGroups(parsed); // Update UI
      }
    } catch (err) {
      console.error("Failed to delete group", err);
    }
    setDeleteDialogVisible(false);
    setSelectedGroupId(null);
  };

  React.useEffect(() => {
    const loadGroups = async () => {
      try {
        const stored = await AsyncStorage.getItem("groups");
        if (stored) {
          setGroups(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", loadGroups);
    return unsubscribe;
  }, [navigation]);

  const renderGroup = ({ item }) => (
    <Card
      style={styles.card}
      mode="elevated"
      onPress={() =>
        navigation.navigate("SplitDetailsScreen", { title: item.name, groupId: item.id })
      }
      onLongPress={() => handleLongPress(item.id)}
    >
      <Card.Title
        title={item.name}
        titleStyle={styles.cardTitle}
        subtitle={`${item.members.length} member${
          item.members.length > 1 ? "s" : ""
        }`}
        subtitleStyle={styles.cardSubtitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="account-group-outline"
            style={styles.avatar}
            color={theme.dark.onPrimaryContainer}
          />
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      {groups.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.heading}>Keep track of shared costs</Text>
          <Text style={styles.heading}>
            for <Text style={styles.highlight}>trips, bills, or anything!</Text>
          </Text>
          <Text style={styles.subText}>Tap + to create a group</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={{ 
              height: initialSpacerHeight, 
              justifyContent: "center", 
              alignItems: "center" 
            }}>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: "bold", 
                opacity: 0.8,
                textAlign: "center",
                color: theme[colorScheme].tertiary,
              }}>
                Manage your groups here
              </Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("PlusMoreSplit")}
        variant="tertiary"
        mode="flat"
        color={theme.dark.onPrimaryContainer}
      />
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Group</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this group?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={deleteGroup} textColor="red">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const makeStyles = (theme, colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme[colorScheme].background,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    heading: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 5,
    },
    highlight: {
      color: theme.dark.primary,
    },
    subText: {
      textAlign: "center",
      marginTop: 10,
      marginBottom: 20,
      fontSize: 14,
      opacity: 0.7,
    },
    listContent: {
      padding: 16,
    },
    card: {
      marginBottom: 12,
      borderRadius: 12,
      overflow: "hidden",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.dark.outline,
    },
    avatar: {
      backgroundColor: theme.dark.primaryContainer,
    },
    fab: {
      backgroundColor: theme.dark.primaryContainer,
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
      elevation: 5,
    },
  });

export default SplitScreen;
