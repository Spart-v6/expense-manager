import { View, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "./MyText";
import icons from "../commons/allIcons";
import Icon from "react-native-vector-icons/MaterialIcons";

const iconLibraryMap = {
  AntDesign: require("react-native-vector-icons/AntDesign").default,
  Entypo: require("react-native-vector-icons/Entypo").default,
  EvilIcons: require("react-native-vector-icons/EvilIcons").default,
  Feather: require("react-native-vector-icons/Feather").default,
  FontAwesome: require("react-native-vector-icons/FontAwesome").default,
  FontAwesome5: require("react-native-vector-icons/FontAwesome5").default,
  Fontisto: require("react-native-vector-icons/Fontisto").default,
  Foundation: require("react-native-vector-icons/Foundation").default,
  Ionicons: require("react-native-vector-icons/Ionicons").default,
  MaterialCommunityIcons:
    require("react-native-vector-icons/MaterialCommunityIcons").default,
  MaterialIcons: require("react-native-vector-icons/MaterialIcons").default,
  Octicons: require("react-native-vector-icons/Octicons").default,
  SimpleLineIcons: require("react-native-vector-icons/SimpleLineIcons").default,
  Zocial: require("react-native-vector-icons/Zocial").default,
};

const getIconLibrary = (category) => {
  return iconLibraryMap[category] || Icon;
};

export const IconComponent = ({ name, category, size=30, color=useDynamicColors().textColorSecondary }) => {
  const IconLibrary = getIconLibrary(category);
  return <IconLibrary name={name} size={size} color={color} />;
};

// Icon library, can be found when adding expense
const ITEM_WIDTH = 95; // Width of each item in the grid
const NUM_COLUMNS = 3; // Number of columns in the grid

const IconPickerModal = ({ onSelectIcon, textColor }) => {
  const containerWidth = useWindowDimensions().width;
  const renderItem = ({ item }) => { 
    const itemWidth = (containerWidth - 60) / NUM_COLUMNS;
    return (
      <TouchableOpacity
        onPress={() => onSelectIcon({iconName: item.name, iconCategory: item.category})}
        style={[styles.item, { width: itemWidth }]}
      >
        <View style={{ justifyContent:"center", alignItems:"center", gap: 10 }}>
          <IconComponent name={item.name} category={item.category} />
          <MyText variant="bodySmall" style={{color: textColor}}>{item.title}</MyText>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <>
      <FlatList
        data={icons}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
  },
});
export default IconPickerModal;
