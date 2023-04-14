import { View, Text, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { FAB } from "react-native-paper";
import allColors from "../commons/allColors";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import React from "react";

const RecurrenceScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader title="Recurring Expenses" isParent={true} navigation={navigation} />
      <AnimatedEntryScreen>
        <ScrollView>
          <Text>RecurrenceScreen</Text>
        </ScrollView>
      </AnimatedEntryScreen>
      <FAB
        animated
        icon="minus"
        onPress={() => navigation.navigate("PlusMoreRecurrence")}
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

export default RecurrenceScreen;
