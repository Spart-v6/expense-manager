import { View, SafeAreaView, FlatList } from "react-native";
import { Text } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import React, { useState } from "react";

const Item = ({ item }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    }}
  >
    <Text>{item.name}</Text>
    <Text>{item.amount}</Text>
  </View>
);

const SplitDetailScreen = ({ navigation, route }) => {
  // Works when u go inside a section
  const [currentSectionData, setCurrentSectionData] = useState(
    route.params.subArray
  );

  const filteredData = currentSectionData?.filter(
    (obj) => obj.hasOwnProperty("amount") && obj.hasOwnProperty("name")
  );

  const data = filteredData?.map((obj) => parseFloat(obj.amount));
  const totalAmount = data?.reduce((acc, curr) => acc + curr, 0);

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={currentSectionData[currentSectionData.length - 1].sectionName}
        navigation={navigation}
        isPlus={true}
      />
      <View style={{ margin: 20 }}>
        <View>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* 

Section name in middle
Who paid and how much 
list of members with their amount paid

*/

export default SplitDetailScreen;
