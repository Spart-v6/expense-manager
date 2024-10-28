import { View, SafeAreaView, StyleSheet, TouchableOpacity, Animated, PanResponder } from "react-native";
import useDynamicColors from "../commons/useDynamicColors";
import React, { useRef, useState } from "react";
import MyText from "../components/MyText";
import AppHeader from "../components/AppHeader";
import { Card } from "react-native-paper";
import Entypo from 'react-native-vector-icons/Entypo';

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


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Notifications" navigation={navigation} onClearAll={clearNotifications} />
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
