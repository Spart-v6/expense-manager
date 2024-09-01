import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Button } from "react-native-paper";
import { ExpensesList } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { storeCard, storeData } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import { IconComponent } from "../components/IconPickerModal";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import * as Notifications from "expo-notifications";
import useDynamicColors from "../commons/useDynamicColors";
import BigSectionList from "../components/BigSectionList";

const AppHeaderMemoized = React.memo(AppHeader);

const AllExpensesScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  // #region =========== Fetching card details here
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      fetchAllCardsData();
    }, [])
  );

  const fetchAllCardsData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_CARDS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeCard(newData));
    } catch (e) {}
  };
  // #endregion =========== End

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={allColors.barStyle}
      />
      <AppHeaderMemoized title="All Expenses" navigation={navigation} />
      <View style={styles.container}>
        <BigSectionList />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});

export default AllExpensesScreen;
