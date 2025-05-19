import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  useColorScheme,
  Pressable,
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
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { FAB } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from 'date-fns';
import { useFocusEffect } from "@react-navigation/native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.25;
const SPACING = 10;

const CardItem = ({ item, index, scrollY, navigation, allTransactions }) => {
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
    navigation.navigate("IndividualCardScreen", {
      title: "HDFC", // IMP: change this dynamically (this is required *)
      cardName: "Visa",
      last4: "3534",
      expiryDate: "29/4",
      transactions: simplifiedTransactions,
    });
  };

  const formattedExpiryDate = format(parseISO(item.expiryDate), "MM-yy");

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.card, animatedStyle]}
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

  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchCards = async () => {
        try {
          const data = await AsyncStorage.getItem("cards");
          const parsedData = data ? JSON.parse(data) : [];
          setCards(parsedData);
        } catch (error) {
          console.error("Failed to load cards:", error);
        }
      };

      fetchCards();
    }, [])
  );

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await AsyncStorage.getItem("transactions");
        const parsed = data ? JSON.parse(data) : [];
        setTransactions(parsed);
      } catch (error) {
        console.error("Failed to load transactions", error);
      }
    };
    loadTransactions();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
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
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("PlusMoreCard")}
        variant="tertiary"
        mode="flat"
        color={theme.dark.onPrimaryContainer}
      />
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
  });
