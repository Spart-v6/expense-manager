import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Vibration
} from "react-native";
import { FAB, Card, Text, Dialog, Button, Portal } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import moment from "moment";
import { useSelector } from "react-redux";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from "react";
import { useDispatch } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeRecurrences, deleteRecurrences } from "../redux/actions";
import formatNumberWithCurrency from "../helper/formatter";
import { getCurrencyFromStorage } from "../helper/constants";
import * as Notifications from "expo-notifications";
import DeleteDialog from "../components/DeleteDialog";

const RecurrenceScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
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

  // #region going to scr thru notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const nextScreen = response.notification.request.content.data.headToThisScreen;
      navigation.navigate(nextScreen);
    });
    return () => subscription.remove();
  }, []);
  // #endregion

  // #region Fetching expenses information for displaying current balance
  const expenseData = useSelector(state => state.expenseReducer.allExpenses);
  const totalValue = expenseData?.reduce((acc, curr) => {
    if (curr.type === "Income") return acc + +curr.amount; 
    else if (curr.type === "Expense") return acc - +curr.amount;
    else return acc;
  }, 0);

  const dispatch = useDispatch();
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const hideDialog = () => setDeleteDialogVisible(false);

  const handleLongPress = (item) => {
    setSelectedItemToDelete(item);
    setDeleteDialogVisible(true);
    Vibration.vibrate(1);
  };

  const handleDelete = () => {
    setDeleteDialogVisible(false);
    dispatch(deleteRecurrences(selectedItemToDelete?.id))
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.8}>
      <Card style={styles.card}>
        <Card.Content style={{gap: 10}}>
          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
            <Text variant="titleLarge">{item.recurrenceName}</Text>
            <Text variant="titleLarge">{formatNumberWithCurrency(item.recurrenceAmount, currency.curr)}</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text variant="bodyMedium">{moment(item.recurrenceStartDate, 'DD MM YY').format('Do MMMM')}</Text>
              <Text style={styles.bulletText}>{'\u2022'}</Text>
              <Text numberOfLines={1} variant="bodyMedium">{item.recurrenceType}</Text>
              <Text style={styles.bulletText}>{'\u2022'}</Text>
              <Text numberOfLines={1} variant="bodyMedium">{item.paymentNetwork}</Text>
            </View>
            <FontAwesome name="repeat" size={10} color={'white'} style={{alignSelf:"center"}}/>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

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
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const recurrencesData = useSelector(
    (state) => state.recurrenceReducer.allRecurrences
  );

  //#region Finding the total sum of all recurrences
  const totalRecurrenceSum = recurrencesData?.reduce((acc, curr) => {
    if (curr.paymentType === "Income") return acc + +curr.recurrenceAmount; 
    else if (curr.paymentType === "Expense") return acc - +curr.recurrenceAmount;
    else return acc;
  }, 0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeader
        title="Recurring Expenses"
        isParent={true}
        navigation={navigation}
      />
      <AnimatedEntryScreen>
        <View style={{ margin: 20 }}>
          <Card
            mode="contained"
            style={{ backgroundColor: allColors.defaultHomeRecurrCard }}
          >
            <Card.Title
              title="Future Balance"
              subtitle={formatNumberWithCurrency((totalRecurrenceSum+totalValue), currency.curr)}
              titleStyle={{
                color: allColors.universalColor,
                fontSize: 30,
                paddingTop: 30,
              }}
              subtitleStyle={{
                fontSize: 35,
                textAlignVertical: "center",
                paddingTop: 30,
                paddingBottom: 10,
                color: allColors.textColorSecondary,
              }}
            />
            <Card.Content>
              <Text variant="headlineSmall" style={{color: allColors.universalColor}}>{`Current balance: ${formatNumberWithCurrency(totalValue, currency.curr)}`}</Text>
            </Card.Content>
          </Card>
        </View>

        {recurrencesData.length > 0 ?
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={{ margin: 20, flex: 1 }}>
              <FlatList
                scrollEnabled={false}
                data={recurrencesData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                />
            </View>
          </ScrollView>
          : 
          <View style={{justifyContent: "center", alignItems: 'center', flex: 1, marginBottom: 100}}>
            <MaterialCommunityIcons name={'repeat-off'} size={60} color={allColors.textColorPrimary}/>
            <Text variant="titleMedium" style={{color: allColors.universalColor}}>You haven't added any recurring payment.</Text>
          </View>
        }
      </AnimatedEntryScreen>
      <FAB
        animated
        icon="repeat"
        color={allColors.universalColor}
        onPress={() => navigation.navigate("PlusMoreRecurrence")}
        mode="elevated"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        customSize={70}
      />

      <Portal>
        <DeleteDialog
          visible={isDeleteDialogVisible}
          hideDialog={hideDialog}
          deleteExpense={handleDelete}
          allColors={allColors}
          title={"recurrence"}
          content={"recurring payment"}
        />
      </Portal>
    </SafeAreaView>
  );
};
const makeStyles = allColors => StyleSheet.create({
  card: {
    backgroundColor: allColors.defaultAccSplitRecCard,
    marginTop: 8,
    marginBottom: 8,
    elevation: 4,
    borderRadius: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 200
  },
  bulletText: {
    fontSize: 16,
    color: 'white',
    paddingHorizontal: 5,
  }
});
export default RecurrenceScreen;
