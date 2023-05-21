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
import SnackbarComponent from "../commons/snackbar";
import { getUsernameFromStorage } from "../helper/constants";

const PlusMoreGroup = ({ navigation }) => {
  //fetching username
  const [username, setUsername] = React.useState(null);

  React.useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  const dispatch = useDispatch();

  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("Please fill all the fields");
  const timeoutRef = React.useRef(null);

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
    const checkError = () => {
      if (textInputs.some((item) => item.value === "")) {
        setErrorMsg("Add at least one member to the group");
        return true;
      }
      return false;
    };
    if (checkError()) {
      setError(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setError(false), 2000);
      return;
    }

    const newArr = [...textInputs];
    newArr.push({ id: idCounter, showCross: true, value: username });
    setIdCounter((prevId) => prevId + 1);
    newArr.push({ nameOfGrp: groupName, identity: Math.random() * 10 });
    dispatch(addGroups(newArr));
    navigation.goBack();
  };

  const handleDeleteUrSelf = () => {
    setUrself(false);
    setIsDeleteBtnPressed(false);
  };

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
            underlineColorAndroid="transparent"
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            placeholderTextColor={allColors.textColorFour}
            autoCompleteType="off"
            value={groupName}
            placeholder="Group name"
            onChangeText={(val) => setGroupName(val)}
            keyboardType="default"
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
                placeholderTextColor={allColors.textColorFour}
                underlineColorAndroid="transparent"
                activeUnderlineColor="transparent"
                underlineColor="transparent"
                editable={false}
                placeholder={username}
              />
              {urself && (
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
                underlineColorAndroid="transparent"
                activeUnderlineColor="transparent"
                underlineColor="transparent"
                autoFocus={index > 0}
                placeholderTextColor={allColors.textColorFour}
                autoCompleteType="off"
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
              fontWeight: "bold",
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
      {error && <SnackbarComponent errorMsg={errorMsg} />}
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
