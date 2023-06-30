import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { FAB, Button } from "react-native-paper";
import { HomeHeader, ExpensesList } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { storeCard } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import { IconComponent } from "../components/IconPickerModal";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import RecentTransaction from "../components/RecentTransaction";

const makeStyles = allColors => StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  selected: {
    backgroundColor: allColors.backgroundColorDatesSelected,
    borderRadius: 20,
    text: {
      color: allColors.textColorPrimary,
      fontFamily: "Rubik_500Medium"
    },
  },
  notSelected: {
    color: allColors.textColorSecondary,
  }
});

const ButtonMemoized = React.memo(({ onPress, isSelected, name }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  return (
    <Button
      onPress={onPress}
      compact
      buttonColor={allColors.backgroundColorDates}
      style={[styles.btn, isSelected && styles.selected]}
    >
      <MyText style={[styles.notSelected, isSelected && styles.selected.text]}>{name}</MyText>
    </Button>
  )
});

const AppHeaderMemoized = React.memo(AppHeader);

const HomeScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeaderMemoized
        title="Home"
        isParent={true}
        navigation={navigation}
        isHome
        needSearch={true}
      />
      <ScrollView>
        <AnimatedEntryScreen>
          <HomeHeader />
          <View style={{margin: 16, gap: 10}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <MyText style={{padding: 15, paddingLeft: 0}} variant="titleMedium">
                Recent transactions
              </MyText>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10
                }}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("AllExpensesScreen")}
              >
                <MyText variant="titleMedium">View all</MyText>
                <IconComponent
                  name={"arrow-right"}
                  category={"Octicons"}
                  color={allColors.addBtnColors}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <RecentTransaction/>
          </View>
        </AnimatedEntryScreen>
      </ScrollView>
      <FAB
        animated
        icon="plus"
        color={allColors.universalColor}
        onPress={() => navigation.navigate("PlusMoreHome")}
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
    </SafeAreaView>
  );
};

export default HomeScreen;
