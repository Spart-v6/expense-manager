import { View, Text, SafeAreaView, StatusBar } from "react-native";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import React from "react";

const SplitMoneyScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader title="Split Money" isParent={true} navigation={navigation} />
      <AnimatedEntryScreen>
        <View>
          <Text>SplitMoneyScreen</Text>
        </View>
      </AnimatedEntryScreen>
    </SafeAreaView>
  );
};

export default SplitMoneyScreen;
