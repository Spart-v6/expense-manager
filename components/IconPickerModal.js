import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Dialog, Portal, Text, Button } from "react-native-paper";
import React, { useState } from "react";
import allColors from "../commons/allColors";
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

export const IconComponent = ({ name, category }) => {
  const IconLibrary = getIconLibrary(category);
  return <IconLibrary name={name} size={30} color={allColors.textColorSecondary} />;
};

const ITEM_WIDTH = 95; // Width of each item in the grid
const NUM_COLUMNS = 4; // Number of columns in the grid

const IconPickerModal = ({ onSelectIcon }) => {

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelectIcon({iconName: item.name, iconCategory: item.category})}
      style={styles.item}
    >
      <View style={{ justifyContent:"center", alignItems:"center", gap: 10 }}>
        <IconComponent name={item.name} category={item.category} />
        <Text variant="bodySmall">{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
  
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
