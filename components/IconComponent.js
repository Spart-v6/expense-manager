import React from "react";
import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const icons = {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  Feather,
  FontAwesome5,
  FontAwesome6
};

const IconComponent = ({
  iconSet = "MaterialIcons",
  iconName,
  backgroundColor,
  color,
  size = 30,
}) => {
  const Icon = icons[iconSet] || MaterialIcons;

  return (
    <View
      style={{
        backgroundColor: backgroundColor || "#eee",
        padding: 2,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon name={iconName} size={size} color={color || "#000"} />
    </View>
  );
};

export default IconComponent;
