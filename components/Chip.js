import { View, TouchableOpacity } from "react-native";
import MyText from "./MyText";
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
            padding: 1,
            justifyContent: "center",
            marginRight: 10,
          },
          isClicked && { borderColor: allColors.addBtnColors, borderWidth: 2, borderRadius: 14 },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.75}
          style={[
            styles.moreCardStyle,
            { height: 100, borderRadius: 10, gap: 15 },
          ]}
        >
          <IconComponent
            name={cardName === "credit" ? "credit-card-alt" : "credit-card"}
            category={"FontAwesome"}
            size={15}
            color={allColors.addBtnColors}
          />
          <View style={{ flexDirection: "column", gap: 2 }}>
            <MyText
              variant="bodyMedium"
              style={{
                color: allColors.universalColor,
                width: 100
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </MyText>
            <MyText
              variant="bodySmall"
              style={{ color: "grey", width: 100 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {text}
            </MyText>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Chip;
