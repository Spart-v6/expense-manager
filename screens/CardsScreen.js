import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  useColorScheme,
  Pressable,
  Vibration
} from "react-native";
import {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import Animated, { withTiming, withSequence } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { FAB, Dialog, Portal, Button, Text } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, getMonth, getYear, parseISO } from 'date-fns';
import { useFocusEffect } from "@react-navigation/native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.25;
const SPACING = 10;

const CardItem = ({ item, index, scrollY, navigation, allTransactions, onLongPressCard }) => {
  const colorScheme = useColorScheme();
  const { theme, initialized, themeColor } = useThemeContext();
  const styles = makeStyles(theme);

  const filteredTransactions = allTransactions.filter(
    (transaction) => transaction.cardId === item.id
  );

  const simplifiedTransactions = filteredTransactions.map(tx => ({
    title: tx.title,
    amount: tx.amount,
  }));

  const gradientDirections = [
    { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Top-left ➔ Bottom-right
    { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }, // Top-right ➔ Bottom-left
    { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } }, // Bottom-left ➔ Top-right
    { start: { x: 1, y: 1 }, end: { x: 0, y: 0 } }, // Bottom-right ➔ Top-left
    { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } }, // Top ➔ Bottom
    { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } }, // Left ➔ Right
  ];

  // Randomly pick one direction
  const randomDirection =
    gradientDirections[Math.floor(Math.random() * gradientDirections.length)];

  const colors = [theme[colorScheme].primary, theme[colorScheme].surface];

  const animatedCardScale = useSharedValue(1);

  const inputRange = [
    (index - 1) * (CARD_HEIGHT + SPACING),
    index * (CARD_HEIGHT + SPACING),
    (index + 1) * (CARD_HEIGHT + SPACING),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scrollScale = interpolate(
      scrollY.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );
    const scrollOpacity = interpolate(
      scrollY.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale: scrollScale * animatedCardScale.value }],
      opacity: scrollOpacity,
    };
  });

  const handlePress = () => {
    // Bounce Animation
    animatedCardScale.value = 0.98;
    animatedCardScale.value = withSequence(
      // withTiming(0.98, { duration: 100 }),
      withTiming(1.03, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );    
    navigation.push("IndividualCardScreen", {
      title: item.name, // IMP: change this dynamically (this is required *)
      cardName: item.cardNetwork,
      last4: item.last4Digits,
      expiryDate: item.expiryDate,
      transactions: simplifiedTransactions,
    });
  };



  const formattedExpiryDate = format(parseISO(item.expiryDate), "MM-yy");

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.card, animatedStyle]}
      onLongPress={() => {
        Vibration.vibrate(10);
        onLongPressCard();
      }}
    >
      <LinearGradient
        colors={colors}
        start={randomDirection.start}
        end={randomDirection.end}
        style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.type}>{item.type}</Text>
        <Icon name="contactless-payment" size={24} color="#fff" />
      </View>
      <View>
        <Text style={styles.number}>•••• {item.last4Digits}</Text>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.label}>Card Holder</Text>
            <Text style={styles.value}>{item.name}</Text>
          </View>
          <View>
            <Text style={styles.label}>Expires</Text>
            <Text style={styles.value}>{formattedExpiryDate}</Text>
          </View>
          {/* <Image
            source={{ uri: item.logo }}
            style={styles.logo}
            resizeMode="contain"
          /> */}
        </View>
      </View>
    </AnimatedPressable>
  );
};

export default function CardsScreen({ navigation }) {
  const scrollY = useSharedValue(0);
  const colorScheme = useColorScheme();
  const { theme, initialized, themeColor } = useThemeContext();
  const styles = makeStyles(theme);

  const [visible, setVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const cardsData = await AsyncStorage.getItem("cards");
          const parsedCards = cardsData ? JSON.parse(cardsData) : [];
          setCards(parsedCards);

          const txData = await AsyncStorage.getItem("transactions");
          const parsedTx = txData ? JSON.parse(txData) : [];
          setTransactions(parsedTx);
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      };

      fetchData();
    }, [])
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const showDialog = (cardId) => {
    setSelectedCardId(cardId);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedCardId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedCardId) return;

      // Delete card
      const storedCards = await AsyncStorage.getItem("cards");
      const parsedCards = storedCards ? JSON.parse(storedCards) : [];
      const updatedCards = parsedCards.filter(card => card.id !== selectedCardId);
      await AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
      setCards(updatedCards);

      // Delete associated transactions
      const storedTx = await AsyncStorage.getItem("transactions");
      const parsedTx = storedTx ? JSON.parse(storedTx) : [];

      // deletion logic for correctly updating monthly summary amounts
      const txnToDelete = parsedTx.find(tx => tx.cardId === selectedCardId); // finding the transaction to delete via cardId (storing it - txnToDelete-  coz required later)
      if (!txnToDelete) return;

      console.log("Deleting transactions for card ID:", selectedCardId);
      

      const updatedTx = parsedTx.filter(tx => tx.cardId !== selectedCardId);
      await AsyncStorage.setItem("transactions", JSON.stringify(updatedTx));
      setTransactions(updatedTx);

      const monthlySummaryData = await AsyncStorage.getItem("monthlySummary");
      let summary = monthlySummaryData ? JSON.parse(monthlySummaryData) : {};

      const txnDate = parseISO(txnToDelete.date); // coz stored ISO string (txnToDelete required here)
      const year = getYear(txnDate);
      const month = getMonth(txnDate);

      if (summary[year]) {
        if (txnToDelete.type === "Income") { // txnToDelete required here
          summary[year][month].income -= txnToDelete.amount;
          if (summary[year][month].income < 0) summary[year][month].income = 0;
        } else {
          summary[year][month].expense -= txnToDelete.amount;
          if (summary[year][month].expense < 0) summary[year][month].expense = 0;
        }

        await AsyncStorage.setItem("monthlySummary", JSON.stringify(summary));
      }

      hideDialog();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };



  return (
    <View style={styles.container}>
      {cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.heading}>No cards yet</Text>
          <Text style={styles.subText}>Tap + to create one!</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: height / 2 - CARD_HEIGHT * 1.5,
            paddingBottom: height / 2 - CARD_HEIGHT,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <CardItem
              item={item}
              index={index}
              scrollY={scrollY}
              navigation={navigation}
              allTransactions={transactions}
              onLongPressCard={() => showDialog(item.id)}
            />
          )}
          ListHeaderComponent={() => (
            <View
              style={{
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 130,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                Manage all your cards here
              </Text>
            </View>
          )}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          decelerationRate="fast"
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("PlusMoreCard")}
        variant="tertiary"
        mode="flat"
        color={theme.dark.onPrimaryContainer}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Delete Card?</Dialog.Title>
          <Dialog.Content>
            <Text>This will delete the card and its transactions. Are you sure?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleConfirmDelete} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    fab: {
      backgroundColor: theme.dark.primaryContainer,
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
    container: {
      flex: 1,
    },
    card: {
      height: CARD_HEIGHT,
      marginBottom: SPACING,
      marginHorizontal: 20,
      borderRadius: 20,
      backgroundColor: "#1f1f1f",
      padding: 20,
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    type: {
      color: "#ccc",
      fontSize: 16,
      fontWeight: "bold",
    },
    number: {
      color: "#fff",
      fontSize: 22,
      letterSpacing: 2,
      marginVertical: 10,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      color: "#888",
      fontSize: 12,
    },
    value: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    logo: {
      width: 50,
      height: 30,
    },

    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    heading: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 5,
    },
    highlight: {
      color: theme.dark.primary,
    },
    subText: {
      textAlign: "center",
      marginTop: 10,
      marginBottom: 20,
      fontSize: 14,
      opacity: 0.7,
    },
  });
