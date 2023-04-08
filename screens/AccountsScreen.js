import { View, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { FAB, Text } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import CardComponent from "../components/CardComponent";

const AccountsScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Accounts"
        isParent={true}
        navigation={navigation}
        needSearch={true}
      />
      <StatusBar translucent backgroundColor={"transparent"} />
      <AnimatedEntryScreen>
        <ScrollView>
          <View style={{marginBottom: 120}}>
            <CardComponent navigation={navigation}/>
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
        customSize={70}
      />
    </SafeAreaView>
  );
};

export default AccountsScreen;
