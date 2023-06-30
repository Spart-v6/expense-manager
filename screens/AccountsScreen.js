import { View, SafeAreaView, StatusBar } from "react-native";
import { FAB } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import useDynamicColors from "../commons/useDynamicColors";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import CardComponent from "../components/CardComponent";
import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

const AccountsScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  const [isSearchAccount, setIsSearchAccounts ] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Accounts"
        isParent={true}
        navigation={navigation}
        isSearch={val => setIsSearchAccounts(val)}
      />
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle} />
      <AnimatedEntryScreen>
        <CardComponent navigation={navigation}/>
      </AnimatedEntryScreen>
      <FAB
        animated
        icon="plus"
        color={allColors.universalColor}
        onPress={() => navigation.navigate("PlusMoreAccount")}
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

export default AccountsScreen;
