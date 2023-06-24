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
import useDynamicColors from "../commons/useDynamicColors";
import { useDispatch } from "react-redux";
import { addGroups } from "../redux/actions/index";
import SnackbarComponent from "../commons/snackbar";
import { getUsernameFromStorage } from "../helper/constants";

const PlusMoreGroup = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);

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
  const [urself, setUrself] = useState(true);

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
      if (groupName.length < 1) {
        setErrorMsg("Please write a group name");
        return true;
      }
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
              backgroundColor: allColors.innerTextFieldColor,
              marginBottom: 20,
              borderColor: allColors.placeholderTextColor,
              borderWidth: 2,
            }}
            selectionColor={allColors.textSelectionColor}
            textColor={allColors.universalColor}
            underlineColorAndroid="transparent"
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            placeholderTextColor={allColors.placeholderTextColor}
            autoCompleteType="off"
            value={groupName}
            placeholder="Group name"
            onChangeText={(val) => setGroupName(val)}
            keyboardType="default"
          />
        </View>

        <View style={styles.line} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{color: allColors.universalColor}}>Add names</Text>
          <View style={[styles.rowContainer]}>
            <TextInput
              style={styles.textInput}
              selectionColor={allColors.textSelectionColor}
              textColor={allColors.universalColor}
              placeholderTextColor={allColors.placeholderTextColor}
              underlineColorAndroid="transparent"
              activeUnderlineColor="transparent"
              underlineColor="transparent"
              editable={false}
              placeholder={username}
            />
          </View>
          {textInputs.map((input, index) => (
            <View style={[styles.rowContainer]} key={input.id}>
              <TextInput
                style={styles.textInput}
                selectionColor={allColors.textSelectionColor}
                textColor={allColors.universalColor}
                underlineColorAndroid="transparent"
                activeUnderlineColor="transparent"
                underlineColor="transparent"
                autoFocus={index > 0}
                placeholderTextColor={allColors.placeholderTextColor}
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
          color={allColors.addBtnColors}
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
            backgroundColor: allColors.addBtnColors,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <Text
            style={{
              color: allColors.backgroundColorPrimary,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Add Group
          </Text>
        </Button>
      </View>
      {error && <SnackbarComponent errorMsg={errorMsg} />}
    </SafeAreaView>
  );
};

const makeStyles = allColors => StyleSheet.create({
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
    backgroundColor: allColors.innerTextFieldColor,
    borderColor: allColors.placeholderTextColor,
    borderWidth: 2,
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
