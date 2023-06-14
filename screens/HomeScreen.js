import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { FAB, Text, Button } from "react-native-paper";
import { HomeHeader, ExpensesList } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { storeCard } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import * as Notifications from "expo-notifications";

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  selected: {
    backgroundColor: allColors.backgroundColorQuaternary,
    borderRadius: 20,
    text: {
      color: allColors.textColorTertiary,
      fontWeight: 700,
    },
  },
});

const ButtonMemoized = React.memo(({ onPress, isSelected, name }) => (
  <Button
    onPress={onPress}
    compact
    buttonColor={allColors.backgroundColorTertiary}
    style={[styles.btn, isSelected && styles.selected]}
  >
    <Text style={isSelected && styles.selected.text}>{name}</Text>
  </Button>
));

const AppHeaderMemoized = React.memo(AppHeader);

const HomeScreen = ({ navigation, route }) => {
  const [selectedButton, setSelectedButton] = useState("Daily");

  const handleListButtonPress = useCallback((nameOfDate) => {
    setSelectedButton(nameOfDate);
  }, []);

  const datesNames = [
    { name: "Daily" },
    { name: "Weekly" },
    { name: "Monthly" },
    { name: "Yearly" },
    { name: "All" },
  ];
  
  let listToShow;
  if (selectedButton === "Daily") {
    listToShow = <ExpensesList filter="Daily" />;
  } else if (selectedButton === "Weekly") {
    listToShow = <ExpensesList filter="Weekly" />;
  } else if (selectedButton === "Monthly") {
    listToShow = <ExpensesList filter="Monthly" />;
  } else if (selectedButton === "Yearly") {
    listToShow = <ExpensesList filter="Yearly" />;
  } else {
    listToShow = <ExpensesList filter="All" />;
  }

  // #region =========== Fetching card details here only (coz it's the initial screen)
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
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // #endregion =========== End

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const nextScreen = response.notification.request.content.data.headToThisScreen;
      navigation.navigate(nextScreen);
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} />
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
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 10,
                marginLeft: 15,
              }}
            >
              {datesNames.map((date, index) => (
                <ButtonMemoized
                  key={index}
                  onPress={() => handleListButtonPress(date.name)}
                  isSelected={selectedButton === date.name}
                  name={date.name}
                />
              ))}
            </View>
            {listToShow}
          </View>
        </AnimatedEntryScreen>
      </ScrollView>
      <FAB
        animated
        icon="plus"
        onPress={() => navigation.navigate("PlusMoreHome")}
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

export default HomeScreen;
