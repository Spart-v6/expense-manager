import { View, SafeAreaView, StyleSheet, TouchableOpacity, Animated, PanResponder, LayoutAnimation, UIManager, Platform, FlatList } from "react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readSms, addSms, deleteSms, fetchAlreadyStoredSmses } from "../redux/actions";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import * as Haptics from 'expo-haptics';
import { fetchSmses } from "../helper/smsService";
import { Button, Card, Portal, Dialog, TextInput, Divider } from "react-native-paper";

const NotificationsScreen = ({ navigation }) => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const dispatch = useDispatch();
  const smsList = useSelector((state) => state.smsReducer.smsList);
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const [openFetchSmsDialog, setOpenFetchSmsDialog] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState('1');
  const [dateRangeToDisplay, setDateRangeToDisplay] = useState(moment().format('MMM DD, \'YY'));

  const clearNotifications = () => {
    smsList.forEach((sms, index) => {
      setTimeout(() => {
        handleDeleteSms(sms.msgId);
      }, index * 50);
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  };

  // Load stored SMS on first render
  useEffect(() => {
    dispatch(readSms());
    const loadStoredSms = async () => {
      try {
        const storedSms = await AsyncStorage.getItem('smsList');
        const smsList = storedSms ? JSON.parse(storedSms) : [];
        dispatch(fetchAlreadyStoredSmses(smsList));
      } catch (error) {
        console.error("Error loading SMS from AsyncStorage:", error);
      }
    };
    loadStoredSms();
  }, [dispatch]);

  const handleFetchSms = async () => {
    try {
      const smsMessages = await fetchSmses(moment(dateRangeToDisplay, 'MMM DD, \'YY').format('YYYY-MM-DD'), moment().add(1, 'days').format('YYYY-MM-DD'));
      if (smsMessages && smsMessages.length > 0) {
        dispatch(addSms(smsMessages));
      }
    } catch (error) {
      console.error("Error fetching SMS messages:", error);
    } finally {
      setOpenFetchSmsDialog(false);
    }
  };

  const handleDeleteSms = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(deleteSms(id));
  };

  const handleToExpenseScreen = sms => {
    navigation.navigate("PlusMoreHome", { sms: sms })
  }

  const handleDateChange = val => {
    // Remove any non-numeric characters
    const numericVal = val.replace(/[^0-9]/g, '');

    // Only set the value if it's within the range 0-7
    if (numericVal !== '' && numericVal >= 0 && numericVal <= 7) {
      setNumberOfDays(numericVal);
      setDateRangeToDisplay(moment().subtract(parseInt(numericVal, 10), 'days').format('MMM DD, \'YY'));
    } else if (numericVal === '') {
      setNumberOfDays('');
      setDateRangeToDisplay(moment().format('MMM DD, \'YY'));
    }
  }

  const NotificationCard = ({ sms }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 100;
        if (Math.abs(gestureState.dx) > swipeThreshold) {
          Animated.timing(pan, {
            toValue: { x: gestureState.dx > 0 ? 500 : -500, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            handleDeleteSms(sms.msgId);
          });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        }
      },
    });

    const isCreditOrDebit = sms.transactionType === 'credited' ? 1 : 0;
    const txnMsg = isCreditOrDebit ? 'Credited to' : 'Debited from';

    return (
      <Animated.View style={[{ transform: [{ translateX: pan.x }] }]} {...panResponder.panHandlers}>
        <TouchableOpacity onPress={() => handleToExpenseScreen(sms)} activeOpacity={0.8}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View>
                <MyText>{`${moment(sms.date).format('DD MMM \'YY')}`}</MyText>
                <MyText>{`${txnMsg}: ${sms.bank} Bank`}</MyText>
              </View>
              <MyText style={[{ color: isCreditOrDebit ? allColors.successColor : allColors.warningColor }]}>
                {`${isCreditOrDebit ? '+' : '-'}${sms.amount}`}
              </MyText>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = useCallback(
    ({ item: sms }) => <NotificationCard sms={sms} />,
    [allColors]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Notifications" navigation={navigation} onClearAll={clearNotifications} />
      <View>
        <Button
          onPress={() => setOpenFetchSmsDialog(!openFetchSmsDialog)}
          mode="contained"
          labelStyle={{ fontSize: 15 }}
          textColor={"black"}
          style={{
            borderColor: "transparent",
            backgroundColor: allColors.addBtnColors,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            marginLeft: 20,
            marginRight: 20
          }}
        >
          <MyText
            style={{
              color: allColors.backgroundColorPrimary,
              fontFamily: "Karla_400Regular",
              fontSize: 18,
            }}
          >
            Fetch recent transactions
          </MyText>
        </Button>
      </View>
        {
          smsList.length > 0 ? (
            <FlatList
              data={smsList}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={{ padding: 20 }}
              alwaysBounceVertical
            />
          ) 
          : (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
              <MaterialCommunityIcons
                name="android-messages"
                size={60}
                color={allColors.textColorPrimary}
              />
              <MyText variant="titleMedium" style={{color: allColors.universalColor}}>No transactions found</MyText>
              <MyText variant="bodySmall" style={{color: allColors.universalColor}}>Tap the button above to fetch your latest transactions from SMS</MyText>
            </View>
          )
        }
      <Portal>
        <Dialog visible={openFetchSmsDialog} onDismiss={() => setOpenFetchSmsDialog(false)} 
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
          theme={{ colors: { backdrop: "#00000099" }}}
        >
          <Dialog.Title style={{ color: allColors.textColorSecondary, fontFamily: "Karla_400Regular"}}>Import SMS transactions messages</Dialog.Title>
          <Dialog.Content style={{gap: 15}}>
            <View style={{justifyContent: "center", alignItems: "flex-start"}}>
              <MyText variant="bodyMedium">This will only fetch transaction-related SMS messages, focusing specifically on UPI payments within the specified date range.
                No other messages will be accessed or processed.</MyText>
                <MyText variant="bodyMedium">
                  <MyText style={{ fontWeight: 'bold' }}>Note:</MyText> The date range is limited to the past 7 days.
                </MyText>
            </View>
            <Divider style={{backgroundColor: allColors.textColorPrimary}} bold/>
            <View>
              <MyText>Enter the number of previous days to fetch data:</MyText>
              <TextInput
                  style={{ width: 80, backgroundColor: "transparent" }}
                  allowFontScaling={false}
                  underlineColor={allColors.textColorPrimary}
                  textColor={allColors.universalColor}
                  cursorColor={allColors.universalColor}
                  selectionColor={allColors.textSelectionColor}
                  activeUnderlineColor={allColors.textColorPrimary}
                  contentStyle={{ fontFamily: "Karla_400Regular" }}
                  value={numberOfDays}
                  onChangeText={val => handleDateChange(val)}
                  keyboardType={"number-pad"}
                  maxLength={1}
                  autoCorrect={false}
                  autoComplete="off"
              />
            </View>
            <View>
              <MyText>Date range is from {dateRangeToDisplay} to {moment().format('MMM DD, \'YY')}</MyText>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleFetchSms}>
              <MyText style={{ color: allColors.textColorPrimary, fontWeight: "700" }}>
                Next
              </MyText>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const makeStyles = (allColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.defaultAccSplitRecCard,
      marginVertical: 8,
      elevation: 4,
      borderRadius: 8,
    },
    cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
    },
  });

export default NotificationsScreen;
