import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Haptics from 'expo-haptics';
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
import { MaterialIcons } from "react-native-vector-icons";
import * as Notifications from "expo-notifications";
import DeleteDialog from "../components/DeleteDialog";
import { FlashList } from "@shopify/flash-list";
import { Path, Svg } from "react-native-svg";


const RightSideSVG = () => (
  <Svg width="100%" height="100%" viewBox="0 0 298 314" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M100.575 157C113.418 157 125.735 151.624 134.817 142.055C143.898 132.486 149 119.508 149 105.975C149 92.4423 143.898 79.4639 134.817 69.8949C125.735 60.3258 113.418 54.95 100.575 54.95C87.7319 54.95 75.4148 60.3258 66.3334 69.8949C57.2519 79.4639 52.15 92.4423 52.15 105.975C52.15 119.508 57.2519 132.486 66.3334 142.055C75.4148 151.624 87.7319 157 100.575 157ZM185.311 237.777C193.208 241.183 203.251 243.35 216.035 243.35C275.635 243.35 275.635 196.25 275.635 196.25C275.635 190.007 273.282 184.019 269.094 179.603C264.906 175.187 259.225 172.704 253.3 172.7H184.343C190.199 180.173 193.715 189.734 193.715 200.175V205.764C193.683 207.086 193.599 208.406 193.462 209.721C192.447 219.528 189.672 229.046 185.311 237.777ZM253.3 117.75C253.3 128.16 249.375 138.143 242.39 145.504C235.404 152.865 225.929 157 216.05 157C206.171 157 196.696 152.865 189.71 145.504C182.725 138.143 178.8 128.16 178.8 117.75C178.8 107.34 182.725 97.3569 189.71 89.9961C196.696 82.6353 206.171 78.5 216.05 78.5C225.929 78.5 235.404 82.6353 242.39 89.9961C249.375 97.3569 253.3 107.34 253.3 117.75ZM22.35 204.1C22.35 195.772 25.4896 187.785 31.0782 181.897C36.6668 176.008 44.2465 172.7 52.15 172.7H149C156.903 172.7 164.483 176.008 170.072 181.897C175.66 187.785 178.8 195.772 178.8 204.1C178.8 204.1 178.8 266.9 100.575 266.9C22.35 266.9 22.35 204.1 22.35 204.1Z" fill="#D9D9D9" fill-opacity="0.19"/>
  </Svg>
);

const makeStyles = allColors =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.defaultAccSplitRecCard,
      borderRadius: 10,
      margin: 16,
      padding: 16,
    },
    cardContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 10,
    },
    svgContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: '40%', 
      opacity: 0.08,
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
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    )
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
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Title title={nameOfGrp} titleStyle={{ color: allColors.universalColor, fontWeight: '900' }} />
            <Card.Content>
              <MyText variant="bodyMedium" style={{ color: allColors.universalColor }}>
                {values.sort().join(', ')}
              </MyText>
            </Card.Content>
          </Card>
          <View style={styles.svgContainer}>
            <RightSideSVG />
          </View>
        </View>
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
            <MaterialIcons
              name="group-off"
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
