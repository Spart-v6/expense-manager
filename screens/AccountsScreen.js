import { View, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { FAB, Text } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import CardComponent from "../components/CardComponent";
import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

const AccountsScreen = ({ navigation }) => {
  const [isSearchAccount, setIsSearchAccounts ] = useState(false);

  // #region going to scr thru notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const nextScreen = response.notification.request.content.data.headToThisScreen;
      navigation.navigate(nextScreen);
    });
    return () => subscription.remove();
  }, []);
  // #endregion

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Accounts"
        isParent={true}
        navigation={navigation}
        isSearch={val => setIsSearchAccounts(val)}
      />
      <StatusBar translucent backgroundColor={"transparent"} />
      <AnimatedEntryScreen>
        <ScrollView>
          <View>
            <CardComponent navigation={navigation}/>
          </View>
        </ScrollView>
      </AnimatedEntryScreen>
      <FAB
        animated
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
        customSize={70}
      />
    </SafeAreaView>
  );
};

export default AccountsScreen;
