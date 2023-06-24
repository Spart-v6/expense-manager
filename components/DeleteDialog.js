import React from "react";
import useDynamicColors from "../commons/useDynamicColors";
import { Dialog, Button, Text, TouchableRipple } from "react-native-paper";
import { View } from "react-native";

const DeleteDialog = ({ visible, hideDialog, deleteExpense, title, content, subtitle="" }) => {
  const allColors = useDynamicColors();
  return (
    <Dialog
      visible={visible}
      onDismiss={hideDialog}
      style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
    >
      <Dialog.Title style={{color: allColors.universalColor}}>Delete {title}?</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium" style={{color: allColors.universalColor}}>
          The {content} will be removed permanently {subtitle}
        </Text>
      </Dialog.Content>
      <Dialog.Actions style={{gap: 10}}>
        <TouchableRipple onPress={hideDialog} rippleColor={allColors.rippleColor} centered>
          <View style={{padding: 10}}> 
            <Text style={{ color: allColors.universalColor }}>Cancel</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={deleteExpense}
          rippleColor={allColors.rippleColor}
          centered
        >
          <View style={{padding: 10}}>
            <Text style={{ color: allColors.addBtnColors }}>Sure</Text>
          </View>
        </TouchableRipple>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DeleteDialog;
