import { View, SafeAreaView, StyleSheet, TouchableOpacity, Animated, PanResponder, PermissionsAndroid, Platform, FlatList, ScrollView } from "react-native";
import useDynamicColors from "../commons/useDynamicColors";
import React, { useRef, useState, useEffect, useCallback } from "react";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import { Button, Card, Portal, Dialog } from "react-native-paper";
import Entypo from 'react-native-vector-icons/Entypo';
import SmsAndroid from 'react-native-get-sms-android';
import moment from "moment";
import { readSms, addSms, deleteSms, fetchStoredSms, fetchAlreadyStoredSmses } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchSmses } from "../helper/smsService";

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const smsList = useSelector((state) => state.smsReducer.smsList);

  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);

  const [isCardVisible, setIsCardVisible] = useState(true);
  const [clearAll, setClearAll] = useState(false); // For clearing all notifications
  const [openFetchSmsDialog, setOpenFetchSmsDialog] = useState(false);

  const hideCard = () => {
    Animated.timing(pan, {
      toValue: { x: pan.x._value > 0 ? 500 : -500, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsCardVisible(false);
    });
  };

  const clearNotifications = () => {
    setClearAll(true);
    hideCard();
  };

  const handleSwipeRight = () => {
    hideCard();
  };

  const handleSwipeLeft = () => {
    hideCard();
  };

  // #region Read/Store/Del sms

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
        const smsMessages = await fetchSmses();

        if (smsMessages && smsMessages.length > 0) {
            dispatch(addSms(smsMessages));
        } else {
            console.log("No SMS messages fetched or an error occurred.");
        }
    } catch (error) {
        console.error("Error fetching SMS messages:", error);
    } finally {
        setOpenFetchSmsDialog(false);
    }
  };

  const handleDeleteSms = (id) => {
      dispatch(deleteSms(id));
  };

  // #endregion


  const NotificationCard = ({ sms, allColors, handleDeleteSms }) => {
    const isCrediOrDebit = sms.transactionType === 'credited' ? 1 : 0;
    const txnMsg = isCrediOrDebit ? 'Credited to' : 'Debited from';

    const pan = useRef(new Animated.ValueXY()).current;
  
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 200;
  
        if (gestureState.dx > swipeThreshold || gestureState.dx < -swipeThreshold) {
          // Swipe action based on direction
          Animated.timing(pan, {
            toValue: { x: gestureState.dx > 0 ? 500 : -500, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleDeleteSms(sms.msgId);
          });
        } else {
          // Reset position if swipe threshold not met
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        }
      },
    });
  
    return (
      <Animated.View style={[styles.card, { transform: [{ translateX: pan.x }] }]} {...panResponder.panHandlers}>
        <TouchableOpacity onLongPress={() => {}} activeOpacity={0.8}>
          <Card style={styles.card}>
            <Card.Content style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <MyText>{`${moment(sms.date).format('DD MMM \'YY')}`}</MyText>
                <MyText>{`${txnMsg}: ${sms.bank} Bank`}</MyText>
              </View>
              <View >
                <MyText style={[
                  isCrediOrDebit ? { color: allColors.successColor } : { color: allColors.warningColor },
                ]}>
                  {`${isCrediOrDebit ? '+' : '-'}${sms.amount}`}
                </MyText>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = useCallback(({ item: sms }) => (
    <NotificationCard sms={sms} allColors={allColors} handleDeleteSms={handleDeleteSms} />
  ), [allColors, handleDeleteSms]);  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Notifications" navigation={navigation} onClearAll={clearNotifications} />
      <View>
        <Button
          // onPress={handleFetchSms}
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
      <View style={{ flex: 1, marginLeft: 20, marginTop: 20, marginRight: 20, gap: 10 }}>
        {/*  */}
         <FlatList
            data={smsList}
            keyExtractor={(item) => item.msgId.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
        />
      </View>
      <Portal>
        <Dialog
          visible={openFetchSmsDialog}
          onDismiss={() => setOpenFetchSmsDialog(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
          theme={{
            colors: {
              backdrop: "#00000099",
            },
          }}
        >
          <Dialog.Title
            style={{
              color: allColors.textColorSecondary,
              fontFamily: "Karla_400Regular",
            }}
          >
            Import transaction messages
          </Dialog.Title>
          <Dialog.Content>
            <View style={{}}>
              <MyText>
                Start date
              </MyText>
              <MyText>
                End date
              </MyText>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleFetchSms}>
              <MyText style={{ color: allColors.textColorPrimary }}>
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
      marginTop: 8,
      marginBottom: 8,
      elevation: 4,
      borderRadius: 8,
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
      maxWidth: 200,
    },
    bulletText: {
      fontSize: 16,
      color: allColors.universalColor,
      paddingHorizontal: 5,
    },
  });

export default NotificationsScreen;
