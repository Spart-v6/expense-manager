import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import allColors from "../commons/allColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeCard } from "../redux/actions";
import { FontAwesome5 } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const makeStyles = () =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.backgroundColorLessPrimary,
      borderRadius: 25,
      margin: 16,
      padding: 16,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
    },
  });

const CardComponent = () => {
  const styles = makeStyles();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchAllCardsData();
    }, [])
  );

  const fetchAllCardsData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_CARDS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeCard(newData));
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // =========== End

  const allCards = useSelector(state => state.cardReducer.allCards);
  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);

  return (
    <>
    {
      allCards?.length > 0 ? (
      allCards?.map(crd => (
        <Card style={[styles.card]} key={Math.random()} onPress={() => navigation.navigate("CardDetailsScreen", {card: crd})}>
          <Card.Title
            title={
              // TODO: Add dynamic full width
              <View style={{ flexDirection: 'row', width: 360, justifyContent: 'space-between'}}>
                <View style={{flexDirection:"row", alignItems:"center", gap: 10}}>
                <FontAwesome5
                    name="credit-card"
                    size={20}
                    color={allColors.textColorPrimary}
                    type="font-awesome-5"
                    solid={crd?.checked === "credit"}
                  />
                  <Text>{crd?.checked?.charAt(0)?.toUpperCase() + crd?.checked?.slice(1)} Card</Text>
                </View>
              <Text variant="titleMedium">{crd?.paymentNetwork}</Text>
            </View>
            }
          />
          <Card.Content>
            <View style={{gap: 6}}>
              <Text variant="titleMedium">Total Expenditure</Text>
              <Text
                variant="headlineLarge"
                style={{ color: allColors.textColorPrimary }}
              >
                {expensesData
                      .filter((exp) => exp.selectedCard === crd.paymentNetwork)
                      ?.reduce((acc, card) => {
                        if (card.type === "Income") {
                          return acc + +card.amount;
                        } else if (card.type === "Expense") {
                          return acc - +card.amount;
                        } else {
                          return acc;
                        }
                      }, 0)
                  }
              </Text>
            </View>
            <View style={styles.content}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <View style={{}}>
                  <Text variant="titleMedium">Card Holder name</Text>
                  <Text
                    variant="headlineSmall"
                    style={{ color: allColors.textColorPrimary }}
                    >
                    {crd?.cardHolderName.toUpperCase()}
                  </Text>
                </View>
                <View>
                  {
                    crd?.month === "" || crd?.year === "" ?
                    <Text
                      variant="titleSmall"
                      style={{ color: allColors.textColorPrimary }}
                    >
                      Valid Forever
                    </Text>
                    :
                    <View style={{flexDirection:"column", justifyContent:"center", alignItems:"flex-start"}}>
                      <Text variant="titleMedium">Expiry</Text>
                      <View style={{flexDirection:"row", gap: 5}}>
                        <Text variant="headlineSmall"
                        style={{ color: allColors.textColorPrimary }}>{crd?.month}</Text>
                        <Text variant="headlineSmall"
                        style={{ color: allColors.textColorPrimary }}>/</Text>
                        <Text variant="headlineSmall"
                        style={{ color: allColors.textColorPrimary }}>{crd?.year}</Text>
                      </View>

                    </View>
                  }
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      )))
      : 
      (
        <>
          <View style={{justifyContent: "center", alignItems:"center", flex: 1, height: 700 }}>
            <MaterialCommunityIcons name="credit-card-off-outline" size={60} color={allColors.backgroundColorSecondary} />
            <Text variant="titleMedium">You don't have cards yet.</Text>
          </View>
        </>
      )
    }
    </>
  );
};

export default CardComponent;
