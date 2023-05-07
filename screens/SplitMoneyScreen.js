import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Vibration,
  StyleSheet,
} from "react-native";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import React, { useCallback, useState } from "react";
import { FAB, Card, Dialog, Button } from "react-native-paper";
import allColors from "../commons/allColors";
import { useSelector, useDispatch } from "react-redux";
import {
  storeGroups,
  deleteGroups,
  storeSections,
  deleteGroupAndSections,
} from "../redux/actions";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "react-native-vector-icons";

const makeStyles = () =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.backgroundColorLessPrimary,
      borderRadius: 25,
      margin: 16,
      padding: 16,
    },
  });

const SplitMoneyScreen = ({ navigation }) => {
  const styles = makeStyles();
  const dispatch = useDispatch();
  // #region getting groups stuff
  useFocusEffect(
    useCallback(() => {
      fetchAllGroups();
    }, [])
  );

  const fetchAllGroups = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_GROUPS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeGroups(newData));
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // #endregion =========== End

  // #region getting sections of groups for delete group+section stuff
  useFocusEffect(
    useCallback(() => {
      fetchAllSections();
    }, [])
  );

  const fetchAllSections = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_SECTIONS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeSections(newData));
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // #endregion =========== End

  const groupsData = useSelector((state) => state.groupsReducer.allGroups);
  const sectionsData = useSelector((state) => state.sectionReducer.allSections);

  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const handleLongDeleteGroup = (identity) => {
    setSelectedItemToDelete(identity);
    setDeleteDialogVisible(true);
    Vibration.vibrate(1);
  };

  const handleDelete = () => {
    const itemsToDelete = sectionsData
      .filter(
        (innerArray) =>
          innerArray.length >= 1 &&
          innerArray[innerArray.length - 1].groupIdentity ===
            selectedItemToDelete
      )
      .map((innerArray) => innerArray[innerArray.length - 1])
      .map(({ id }) => id);

    setDeleteDialogVisible(false);
    dispatch(deleteGroups(selectedItemToDelete));
    if (itemsToDelete.length > 0) dispatch(deleteGroupAndSections(itemsToDelete));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader title="Split Money" isParent={true} navigation={navigation} />
      <AnimatedEntryScreen>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {groupsData?.length > 0 ? (
              groupsData.map((innerArray, index) => {
                const { identity, nameOfGrp } = innerArray.find(
                  (obj) => obj.nameOfGrp
                );
                const otherObjects = innerArray.filter((obj) => !obj.nameOfGrp);
                const values = otherObjects.map((obj) => obj.value);

                return (
                  <TouchableOpacity
                    key={index}
                    onLongPress={() => handleLongDeleteGroup(identity)}
                    onPress={() =>
                      navigation.navigate("SplitSection", {
                        identity,
                        nameOfGrp,
                        values,
                      })
                    }
                    style={{ gap: 20 }}
                    activeOpacity={0.8}
                  >
                    <Card style={styles.card}>
                      <Card.Title title={nameOfGrp} />
                      <Card.Content>
                        <Text>{values.join(", ")}</Text>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  height: 700,
                  gap: 20,
                }}
              >
                <FontAwesome
                  name="ban"
                  size={60}
                  color={allColors.backgroundColorSecondary}
                />
                <Text variant="titleMedium" style={{ color: "white" }}>
                  You don't have groups yet.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <Dialog
          visible={isDeleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Title>Delete group?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ color: "white" }}>
              The group will be removed permanently
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={handleDelete}
              mode="elevated"
              contentStyle={{ width: 60 }}
              buttonColor={allColors.warningColor}
            >
              <Text style={{ color: allColors.textColorTertiary }}>Sure</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </AnimatedEntryScreen>
      <FAB
        animated
        icon="account-multiple-plus"
        onPress={() => navigation.navigate("PlusMoreGroup")}
        mode="flat"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        customSize={70}
      />
    </SafeAreaView>
  );
};

export default SplitMoneyScreen;

/*
plus more groups
* Create groups and add people in the main screen thru add button (group name and group members names)
plus more section
* Upon clicking the group u can view different sections for the split of the money, like Little Chef restaurant or Ice Cream or Movie  ( a dashboard which display how much u need to pay and how much they [in total] need to pay and section name )  or (a pie chart or wheterver chart suits best for displaying all the sections total amount and sections of course)

! Also when creating a new section inside a group, all the members should have a chcekbox like which n which guy should be added to that section !
// view sections
* Upon clicking the sections u can see all members of the group with their money owed and what u have to pay them for (also a dashboard dislaying wht u need to pay and vice versa with a flatlist displaying each members money owed or need to pay)


*/
