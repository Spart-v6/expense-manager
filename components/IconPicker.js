import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const iconLibraryMap = {
  AntDesign: require("react-native-vector-icons/AntDesign").default,
  Entypo: require("react-native-vector-icons/Entypo").default,
  EvilIcons: require("react-native-vector-icons/EvilIcons").default,
  Feather: require("react-native-vector-icons/Feather").default,
  FontAwesome: require("react-native-vector-icons/FontAwesome").default,
  FontAwesome5: require("react-native-vector-icons/FontAwesome5").default,
  FontAwesome6: require("react-native-vector-icons/FontAwesome6").default,
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

export const IconComponent = ({ name, category, size=30, color }) => {
  const IconLibrary = getIconLibrary(category);
  return <IconLibrary name={name} size={size} color={color} />;
};
