import { View, Text, TouchableOpacity } from "react-native";
import allColors from "../commons/allColors";
import React from "react";

const Chip = ({ index, onPress, isClicked, text }) => {
  const handlePress = () => {
    onPress(index);
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
            marginRight: 10
          },
          isClicked && { backgroundColor: allColors.textColorSecondary }
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          style={{
            backgroundColor: allColors.backgroundColorLessPrimary,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ padding: 10, color: "white" }}>{text}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Chip;
