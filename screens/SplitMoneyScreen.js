import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Vibration,
  StyleSheet,
} from "react-native";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import React, { useCallback, useState } from "react";
import { FAB, Card, Portal, Text } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
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
import * as Notifications from "expo-notifications";
import DeleteDialog from "../components/DeleteDialog";
import { FlashList } from "@shopify/flash-list";

const makeStyles = allColors =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.defaultAccSplitRecCard,
      borderRadius: 10,
      margin: 16,
      padding: 16,
    },
  });

const SplitMoneyScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
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
    } catch (e) {}
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
    } catch (e) {}
  };
  // #endregion =========== End

  
  // #region going to scr thru notifications
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const nextScreen = response.notification.request.content.data.headToThisScreen;
      navigation.navigate(nextScreen);
    });
    return () => subscription.remove();
  }, []);
  // #endregion


  const groupsData = useSelector((state) => state.groupsReducer.allGroups);
  const sectionsData = useSelector((state) => state.sectionReducer.allSections);

  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const hideDialog = () => setDeleteDialogVisible(false);

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

  const renderItem = useCallback(({ item }) => {
    const { identity, nameOfGrp } = item.find(
      (obj) => obj.hasOwnProperty('identity') && obj.hasOwnProperty('nameOfGrp')
    );
    const otherObjects = item.filter((obj) => !obj.nameOfGrp);
    const values = otherObjects.map((obj) => obj.value);
  
    return (
      <TouchableOpacity
        onLongPress={() => handleLongDeleteGroup(identity)}
        onPress={() =>
          navigation.navigate('SplitSection', {
            identity,
            nameOfGrp,
            values,
          })
        }
        style={{ gap: 20 }}
        activeOpacity={0.9}
      >
        <Card style={styles.card}>
          <Card.Title title={nameOfGrp} titleStyle={{ color: allColors.universalColor, fontWeight: '900' }} />
          <Card.Content>
            <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>
              {values.sort().join(', ')}
            </MyText>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  },[allColors]);
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeader title="Split Money" isParent={true} navigation={navigation} />
      <AnimatedEntryScreen>
        {groupsData?.length > 0 ? (
          <FlashList
            data={groupsData}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            estimatedItemSize={200}
          />
        ): (
          <View style={{justifyContent: "center", alignItems: 'center', flex: 1, marginBottom: 100}}>
            <FontAwesome
              name="ban"
              size={60}
              color={allColors.textColorPrimary}
            />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <MyText variant="titleMedium" style={{color: allColors.universalColor}}>
                You don't have groups yet.
              </MyText>
              <MyText variant="bodySmall" style={{color: allColors.universalColor}}>
                Click on "+" button to start adding groups
              </MyText>
            </View>
          </View>
        )}
      </AnimatedEntryScreen>
      <FAB
        animated
        icon="account-multiple-plus"
        color={allColors.universalColor}
        onPress={() => navigation.navigate("PlusMoreGroup")}
        mode="elevated"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        customSize={70}
      />
      <Portal>
        <DeleteDialog
          visible={isDeleteDialogVisible}
          hideDialog={hideDialog}
          deleteExpense={handleDelete}
          allColors={allColors}
          title={"group"}
          content={"group"}
        />
      </Portal>
    </SafeAreaView>
  );
};

export default SplitMoneyScreen;
