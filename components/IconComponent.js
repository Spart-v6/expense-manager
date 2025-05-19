import React from "react";
import { View } from "react-native";
import * as IconSets from "react-native-vector-icons";

const IconComponent = ({ iconSet, iconName, backgroundColor, color, size = 30 }) => {
  const Icon = IconSets[iconSet] || IconSets.MaterialIcons;

  return (
    <View style={{
      backgroundColor: backgroundColor || "#eee",
      padding: 10,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Icon name={iconName} size={size} color={color || "#000"} />
    </View>
  );
};

export default IconComponent;
