import { View, Text, SafeAreaView, StatusBar, ScrollView } from "react-native";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import React from "react";

const RecurrenceScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader title="Recurring Expenses" isParent={true} navigation={navigation} />
      <AnimatedEntryScreen>
        <ScrollView>
          <Text>RecurrenceScreen</Text>
        </ScrollView>
      </AnimatedEntryScreen>
    </SafeAreaView>
  );
};

export default RecurrenceScreen;
