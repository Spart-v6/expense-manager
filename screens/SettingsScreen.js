import React from "react";
import { View, SafeAreaView } from "react-native";
import { Text, TouchableRipple, Dialog, Portal, Button, TextInput } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import { IconComponent } from "../components/IconPickerModal";
import allColors from "../commons/allColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsernameFromStorage, getCurrencyFromStorage } from "../helper/constants";

const SettingsScreen = ({ navigation }) => {
  // #region fetching username and currency
  const [username, setUsername] = React.useState(null);
  const [currency, setCurrency] = React.useState({
    id: 1,
    curr: "$",
    name: "USD",
    iconName: "dollar",
    iconType: "FontAwesome",
  });

  React.useEffect(() => {
    const fetchDetails = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchDetails();
  }, []);
  // #endregion

  const [openChangeName, setOpenChangeName] = React.useState(false);

  const [updatedUsername, setUpdatedUsername] = React.useState(username);
  const [placeholderUsername, setPlaceholderUsername] = React.useState(updatedUsername);
  React.useEffect(() => {
    setUpdatedUsername(username);
    setPlaceholderUsername(username);
  }, [username]);

  const updateUsername = async () => {
    try {
      if (updatedUsername.length === 0) return;
      setPlaceholderUsername(updatedUsername);
      await AsyncStorage.setItem("username", updatedUsername);
      setOpenChangeName(false);
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Settings" navigation={navigation} />
      <View style={{ flex: 1, marginLeft: 25, marginTop: 20, marginRight: 25, gap: 10 }}>
        <TouchableRipple
          onPress={() => setOpenChangeName(prevState => !prevState)}
          style={{ borderRadius: 2, flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <>
            <IconComponent name={"pencil"} category={"Foundation"} size={20} color={allColors.textColorPrimary}/>
            <View style={{ marginLeft: 15 }}>
              <Text variant="bodyLarge">Change name</Text>
              <Text variant="bodySmall">{placeholderUsername}</Text>
            </View>
          </>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => navigation.navigate("WelcomeScreen", {updatedCurr: currency})}
          style={{ borderRadius: 2, flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <>
            <IconComponent name={"currency-sign"} category={"MaterialCommunityIcons"} size={20} color={allColors.textColorPrimary}/>
            <View style={{ marginLeft: 13 }}>
              <Text variant="bodyLarge">Currency Sign</Text>
              <Text variant="bodySmall">{currency.name}</Text>
            </View>
          </>
        </TouchableRipple>
      </View>


      <Portal>
        <Dialog visible={openChangeName} onDismiss={()=> setOpenChangeName(false)} style={{backgroundColor: allColors.backgroundColorLessPrimary}}>
          <Dialog.Title>Update name</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder={"New username"}
              style={{ backgroundColor: "transparent" }}
              value={updatedUsername}
              underlineColor={allColors.textColorFive}
              activeUnderlineColor={allColors.textColorPrimary}
              onChangeText={text => setUpdatedUsername(text)}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=> setOpenChangeName(false)}>
              <Text style={{color: allColors.textColorFive}}> Cancel </Text>
            </Button>
            <Button onPress={updateUsername}>
              <Text style={{color: allColors.textColorPrimary}}> Update </Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </SafeAreaView>
  );
};

export default SettingsScreen;
