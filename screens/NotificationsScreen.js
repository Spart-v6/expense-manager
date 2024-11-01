import { View, SafeAreaView, StyleSheet, TouchableOpacity, Animated, PanResponder, PermissionsAndroid, Platform } from "react-native";
import useDynamicColors from "../commons/useDynamicColors";
import React, { useRef, useState } from "react";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import { Button, Card } from "react-native-paper";
import Entypo from 'react-native-vector-icons/Entypo';
import SmsAndroid from 'react-native-get-sms-android';
import moment from "moment";

const NotificationsScreen = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);

  const [isCardVisible, setIsCardVisible] = useState(true);
  const [clearAll, setClearAll] = useState(false); // For clearing all notifications

  const pan = useRef(new Animated.ValueXY()).current;

  // Configure the PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 300;

        // Check if swipe exceeds the threshold for right or left
        if (gestureState.dx > swipeThreshold) {
          handleSwipeRight();
        } else if (gestureState.dx < -swipeThreshold) {
          handleSwipeLeft();
        } else {
          // Reset position if swipe was not strong enough
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

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


  async function requestSmsPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app requires access to your SMS messages to fetch transaction information.',
          buttonPositive: 'OK'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  }

  async function fetchFilteredMessages(fromDate, toDate) {
    const hasPermission = await requestSmsPermission();
    if (!hasPermission) {
      console.log('SMS permission not granted');
      return;
    }

    const fromTimestamp = moment(fromDate, 'YYYY-MM-DD').valueOf();
    const toTimestamp = moment(toDate, 'YYYY-MM-DD').valueOf();

    const filter = {
      box: 'inbox', // Inbox messages only
      minDate: fromTimestamp,
      maxDate: toTimestamp,
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        const messages = JSON.parse(smsList);
         // Map to store bank codes and their corresponding names
        const bankNamesMap = {
          "JD-ICICIT": "ICICI Bank",
          "AX-DBSBNK": "DBS Bank",
          // more banks, check body of message first
        };

        console.log("All messages +=== ", messages);

        const transactionDetails = messages
          .filter((msg) =>
            msg.body.toLowerCase().includes('credited') || msg.body.toLowerCase().includes('debited')
          )
        .map((msg) => {
          const bankName = bankNamesMap[msg.address] || "Unknown Bank";
          const body = msg.body.toLowerCase();

          // Detect transaction type as first occurrence of "credited" or "debited"
          const transactionTypeMatch = body.match(/\b(credited|debited)\b/i);
          const transactionType = transactionTypeMatch ? transactionTypeMatch[1].toLowerCase() : null;

          // Extract amount using a regex pattern
          const amountMatch = body.match(/(?:rs|inr)[\s]*([\d,]+(\.\d{2})?)/i);
          const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

          // Extract date in various formats (e.g., "31-Oct-24" or "31-10-2024")
          const dateMatch = body.match(/(\d{2}-[A-Za-z]{3}-\d{2,4}|\d{2}-\d{2}-\d{4})/);
          const transactionDate = dateMatch ? dateMatch[0] : null;

          return {
            bank: bankName,
            amount,
            date: transactionDate,
            transactionType,
          };
        });
        console.log('Transaction Details:', transactionDetails);
    });
  }

  const readSMS = () => {
    console.log("Calling fetchFileretedMessages function ");
    fetchFilteredMessages('2024-10-30', '2024-11-02');
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Notifications" navigation={navigation} onClearAll={clearNotifications} />
      <View>
        <Button
          onPress={readSMS}
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
        {isCardVisible && !clearAll && (
          <Animated.View style={[styles.card, { transform: [{ translateX: pan.x }] }]} {...panResponder.panHandlers}>
            <TouchableOpacity onLongPress={() => {}} activeOpacity={0.8}>
              <Card style={styles.card}>
                <Card.Content style={{ gap: 10 }}>
                  <Entypo name="dot-single" size={10} color={allColors.universalColor} style={{ alignSelf: "center" }} />
                  <View></View>
                  <View style={styles.container}>
                    <View style={styles.textContainer}></View>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
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
