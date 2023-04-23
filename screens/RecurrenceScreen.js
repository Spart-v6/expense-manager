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
import { FAB, Card, Text, Dialog, Button } from "react-native-paper";
import allColors from "../commons/allColors";
import moment from "moment";
import { useSelector } from "react-redux";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from "react";
import { useDispatch } from "react-redux";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeRecurrences, deleteRecurrences } from "../redux/actions";

const RecurrenceScreen = ({ navigation }) => {

  // #region Fetching expenses information for displaying current balance
  const expenseData = useSelector(state => state.expenseReducer.allExpenses);
  const totalValue = expenseData?.reduce((acc, curr) => {
    if (curr.type === "Income") return acc + +curr.amount; 
    else if (curr.type === "Expense") return acc - +curr.amount;
    else return acc;
  }, 0);

  let overallExpense = totalValue?.toString();
  if (totalValue >= 0) overallExpense = "$" + overallExpense;
  else
    overallExpense =
      overallExpense?.slice(0, 1) + "$" + overallExpense?.slice(1);
  // #endregion End


  const dispatch = useDispatch();
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);


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
            <Text variant="titleLarge">{`$${item.recurrenceAmount}`}</Text>
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
          {/* <Text>{item.paymentNetwork}</Text> */}
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

  let overallRec = totalRecurrenceSum?.toString();
  if (totalRecurrenceSum >= 0) overallRec = "$" + overallRec;
  else
    overallRec =
      overallRec?.slice(0, 1) + "$" + overallRec?.slice(1);
  // TODO: Add the recurrences for frequency too / recurrenceEndDate meaning if one recurrence starts two weeks before then add it twice in anticipated balancee
  // #endregion

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader
        title="Recurring Expenses"
        isParent={true}
        navigation={navigation}
      />
      <AnimatedEntryScreen>
        <View style={{ margin: 20 }}>
          <Card
            mode="contained"
            style={{ backgroundColor: allColors.backgroundColorSecondary }}
          >
            <Card.Title
              title="Future Balance"
              subtitle={overallRec}
              titleStyle={{
                color: allColors.textColorPrimary,
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
              <Text variant="headlineSmall">{`Current balance  ${overallExpense}`}</Text>
            </Card.Content>
          </Card>
        </View>

        {recurrencesData.length > 0 ?
          <ScrollView>
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
          <View style={{justifyContent: "center", alignItems: 'center', flex: 1}}>
            <MaterialCommunityIcons name={'repeat-off'} size={60} color={allColors.backgroundColorSecondary}/>
            <Text variant="titleMedium">You haven't added any recurring payment.</Text>
          </View>
        }
      </AnimatedEntryScreen>
      <FAB
        animated
        icon="repeat"
        onPress={() => navigation.navigate("PlusMoreRecurrence")}
        mode="flat"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        customSize={70}
      />

      <Dialog
        visible={isDeleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
        style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
      >
        <Dialog.Title>Delete recurrence?</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">The recurring payment will be removed permanently</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
          <Button
            onPress={handleDelete}
            mode="elevated"
            contentStyle={{ width: 60 }}
            buttonColor={allColors.warningColor}
          >
            <Text style={{ color: allColors.textColorTertiary }}>Sure</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: allColors.backgroundColorRecurrence,
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
