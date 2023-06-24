import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeCard } from "../redux/actions";
import { FontAwesome5 } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";
import capitalizeSentence from "../helper/capEachWord";

const makeStyles = allColors =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.defaultAccSplitRecCard,
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
  const allColors = useDynamicColors();
  // #region fetching currency
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
  // #endregion

  const styles = makeStyles(allColors);
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
    <View style={{ flex :1, marginBottom: 80 }}>
    {
      allCards?.length > 0 ? (
      allCards?.map(crd => (
        <Card style={[styles.card]} key={Math.random()} onPress={() => navigation.navigate("CardDetailsScreen", {card: crd})}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection:"row", alignItems:"center", gap: 10}}>
                <FontAwesome5
                  name="credit-card"
                  size={20}
                  color={allColors.textColorPrimary}
                  type="font-awesome-5"
                  solid={crd?.checked === "credit"}
                />
                <Text style={{color: allColors.universalColor}}>{crd?.checked?.charAt(0)?.toUpperCase() + crd?.checked?.slice(1)} Card</Text>
              </View>
                <Text variant="titleMedium" style={{color: allColors.universalColor, maxWidth: Dimensions.get("window").width / 2.5}} 
                  numberOfLines={1}
                    ellipsizeMode="tail">
                    {crd?.paymentNetwork}
                </Text>
            </View>
            <View style={{gap: 6, marginTop: 20}}>
              <Text variant="titleMedium" style={{color: allColors.universalColor}}>Total Expenditure</Text>
              <Text
                variant="headlineLarge"
                style={{ color: allColors.textColorPrimary }}
              >
                {formatNumberWithCurrency(
                    expensesData
                      .filter((exp) => exp.accCardSelected === crd.id)
                      ?.reduce((acc, card) => {
                        if (card.type === "Income") {
                          return acc + +card.amount;
                        } else if (card.type === "Expense") {
                          return acc - +card.amount;
                        } else {
                          return acc;
                        }
                      }, 0),
                    currency.curr
                  )}
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
                <View>
                  <Text variant="titleMedium" style={{color: allColors.universalColor}}>Card holder name</Text>
                  <Text
                    variant="headlineSmall"
                    style={{ color: allColors.textColorPrimary,  maxWidth: Dimensions.get("window").width / 2 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    >
                    {capitalizeSentence(crd?.cardHolderName)}
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
                      <Text variant="titleMedium" style={{ color: allColors.textColorPrimary }}>Expiry</Text>
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
        <View style={{justifyContent: "center", alignItems:"center", height: 700, flex: 1, marginBottom: 0}}>
          <MaterialCommunityIcons name="credit-card-off-outline" size={60} color={allColors.textColorPrimary} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text variant="titleMedium" style={{color: allColors.universalColor}}>You don't have cards yet.</Text>
            <Text variant="bodySmall" style={{color: allColors.universalColor}}>
              Click on "+" button to start adding cards
            </Text>
          </View>
        </View> 
      )
    }
    </View>
  );
};

export default CardComponent;
