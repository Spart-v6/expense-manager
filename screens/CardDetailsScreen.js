import React from "react";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import { useSelector, useDispatch } from "react-redux";
import Feather from 'react-native-vector-icons/Feather';
import DetailedExpenseCard from "../components/DetailedExpenseCard";

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

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);
  const filteredArray = expensesData.filter(
    (expense) => expense?.accCardSelected === card?.id
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
      />
      {
        filteredArray.length > 0 ?
        <View style={{flex : 1}}>
          <DetailedExpenseCard exp={filteredArray} key={Math.random()}/>
        </View>
        :
        <View style={{justifyContent: "center", alignItems: 'center', height: 800, gap: 15}}>
          <Feather name="alert-triangle" size={60} color={allColors.textColorPrimary}/>        
          <MyText variant="titleMedium" style={{color: allColors.universalColor}}>Expenses will appear here once added to this card.</MyText>
        </View>
      }
    </SafeAreaView>
  );
};

export default CardDetailsScreen;
