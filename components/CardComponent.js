import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { Card, Portal } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCard, deleteData, deleteRecentTransactions, deleteRecurrences, storeCard, storeRecurrences } from "../redux/actions";
import { FontAwesome5 } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyText from "./MyText";
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";
import capitalizeSentence from "../helper/capEachWord";
import { TouchableOpacity } from "react-native-gesture-handler";
import DeleteDialog from "./DeleteDialog";
import * as Haptics from 'expo-haptics';

const makeStyles = allColors =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.defaultAccSplitRecCard,
      borderRadius: 25,
      margin: 16,
      padding: 16,
      position: "relative",
      overflow: "hidden",
      borderColor: '#141212',
      borderWidth: 2,
      shadowColor: '#000',
      shadowOpacity: 1,
      
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
    },
    svgContainer: {
      position: 'absolute',
      right: -70,
      top: -90,
      opacity: 0.3,
      width: 350,
      height: 350,
    },
    lineContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    line1: {
      width: 300,
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: [{ rotate: '45deg' }],
      position: 'absolute',
      top: -50,
      right: -100,
      opacity: 0.7
    },
    line2: {
      width: 300,
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: [{ rotate: '45deg' }],
      position: 'absolute',
      top: 0,
      right: -80,
      opacity: 0.6
    },
    line3: {
      width: 300,
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      transform: [{ rotate: '45deg' }],
      position: 'absolute',
      top: 50,
      right: -60,
      opacity: 0.5
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
    } catch (e) {}
  };
  // =========== End

  const allCards = useSelector(state => state.cardReducer.allCards);
  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);

  const [selectedCardToDel, setSelectedCardToDel] = useState(null);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  
  // Code only when deleting a specific card, all related expenses and recurrences will be removed
  const filteredArray = expensesData.filter(
    (expense) => expense?.accCardSelected === selectedCardToDel
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


  const hideDialog = () => setDeleteDialogVisible(false);

  const handleAccountCardDelete = item => {
    setSelectedCardToDel(item.id);
    setDeleteDialogVisible(true);
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    )
  }

  const handleAccountCardDeleteForever = () => {
    setDeleteDialogVisible(false);
    for (const obj of filteredArray) { dispatch(deleteData(obj.id)); dispatch(deleteRecentTransactions(obj.id)); }
    for (const obj of recurrencesData) { 
      if (obj.accCardSelected === selectedCardToDel) {
        dispatch(deleteRecurrences(obj.id));
      }
    }
    dispatch(deleteCard(selectedCardToDel));
  }

  
  const renderItem = useCallback(({ item: crd }) => (
    <TouchableOpacity
      onLongPress={() => handleAccountCardDelete(crd)}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("CardDetailsScreen", { card: crd })}
    >

    <Card style={[styles.card]}>
      <View style={styles.lineContainer}>
        <View style={styles.line1} />
        <View style={styles.line2} />
        <View style={styles.line3} />
      </View>
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FontAwesome5
              name="credit-card"
              size={20}
              color={allColors.textColorPrimary}
              type="font-awesome-5"
              solid={crd?.checked === 'credit'}
            />
            <MyText style={{ color: allColors.universalColor }}>
              {crd?.checked?.charAt(0)?.toUpperCase() + crd?.checked?.slice(1)} Card
            </MyText>
          </View>
          <MyText
            variant="titleMedium"
            style={{
              color: allColors.universalColor,
              maxWidth: Dimensions.get('window').width / 2.5,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {crd?.paymentNetwork}
          </MyText>
        </View>
        <View style={{ gap: 6, marginTop: 20 }}>
          <MyText variant="titleMedium" style={{ color: allColors.universalColor }}>
            Total Expenditure
          </MyText>
          <MyText
            variant="headlineLarge"
            style={{ color: allColors.textColorPrimary }}
          >
            {formatNumberWithCurrency(
              expensesData
                .filter((exp) => exp.accCardSelected === crd.id)
                ?.reduce((acc, card) => {
                  if (card.type === 'Income') {
                    return acc + +card.amount;
                  } else if (card.type === 'Expense') {
                    return acc - +card.amount;
                  } else {
                    return acc;
                  }
                }, 0),
              currency.curr
            )}
          </MyText>
        </View>
        <View style={styles.content}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <MyText
                variant="headlineSmall"
                style={{
                  color: allColors.textColorPrimary,
                  maxWidth: Dimensions.get('window').width / 2,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {capitalizeSentence(crd?.cardHolderName)}
              </MyText>
            </View>
            <View>
              {crd?.month === '' || crd?.year === '' ? (
                <MyText variant="titleSmall" style={{ color: allColors.textColorPrimary }}>
                  
                </MyText>
              ) : (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', gap: 5, opacity: 0.6 }}>
                    <MyText variant="headlineSmall" style={{ color: allColors.textColorPrimary }}>
                      {crd?.month}
                    </MyText>
                    <MyText variant="headlineSmall" style={{ color: allColors.textColorPrimary }}>
                      /
                    </MyText>
                    <MyText variant="headlineSmall" style={{ color: allColors.textColorPrimary }}>
                      {crd?.year}
                    </MyText>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
    </TouchableOpacity>

  ), [currency, allColors]);

  return (
    <>
    <View style={{ flex :1 }}>
    {
      allCards?.length > 0 ? (
        <FlatList
          data={allCards}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
      />)
      : 
      (
        <View style={{justifyContent: "center", alignItems: 'center', flex: 1, marginBottom: 100}}>
          <MaterialCommunityIcons name="credit-card-off-outline" size={60} color={allColors.textColorPrimary} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MyText variant="titleMedium" style={{color: allColors.universalColor}}>You don't have cards yet.</MyText>
            <MyText variant="bodySmall" style={{color: allColors.universalColor}}>
              Click on "+" button to start adding cards
            </MyText>
          </View>
        </View> 
      )
    }
    </View>
      <Portal>
        <DeleteDialog
          visible={isDeleteDialogVisible}
          hideDialog={hideDialog}
          deleteExpense={handleAccountCardDeleteForever}
          allColors={allColors}
          title={"card"}
          content={"card"}
          subtitle={", along with its expenses and associated recurrences."}
        />
      </Portal>
    </>
  );
};

export default CardComponent;
