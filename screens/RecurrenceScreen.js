import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import * as Haptics from 'expo-haptics';
import { FAB, Card, Portal } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import { FlashList } from "@shopify/flash-list";
import moment from "moment";
import { useSelector } from "react-redux";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from "react-redux";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeRecurrences, deleteRecurrences } from "../redux/actions";
import formatNumberWithCurrency from "../helper/formatter";
import { getCurrencyFromStorage } from "../helper/constants";
import * as Notifications from "expo-notifications";
import DeleteDialog from "../components/DeleteDialog";
import { Path, Svg } from "react-native-svg";


const RightSideSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" fill="black" fill-opacity="0.01"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.876 15.124C7.467 16.0927 8.3205 16.874 9.33752 17.3773C10.3545 17.8807 11.4934 18.0854 12.622 17.9677C13.7507 17.85 14.8228 17.4148 15.7142 16.7126C16.6055 16.0103 17.2795 15.0698 17.658 14H19.748C19.3645 15.4823 18.5638 16.8235 17.441 17.8645C16.3181 18.9054 14.9202 19.6024 13.4131 19.8727C11.906 20.1431 10.3531 19.9754 8.9384 19.3897C7.52374 18.8039 6.30682 17.8246 5.432 16.568L3 19V13H9L6.876 15.124ZM17.125 8.875C16.5337 7.90617 15.6799 7.12478 14.6626 6.62146C13.6452 6.11813 12.5061 5.91348 11.3772 6.03124C10.2483 6.149 9.17589 6.58434 8.28434 7.28678C7.3928 7.98922 6.71863 8.92999 6.34 10H4.25C4.63336 8.51711 5.4341 7.17532 6.55719 6.13387C7.68028 5.09243 9.07858 4.39505 10.5861 4.12448C12.0937 3.85392 13.6472 4.02154 15.0624 4.60745C16.4775 5.19336 17.6949 6.17296 18.57 7.43L21 5V11H15L17.125 8.875Z" fill="#D3D3D3" fill-opacity="0.31"/>
  </svg>

);
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

  const dispatch = useDispatch();
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const hideDialog = () => setDeleteDialogVisible(false);

  const handleLongPress = (item) => {
    setSelectedItemToDelete(item);
    setDeleteDialogVisible(true);
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    );
  };

  const handleDelete = () => {
    setDeleteDialogVisible(false);
    dispatch(deleteRecurrences(selectedItemToDelete?.id))
  };

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.8}>
      <Card style={styles.card}>
        <Card.Content style={{gap: 10}}>
          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
            <MyText variant="titleLarge" style={{color: allColors.universalColor, maxWidth: Dimensions.get("window").width / 1.8}}
            numberOfLines={1} ellipsizeMode="tail">
              {item.recurrenceName}
            </MyText>
            <MyText variant="titleLarge" style={[{maxWidth: Dimensions.get("window").width / 3}, item.paymentType === "Expense" ? {color: allColors.payRedTextBg}: {color: allColors.receiveGreenTextBg}]}
            numberOfLines={1} ellipsizeMode="tail">
              {formatNumberWithCurrency(item.recurrenceAmount, currency.curr)}
            </MyText>
          </View>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <MyText variant="bodyMedium" style={{color: allColors.universalColor}}>{moment(item.recurrenceStartDate, 'DD MM YY').format('Do MMMM')}</MyText>
              <MyText style={styles.bulletText}>{'\u2022'}</MyText>
              <MyText numberOfLines={1} variant="bodyMedium" style={{color: allColors.universalColor, maxWidth: Dimensions.get("window").width / 4}} ellipsizeMode="tail">
                {item.recurrenceType}
              </MyText>
              <MyText style={styles.bulletText}>{'\u2022'}</MyText>
              <MyText numberOfLines={1} variant="bodyMedium" style={{color: allColors.universalColor, maxWidth: Dimensions.get("window").width / 4}} ellipsizeMode="tail">
                {item.paymentNetwork}
              </MyText>
            </View>
            <FontAwesome name="repeat" size={10} color={allColors.universalColor} style={{alignSelf:"center"}}/>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  ), [currency, allColors]);

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

  recurrencesData.sort((a,b) => {
    const dateA = moment(`${a.recurrenceStartDate} ${a.time}`, "DD MM YY HH:mm:ss");
    const dateB = moment(`${b.recurrenceStartDate} ${b.time}`, "DD MM YY HH:mm:ss");
    if (dateA.isAfter(dateB)) {
      return -1;
    } else if (dateA.isBefore(dateB)) {
      return 1;
    } else {
      return 0;
    }
  })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeader
        title="Recurring Expenses"
        isParent={true}
        navigation={navigation}
      />
      <AnimatedEntryScreen>
        {recurrencesData.length > 0 ?
            <View style={{ margin: 20, flex: 1, marginBottom: 80, marginTop: 0 }}>
              <FlashList
                data={recurrencesData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                estimatedItemSize={200}
              />
            </View>
          : 
          <View style={{justifyContent: "center", alignItems: 'center', flex: 1, marginBottom: 100}}>
            <MaterialCommunityIcons name={'repeat-off'} size={60} color={allColors.textColorPrimary}/>
            <MyText variant="titleMedium" style={{color: allColors.universalColor}}>You haven't added any recurring payment.</MyText>
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
    color: allColors.universalColor,
    paddingHorizontal: 5,
  }
});
export default RecurrenceScreen;
