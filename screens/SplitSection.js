import { View, SafeAreaView } from "react-native";
import { Text, FAB } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import React, { useState } from "react";

const SplitSection = ({ navigation, route }) => {
  const [identity, setIdentity] = useState(route.params.identity);
  const [nameOfGrp, setNameOfGrp] = useState(route.params.nameOfGrp);
  const [value, setValue] = useState(route.params.values);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={nameOfGrp}
        navigation={navigation}
        isPlus={true}
      />
      <View style={{ margin: 20, gap: 10, flex: 1 }}>
        <Text>Sections will be visible here</Text>
      </View>

      <FAB
        animated
        icon="plus"
        onPress={() => navigation.navigate("PlusMoreSplitSection", {currGrpMems: value})}
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

export default SplitSection;
