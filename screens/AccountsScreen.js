import { View, SafeAreaView, TouchableOpacity } from "react-native";
import { FAB, Text } from "react-native-paper";
import AppHeader from "../components/AppHeader";

const AccountsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Accounts" isParent={true} navigation={navigation}/>
      <View>
        <Text>Accounts screen</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("PlusMoreAccount")}>
        <Text>Add card</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountsScreen;
