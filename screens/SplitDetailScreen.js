import { View, SafeAreaView, FlatList, ScrollView } from "react-native";
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
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={{ margin: 20 }}>
          <View style={{gap: 15}}>
            <Text>
              Total amount is paid by
              {
                currentSectionData[currentSectionData.length - 1].whoPaid.length === 0 ? " you" 
                : " " + currentSectionData[currentSectionData.length - 1].whoPaid
              }
            </Text>
            <FlatList
              scrollEnabled={false}
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: allColors.backgroundColorLessPrimary }} />}
              ListHeaderComponent={() => <Text variant="titleMedium">Summary</Text>}
              />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SplitDetailScreen;
