import React from "react";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Portal } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import { useSelector, useDispatch } from "react-redux";
import { deleteCard, deleteData, deleteRecentTransactions, deleteRecurrences, storeRecurrences } from "../redux/actions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DetailedExpenseCard from "../components/DetailedExpenseCard";
import DeleteDialog from "../components/DeleteDialog";
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);
  const filteredArray = expensesData.filter(
    (expense) => expense?.accCardSelected === card?.id
  );

  // #region Fetching recurrence data: delete a recurrence when deleting a card if it has a card associated with it.
  useFocusEffect(
    useCallback(() => {
      fetchRecurrencesData();
    }, [])
  );

  const fetchRecurrencesData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_RECURRENCES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeRecurrences(newData));
    } catch (e) {}
  };

  const recurrencesData = useSelector(
    (state) => state.recurrenceReducer.allRecurrences
  );
  // #endregion
  
  const deleteCardForever = () => {
    setIsDeleteBtnPressed(false);
    for (const obj of filteredArray) { dispatch(deleteData(obj.id)); dispatch(deleteRecentTransactions(obj.id)); }
    for (const obj of recurrencesData) { 
      if (obj.accCardSelected === card.id) {
        dispatch(deleteRecurrences(obj.id));
      }
    }
    dispatch(deleteCard(card.id));
    navigation.navigate("Accounts");
  };

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
      {
        filteredArray.length > 0 ?
        <View style={{flex : 1}}>
          <DetailedExpenseCard exp={filteredArray} key={Math.random()}/>
        </View>
        :
        <View style={{justifyContent: "center", alignItems: 'center', height: 800, gap: 10}}>
          <MaterialCommunityIcons name="cancel" size={60} color={allColors.textColorPrimary}/>        
          <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Expenses will appear here once added to this card.</MyText>
        </View>
      }
      <Portal>
        <DeleteDialog
          visible={isDeleteBtnPressed}
          hideDialog={hideDialog}
          deleteExpense={deleteCardForever}
          allColors={allColors}
          title={"card"}
          content={"card"}
          subtitle={", along with its expenses and associated recurrences."}
        />
      </Portal>
    </SafeAreaView>
  );
};

export default CardDetailsScreen;
