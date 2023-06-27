import { TouchableOpacity } from "react-native";
import MyText from "./MyText";
import useDynamicColors from "../commons/useDynamicColors";
import React from "react";

const BackChip = ({ index, onPress, isClicked, text }) => {
  const allColors = useDynamicColors();

  const handlePress = () => {
    onPress(index, text);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[
          {
            backgroundColor: allColors.backgroundColorDates,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-start",
            padding: 2,
            marginRight: 10,
          },
          isClicked && {
            backgroundColor: allColors.backgroundColorDatesSelected,
          },
        ]}
      >
        <MyText
          style={[
            { padding: 10, color: allColors.universalColor },
            isClicked && { color: allColors.textColorPrimary },
          ]}
        >
          {text}
        </MyText>
      </TouchableOpacity>
    </>
  );
};

export default BackChip;
