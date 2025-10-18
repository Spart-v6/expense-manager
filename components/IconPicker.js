import React from "react";
import Icon from "@expo/vector-icons/MaterialIcons";

const iconLibraryMap = {
  AntDesign: require("@expo/vector-icons/AntDesign").default,
  Entypo: require("@expo/vector-icons/Entypo").default,
  EvilIcons: require("@expo/vector-icons/EvilIcons").default,
  Feather: require("@expo/vector-icons/Feather").default,
  FontAwesome: require("@expo/vector-icons/FontAwesome").default,
  FontAwesome5: require("@expo/vector-icons/FontAwesome5").default,
  FontAwesome6: require("@expo/vector-icons/FontAwesome6").default,
  Fontisto: require("@expo/vector-icons/Fontisto").default,
  Foundation: require("@expo/vector-icons/Foundation").default,
  Ionicons: require("@expo/vector-icons/Ionicons").default,
  MaterialCommunityIcons:
    require("@expo/vector-icons/MaterialCommunityIcons").default,
  MaterialIcons: require("@expo/vector-icons/MaterialIcons").default,
  Octicons: require("@expo/vector-icons/Octicons").default,
  SimpleLineIcons: require("@expo/vector-icons/SimpleLineIcons").default,
  Zocial: require("@expo/vector-icons/Zocial").default,
};

const getIconLibrary = (category) => {
  return iconLibraryMap[category] || Icon;
};

export const IconComponent = ({ name, category, size=30, color }) => {
  const IconLibrary = getIconLibrary(category);
  return <IconLibrary name={name} size={size} color={color} />;
};
