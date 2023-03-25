import { View, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { FAB, Text } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";

const AccountsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Accounts" isParent={true} navigation={navigation} />
      <StatusBar translucent backgroundColor={"transparent"} />
      <AnimatedEntryScreen>
        <View>
          <View>
            <Text>Accounts screen</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PlusMoreAccount")}
          >
            <Text>Add card</Text>
          </TouchableOpacity>
        </View>
      </AnimatedEntryScreen>
    </SafeAreaView>
  );
};

export default AccountsScreen;
