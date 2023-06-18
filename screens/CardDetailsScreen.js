import React from "react";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Text, Dialog, Portal, Button } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";
import { useSelector, useDispatch } from "react-redux";
import { deleteCard } from "../redux/actions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DetailedExpenseCard from "../components/DetailedExpenseCard";
import DeleteDialog from "../components/DeleteDialog";

const makeStyles = () => 
  StyleSheet.create({
    listView: {
      padding: 20,
      gap: 20,
    }
});

const CardDetailsScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles();
  const dispatch = useDispatch();
  const [card, setCard] = React.useState({});
  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = React.useState(false);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={card?.paymentNetwork}
        navigation={navigation}
        isUpdateCardScreen={true}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View style={styles.listView}>
          {
            filteredArray.length > 0 ?
            filteredArray.map((exp, index) => (
                <DetailedExpenseCard exp={exp} key={index}/>
            ))
            :
            <View style={{justifyContent: "center", alignItems: 'center', height: 800, gap: 10}}>
              <MaterialCommunityIcons name="cancel" size={60} color={allColors.textColorPrimary}/>        
              <Text variant="titleMedium" style={{color: allColors.universalColor}}>Expenses will appear here once added to this card.</Text>
            </View>
          }
        </View>
      </ScrollView>
      <Portal>
        <DeleteDialog
          visible={isDeleteBtnPressed}
          hideDialog={hideDialog}
          deleteExpense={deleteCardForever}
          allColors={allColors}
          title={"card"}
          content={"card"}
        />
      </Portal>
    </SafeAreaView>
  );
};

export default CardDetailsScreen;
