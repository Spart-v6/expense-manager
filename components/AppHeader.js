import { Appbar, Button, Text } from "react-native-paper";
import { View } from "react-native";
import React from "react";
import allColors from "../commons/allColors";
import { getUsernameFromStorage } from "../helper/constants";
import moment from "moment";

const AppHeader = ({
  title,
  isParent,
  isHome,
  navigation,
  isPlus,
  isUpdate,
  isDeletePressed,
  isCardEditPressed,
  needSearch,
  isUpdateCardScreen = false,
}) => {
  const [greeting, setGreeting] = React.useState("");
  const [username, setUsername] = React.useState(null);

  React.useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  const handleDeleteExpense = () => isDeletePressed(true);
  const handleCardEdit = () => isCardEditPressed(true);
  const searchExpense = () =>
    navigation.navigate("SearchScreen", { comingFrom: title });

  React.useEffect(() => {
    const currentHour = moment().hour();
    if (currentHour >= 5 && currentHour < 12) setGreeting("Good morning");
    else if (currentHour >= 12 && currentHour < 17)
      setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <Appbar.Header
      style={{ backgroundColor: allColors.backgroundColorPrimary }}
    >
      {!isParent && (
        <Button icon="arrow-left" onPress={() => navigation.goBack()} />
      )}
      {isHome ? (
        <Appbar.Content
          title={
            <View style={{ marginLeft: 6 }}>
              <Text variant="titleMedium">{`Hi ${username}`}</Text>
              <Text variant="bodySmall">{greeting}</Text>
            </View>
          }
        />
      ) : (
        <Appbar.Content
          title={isUpdate ? "Update Expense" : title}
          titleStyle={isParent && { marginLeft: 6 }}
        />
      )}
      {!isPlus && !isUpdate && needSearch && (
        <Appbar.Action icon="magnify" onPress={searchExpense} />
      )}
      {isPlus && isUpdate && (
        <Appbar.Action icon="delete" onPress={handleDeleteExpense} />
      )}
      {isUpdateCardScreen && (
        <Appbar.Action icon="pencil" onPress={handleCardEdit} />
      )}
      {isUpdateCardScreen && (
        <Appbar.Action icon="delete" onPress={handleDeleteExpense} />
      )}
    </Appbar.Header>
  );
};

export default AppHeader;
