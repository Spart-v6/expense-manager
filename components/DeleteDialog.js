import React from "react";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "./MyText";
import { Dialog, TouchableRipple } from "react-native-paper";
import { View } from "react-native";

const DeleteDialog = ({ visible, hideDialog, deleteExpense, title, content, subtitle="" }) => {
  const allColors = useDynamicColors();
  return (
    <Dialog
      visible={visible}
      onDismiss={hideDialog}
      style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
      theme={{
        colors: {
          backdrop: "#00000099",
        },
      }}
    >
      <Dialog.Title style={{color: allColors.universalColor, fontFamily: "Poppins_400Regular"}}>Delete {title}?</Dialog.Title>
      <Dialog.Content>
        <MyText variant="bodyMedium" style={{color: allColors.universalColor}}>
          The {content} will be removed permanently {subtitle}
        </MyText>
      </Dialog.Content>
      <Dialog.Actions style={{gap: 10}}>
        <TouchableRipple onPress={hideDialog} rippleColor={allColors.rippleColor} centered>
          <View style={{padding: 10}}> 
            <MyText style={{ color: allColors.universalColor }}>Cancel</MyText>
          </View>
        </TouchableRipple>
        <TouchableRipple
          onPress={deleteExpense}
          rippleColor={allColors.rippleColor}
          centered
        >
          <View style={{padding: 10, backgroundColor: allColors.addBtnColors, borderRadius: 10 }}>
            <MyText style={{ color: allColors.sameColor, fontWeight: "800" }}>Sure</MyText>
          </View>
        </TouchableRipple>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DeleteDialog;
