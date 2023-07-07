import { View, SafeAreaView, TouchableOpacity } from "react-native";
import { updateSections } from "../redux/actions";
import { useDispatch } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import React, { useState, useCallback } from "react";
import { getUsernameFromStorage } from "../helper/constants";

const Item = ({ item, onPress, whoPaid, username }) => { 
  const allColors = useDynamicColors();
  const { markAsDone } = item;
  const [mark, setMark] = useState(markAsDone);

  const onPressMark = useCallback(() => {
    if (whoPaid === "") {
      if (item.name === username) {
        onPress(item, false);
        setMark(false);
        return;
      }
    };
    if (item.name === whoPaid) {
      onPress(item, false);
      setMark(false);
      return;
    }
    onPress(item, !mark);
    setMark(!mark);
  }, [mark]);

  return (
    <TouchableOpacity onPress={onPressMark} activeOpacity={0.7}>
      <View
        style={[{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }, mark && { opacity: 0.4}]}
      >
        <MyText style={[{color: allColors.universalColor, maxWidth: 300}, mark && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} ellipsizeMode="tail" numberOfLines={1}>
          {item.name}
        </MyText>
        <MyText style={[{color: allColors.universalColor, maxWidth: 100}, mark && {textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]} ellipsizeMode="tail" numberOfLines={1}>
          {item.amount}
        </MyText>
      </View>
    </TouchableOpacity>
  );
}

const SplitDetailScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState(null);

  React.useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);


  // Works when u go inside a section
  const [currentSectionData] = useState(route.params.subArray);
  const [currentSecId] = useState(route.params.id);
  const [groupIdentity] = useState(route.params.groupIdentity);
  const [whoPaid] = useState(route.params.whoPaid);

  const filteredData = currentSectionData?.filter(
    (obj) => obj.hasOwnProperty("amount") && obj.hasOwnProperty("name")
  );

  const onPress = (item, mark) => {
    dispatch(updateSections({ item, currentSecId, groupIdentity, mark }));
  };

  const data = filteredData?.map((obj) => parseFloat(obj.amount));
  const totalAmount = data?.reduce((acc, curr) => acc + curr, 0);

  const renderItem = ({ item }) => <Item item={item} onPress={onPress} whoPaid={whoPaid} username={username}/>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={currentSectionData[currentSectionData.length - 1].sectionName}
        navigation={navigation}
        isPlus={true}
      />
      <View style={{ margin: 20, flex : 1, gap: 20, marginTop: 10 }}>
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
            data={currentSectionData}
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
