import { Appbar, Button } from "react-native-paper";
import React from "react";
import allColors from "../commons/allColors";

const AppHeader = ({ title, isParent, navigation, isPlus, isUpdate, isDeletePressed, isCardEditPressed, isAccountScreenMore, isUpdateCardScreen=false }) => {
  const handleDeleteExpense = () => {
    isDeletePressed(true);
  }

  const handleCardEdit = () => {
    isCardEditPressed(true);
  }

  return (
    <Appbar.Header style={{backgroundColor: allColors.backgroundColorPrimary}}>
      {
        isParent ? 
        <Button icon="menu" onPress={() => navigation.openDrawer()} />
        :
        <Button icon="arrow-left" onPress={() => navigation.goBack()} />
      }
      
      <Appbar.Content title={isUpdate ? "Update Expense" : title} />
      { !isPlus && !isUpdate && isAccountScreenMore && <Appbar.Action icon="magnify" onPress={() => {}} /> }
      { isPlus && isUpdate && <Appbar.Action icon="delete" onPress={handleDeleteExpense} /> }
      { isUpdateCardScreen && <Appbar.Action icon="pencil" onPress={handleCardEdit} /> }
      { isUpdateCardScreen && <Appbar.Action icon="delete" onPress={handleDeleteExpense} /> }
    </Appbar.Header>
  );
};

export default AppHeader;