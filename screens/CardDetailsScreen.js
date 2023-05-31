import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { Card, Text, Dialog, Portal, Button } from "react-native-paper";
import allColors from "../commons/allColors";
import AppHeader from "../components/AppHeader";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { deleteCard } from "../redux/actions";
import moment from "moment";
import { getCurrencyFromStorage } from "../helper/constants";

const styles = StyleSheet.create({
  listView: {
    padding: 20,
    gap: 20,
  },
  expenseCard: {
    backgroundColor: allColors.backgroundColorLessPrimary,
    borderRadius: 50,
  },
});

const DisplayEachExpenseForSpecificCard = ({ exp }) => {
  const [currency, setCurrency] = React.useState({
    curr: "$"
  });

  React.useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchCurrency();
  }, []);

  const formattedDate = moment(exp?.date, "YYYY/MM/DD").format("Do MMMM");
  return (
    <Card style={{ backgroundColor: allColors.backgroundColorLessPrimary }}>
      <Card.Title
        title={
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              width: 389,
            }}
          >
            <Text variant="headlineSmall">{exp.name}</Text>
            <Text variant="headlineSmall" style={{color: exp.type === "Income" ? allColors.successColor : allColors.warningColor}}>
              {exp.type === "Income" ? `+${currency.curr}${exp.amount}` : `-${currency.curr}${exp.amount}`}
            </Text>
          </View>
        }
        titleStyle={{ paddingTop: 10 }}
      />
      <Card.Content>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            variant="bodyMedium"
            style={{ color: allColors.textColorPrimary }}
          >
            {formattedDate}
          </Text>
          <FontAwesome
            name="circle"
            size={7}
            color={"white"}
            style={{ paddingLeft: 5, paddingRight: 5 }}
          />
          <Text variant="bodyMedium">
            {exp.desc === "" ? "No Description" : exp.desc}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const CardDetailsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [card, setCard] = React.useState({});
  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = React.useState(false);
  const [isCardEditBtnPressed, setIsCardEditBtnPressed] = React.useState(false);

  const hideDialog = () => setIsDeleteBtnPressed(false);

  const deleteCardForever = () => {
    setIsDeleteBtnPressed(false);
    dispatch(deleteCard(card.id));
    navigation.navigate("Accounts");
  };

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);
  const filteredArray = expensesData.filter(
    (expense) => expense?.selectedCard === card?.paymentNetwork
  );

  React.useEffect(() => {
    setCard(route.params.card);
  }, [route.params.card]);

  React.useEffect(() => {
    if (isCardEditBtnPressed) {
      navigation.navigate("PlusMoreAccount", { updateCard: card });
    }
    setIsCardEditBtnPressed(false);
  }, [isCardEditBtnPressed]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={card?.paymentNetwork}
        navigation={navigation}
        isUpdateCardScreen={true}
        isCardEditPressed={(val) => setIsCardEditBtnPressed(val)}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <View style={styles.listView}>
        {filteredArray.map((exp) => (
          <DisplayEachExpenseForSpecificCard exp={exp} key={Math.random()} />
        ))}
      </View>
      <Portal>
        <Dialog
          visible={isDeleteBtnPressed}
          onDismiss={hideDialog}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Title>Delete card?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The card will be removed permanently
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={deleteCardForever}
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

export default CardDetailsScreen;
