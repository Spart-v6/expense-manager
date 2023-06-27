import { View, SafeAreaView, FlatList, ScrollView } from "react-native";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";

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

  const renderItem = ({ item }) => <Item item={item} />;

  
  // #region going to scr thru notifications
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const nextScreen = response.notification.request.content.data.headToThisScreen;
      navigation.navigate(nextScreen);
    });
    return () => subscription.remove();
  }, []);
  // #endregion


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
          <MyText style={{ color: allColors.universalColor }}>
            {
              `Total amount ${totalAmount}/- is paid by${
                currentSectionData[currentSectionData.length - 1].whoPaid.length === 0
                  ? " you"
                  : ` ${currentSectionData[currentSectionData.length - 1].whoPaid}`
              }`
            }
          </MyText>
            <FlatList
              scrollEnabled={false}
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: allColors.backgroundColorTertiary, opacity: 0.5 }} />}
              ListHeaderComponent={() => <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Summary</MyText>}
              />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SplitDetailScreen;
