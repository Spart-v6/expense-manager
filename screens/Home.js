import { View, SafeAreaView, FlatList, Text } from "react-native";
import { useState } from "react";
import { FocusedStatusBar } from "../components";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar background={"pink"} />
    </SafeAreaView>
  );
};

export default Home;
