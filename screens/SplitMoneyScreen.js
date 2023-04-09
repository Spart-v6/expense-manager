import { View, Text, SafeAreaView, StatusBar, ScrollView } from "react-native";
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
          
        </View>

        <View style={{justifyContent:"center", alignItems:"center", backgroundColor:"red"}}>
          <Text>Individual</Text>
          <Text>Group</Text>
        </View>
        <ScrollView>
          <Text>SplitMoneyScreen</Text>
        </ScrollView>
      </AnimatedEntryScreen>
    </SafeAreaView>
  );
};

export default SplitMoneyScreen;
