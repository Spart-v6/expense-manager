import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import allColors from "../commons/allColors";
import PropTypes from "prop-types";

const DEFAULT_SIZE_MULTIPLIER = 0.7;
const DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER = 0.2;

export default class RadioButton extends Component {
  static propTypes = {
    size: PropTypes.number,
    innerColor: PropTypes.object,
    isSelected: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    size: 16,
    innerColor: allColors.backgroundColorQuaternary,
    isSelected: false,
    onPress: () => null,
  };

  render() {
    const { size, innerColor, isSelected, onPress } = this.props;
    const outerStyle = {
      borderColor: 'white',
      width: size + size * DEFAULT_SIZE_MULTIPLIER,
      height: size + size * DEFAULT_SIZE_MULTIPLIER,
      borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
      borderWidth: size * DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER,
    };

    const innerStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: innerColor,
    };

    return (
      <TouchableOpacity style={[styles.radio, outerStyle]} onPress={onPress}>
        {isSelected ? <View style={innerStyle} {...this.props} /> : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  radio: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
