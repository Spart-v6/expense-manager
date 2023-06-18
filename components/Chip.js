import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import React from "react";
import { IconComponent } from "./IconPickerModal";

const Chip = ({ data, onPress, isClicked, text, styles, name, cardName }) => {
  const allColors = useDynamicColors();
  const handlePress = () => {
    onPress(data);
  };

  return (
    <>
      <View
        style={[
          {
            alignItems: "center",
            padding: 2,
            justifyContent: "center",
            borderRadius: 6,
            alignSelf: "flex-start",
            marginRight: 10,
            borderRadius: 12,
          },
          isClicked && { backgroundColor: allColors.addBtnColors },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.95}
          style={[
            styles.moreCardStyle,
            { height: 97, borderRadius: 10, gap: 15 },
          ]}
        >
          <IconComponent
            name={cardName === "credit" ? "credit-card-alt" : "credit-card"}
            category={"FontAwesome"}
            size={15}
            color={allColors.addBtnColors}
          />
          <View style={{ flexDirection: "column", gap: 2 }}>
            <Text
              variant="bodyMedium"
              style={{
                color: allColors.universalColor,
                width: 100
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: "grey", width: 100 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Chip;
