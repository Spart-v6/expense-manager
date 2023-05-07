import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import AppHeader from "../components/AppHeader";
import { Text, TextInput, Button, Portal, Dialog } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import allColors from "../commons/allColors";
import { useDispatch } from "react-redux";
import { addGroups } from "../redux/actions/index";
import username from "../helper/constants";

const PlusMoreGroup = ({ navigation }) => {
  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState("");

  const [textInputs, setTextInputs] = useState([
    { id: 0, value: "", showCross: true },
  ]);
  const [idCounter, setIdCounter] = useState(1);
  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = useState(false);
  const [urself, setUrself] = useState(true);

  const hideDialog = () => setIsDeleteBtnPressed(false);

  const handleAddTextInput = () => {
    setTextInputs((prevState) => [
      ...prevState,
      { id: idCounter, value: "", showCross: true },
    ]);
    setIdCounter((prevId) => prevId + 1);
  };

  const handleRemoveTextInput = (id) => {
    setTextInputs((prevState) => prevState.filter((input) => input.id !== id));
  };

  const handleChangeTextInput = (id, value) => {
    setTextInputs((prevState) => {
      const updatedInputs = prevState.map((input) => {
        if (input.id === id) {
          return { ...input, value };
        }
        return input;
      });
      return updatedInputs;
    });
  };

  const handleAddGroups = () => {
    let flag1 = false;
    let flag2 = true;
    textInputs.forEach((group) => {
      if (group.value.length > 0 && groupName.length > 0) flag1 = true;
      else flag1 = false;
      if (!flag1) flag2 = false;
    });
    // adding urself
    textInputs.push({"id": idCounter, "showCross": true, "value": username})

    if (textInputs.length > 0 && flag2) {
      textInputs.push({ nameOfGrp: groupName, identity: Math.random() * 10 });
      dispatch(addGroups(textInputs));
      navigation.goBack();
    }
  };

  const handleDeleteUrSelf = () => {
    setUrself(false);
    setIsDeleteBtnPressed(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add a new group"
        navigation={navigation}
        isPlus={true}
      />

      <View style={{ margin: 20, flex: 1 }}>
        <View>
          <TextInput
            style={{
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              backgroundColor: allColors.backgroundColorQuinary,
              marginBottom: 20,
            }}
            selectionColor={allColors.textColorFour}
            textColor={allColors.textColorFour}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholderTextColor={allColors.textColorFour}
            autoComplete="off"
            textContentType="none"
            value={groupName}
            placeholder="Group name"
            onChangeText={(val) => setGroupName(val)}
            keyboardType={"default"}
          />
        </View>

        <View style={styles.line} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text>Add names</Text>
          {urself && (
            <View style={[styles.rowContainer]}>
              <TextInput
                style={styles.textInput}
                selectionColor={allColors.textColorFour}
                textColor={allColors.textColorFour}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                placeholderTextColor={allColors.textColorFour}
                autoComplete="off"
                textContentType="none"
                disabled
                placeholder={username}
              />
              {(
                <TouchableOpacity
                  onPress={() => setIsDeleteBtnPressed(true)}
                  style={styles.iconContainer}
                >
                  <MaterialIcons
                    name="close"
                    size={30}
                    color={allColors.warningColor}
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {textInputs.map((input, index) => (
            <View style={[styles.rowContainer]} key={input.id}>
              <TextInput
                style={styles.textInput}
                selectionColor={allColors.textColorFour}
                textColor={allColors.textColorFour}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                autoFocus={index > 0}
                placeholderTextColor={allColors.textColorFour}
                autoComplete="off"
                textContentType="none"
                value={input.value}
                placeholder={`Enter name #${index + 1}`}
                onChangeText={(value) => handleChangeTextInput(input.id, value)}
              />
              {input.showCross && (
                <TouchableOpacity
                  onPress={() => handleRemoveTextInput(input.id)}
                  style={styles.iconContainer}
                >
                  <MaterialIcons
                    name="close"
                    size={30}
                    color={allColors.warningColor}
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleAddTextInput}
          style={styles.plusIconContainer}
        >
          <Octicons
            name="plus"
            size={50}
            color={allColors.backgroundColorQuinary}
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ margin: 20, marginTop: 0 }}>
        <Button
          onPress={handleAddGroups}
          mode="contained"
          labelStyle={{ fontSize: 15 }}
          textColor={"black"}
          style={{
            borderColor: "transparent",
            backgroundColor: allColors.backgroundColorLessPrimary,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <Text
            style={{
              color: allColors.textColorPrimary,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Add
          </Text>
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={isDeleteBtnPressed}
          onDismiss={hideDialog}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to remove yourself from the group?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={handleDeleteUrSelf}
              mode="elevated"
              contentStyle={{ width: 60 }}
              buttonColor={allColors.warningColor}
            >
              <Text style={{ color: allColors.textColorTertiary }}>Sure</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 8,
    gap: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: allColors.backgroundColorQuinary,
    margin: 10,
    marginLeft: 0,
  },
  iconContainer: {
    marginLeft: 8,
    marginRight: 10,
  },
  plusIconContainer: {
    alignSelf: "flex-end",
    padding: 10,
  },
  line: {
    backgroundColor: allColors.backgroundColorQuinary,
    height: 2,
    borderRadius: 100,
    width: "50%",
    opacity: 0.5,
    alignSelf: "center",
  },
});

export default PlusMoreGroup;
