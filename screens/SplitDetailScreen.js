import { View, SafeAreaView, ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import React, { useState, useCallback } from "react";

const Item = ({ item }) => { 
  const allColors = useDynamicColors();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
      }}
    >
      <MyText style={{color: allColors.universalColor, maxWidth: 300}} ellipsizeMode="tail" numberOfLines={1}>{item.name}</MyText>
      <MyText style={{color: allColors.universalColor, maxWidth: 100}} ellipsizeMode="tail" numberOfLines={1}>{item.amount}</MyText>
    </View>
  );
}

const SplitDetailScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();

  // Works when u go inside a section
  const [currentSectionData, setCurrentSectionData] = useState(
    route.params.subArray
  );

  const filteredData = currentSectionData?.filter(
    (obj) => obj.hasOwnProperty("amount") && obj.hasOwnProperty("name")
  );

  const data = filteredData?.map((obj) => parseFloat(obj.amount));
  const totalAmount = data?.reduce((acc, curr) => acc + curr, 0);

  const renderItem = useCallback(({ item }) => {<Item item={item} />},[]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={currentSectionData[currentSectionData.length - 1].sectionName}
        navigation={navigation}
        isPlus={true}
      />
      <View style={{ margin: 20, flex : 1, gap: 15 }}>
        <MyText style={{ color: allColors.universalColor }}>
          {
            `Total amount ${totalAmount}/- is paid by${
              currentSectionData[currentSectionData.length - 1].whoPaid.length === 0
                ? " you"
                : ` ${currentSectionData[currentSectionData.length - 1].whoPaid}`
            }`
          }
        </MyText>
          <FlashList
            scrollEnabled={false}
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: allColors.backgroundColorTertiary, opacity: 0.5 }} />}
            ListHeaderComponent={() => <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Summary</MyText>}
            estimatedItemSize={200}
            />
      </View>
    </SafeAreaView>
  );
};

export default SplitDetailScreen;
