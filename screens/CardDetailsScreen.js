import React from "react";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Portal } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import { useSelector, useDispatch } from "react-redux";
import { deleteCard, deleteData } from "../redux/actions";
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

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);
  const filteredArray = expensesData.filter(
    (expense) => expense?.accCardSelected === card?.id
  );
  
  const deleteCardForever = () => {
    setIsDeleteBtnPressed(false);
    dispatch(deleteCard(card.id));
    for (const obj of filteredArray) dispatch(deleteData(obj.id));
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
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View style={styles.listView}>
            {filteredArray.map((exp, index) => (
                <DetailedExpenseCard exp={exp} key={index}/>
            ))}
          </View>
        </ScrollView>
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
          subtitle={"and expenses linked with this card will be deleted"}
        />
      </Portal>
    </SafeAreaView>
  );
};

export default CardDetailsScreen;
