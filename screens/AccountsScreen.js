import { View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { FAB, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";
import { useCallback } from "react";
import allColors from "../commons/allColors";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import CardComponent from "../components/CardComponent";
import { useDispatch, useSelector } from "react-redux";
import { storeCard } from "../redux/actions";

const AccountsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const allCards = useSelector(state => state.cardReducer.allCards);

  useFocusEffect(
    useCallback(() => {
      fetchAllCardsData();
    }, [])
  );

  const fetchAllCardsData = async () => {
    try{
      const res = await AsyncStorage.getItem("ALL_CARDS");
      let newData = JSON.parse(res);
      if(newData !== null) dispatch(storeCard(newData));
    }
    catch(e) {
      console.log("error: ", e);
    }
  }

  console.log(allCards);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Accounts"
        isParent={true}
        navigation={navigation}
        isAccountScreenMore={true}
      />
      <StatusBar translucent backgroundColor={"transparent"} />
      <AnimatedEntryScreen>
        <ScrollView>
          <View style={{marginBottom: 120}}>
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
          </View>
        </ScrollView>
      </AnimatedEntryScreen>
      <FAB
        icon="plus"
        onPress={() => navigation.navigate("PlusMoreAccount")}
        mode="flat"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        size="large"
      />
    </SafeAreaView>
  );
};

export default AccountsScreen;
