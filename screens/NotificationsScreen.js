import { View, SafeAreaView, StyleSheet, TouchableOpacity, Animated, PanResponder, LayoutAnimation, UIManager, Platform, FlatList } from "react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readSms, addSms, deleteSms, fetchAlreadyStoredSmses } from "../redux/actions";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import * as Haptics from 'expo-haptics';
import { fetchSmses } from "../helper/smsService";
import { Button, Card, Portal, Dialog } from "react-native-paper";

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
      const smsMessages = await fetchSmses();
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
        <TouchableOpacity activeOpacity={0.8}>
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
      <FlatList
        data={smsList}
        keyExtractor={(item) => item.msgId.toString()}
        renderItem={renderItem}
        style={{ padding: 20 }}
      />
      <Portal>
        <Dialog visible={openFetchSmsDialog} onDismiss={() => setOpenFetchSmsDialog(false)} 
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
          theme={{ colors: { backdrop: "#00000099" }}}
        >
          <Dialog.Title style={{ color: allColors.textColorSecondary, fontFamily: "Karla_400Regular"}}>Import transaction messages</Dialog.Title>
          <Dialog.Content>
            <View>
              <MyText>Start date</MyText>
              <MyText>End date</MyText>
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
