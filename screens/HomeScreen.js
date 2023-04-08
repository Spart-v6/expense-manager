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
import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { storeCard } from "../redux/actions";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";

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

const HomeScreen = ({ navigation, route }) => {
  const [selectedButton, setSelectedButton] = useState("Daily");

  const [listToShow, setListToShow] = useState(
    <ExpensesList filter={selectedButton} />
  );

  const handleListButtonPress = (nameOfDate) => {
    setSelectedButton(nameOfDate);
    setListToShow(<ExpensesList filter={nameOfDate} />);
  };

  const datesNames = [
    { name: "Daily" },
    { name: "Weekly" },
    { name: "Monthly" },
    { name: "Yearly" },
    { name: "All" },
  ];

  // =========== Fetching card details here only (coz it's the initial screen), no need to fetch it when user clicks on Accounts page
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
  // =========== End

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader
        title="Home"
        isParent={true}
        navigation={navigation}
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
                <Button
                  onPress={() => handleListButtonPress(date.name)}
                  mode="contained"
                  key={index}
                  compact
                  dark
                  buttonColor={allColors.backgroundColorTertiary}
                  style={[
                    styles.btn,
                    selectedButton === date.name && styles.selected,
                  ]}
                >
                  <Text
                    style={selectedButton === date.name && styles.selected.text}
                  >
                    {date.name}
                  </Text>
                </Button>
              ))}
            </View>
            {listToShow}
          </View>
        </AnimatedEntryScreen>
      </ScrollView>
      <FAB
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
