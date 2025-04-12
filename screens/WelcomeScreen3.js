import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { IconComponent } from "../components/IconPicker";

const currencyObj = [
  { id: 1, name: "Indian Rupee (INR)", iconName: "rupee-sign", iconType: "FontAwesome5" },
  { id: 2, name: "Euro (EUR)", iconName: "euro", iconType: "FontAwesome" },
  { id: 3, name: "British Pound Sterling (GBP)", iconName: "pound-sign", iconType: "FontAwesome5" },
  { id: 5, name: "Japanese Yen (JPY)", iconName: "yen", iconType: "FontAwesome" },
  { id: 6, name: "United States Dollar (USD)", iconName: "dollar", iconType: "FontAwesome" },
  { id: 7, name: "South Korean Won (KRW)", iconName: "won", iconType: "FontAwesome" },
  { id: 8, name: "Russian Ruble (RUB)", iconName: "ruble", iconType: "FontAwesome" },
  { id: 9, name: "Turkish Lira (TRY)", iconName: "turkish-lira", iconType: "FontAwesome" },
  { id: 10, name: "Ukrainian Hryvnia (UAH)", iconName: "hryvnia", iconType: "FontAwesome5" },
  { id: 11, name: "Swiss Franc (CHF)", iconName: "currency-franc", iconType: "MaterialIcons" },
  { id: 12, name: "Brazilian Real (BRL)", iconName: "brazilian-real-sign", iconType: "FontAwesome6" },
  { id: 13, name: "Mexican Peso (MXN)", iconName: "peso-sign", iconType: "FontAwesome6" },
];

const WelcomeScreen3 = ({ navigation, onFinish }) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const windowWidth = Dimensions.get("window").width;
  const itemSize = (windowWidth - 60) / 2; // square box with padding

  const [selectedCurrencyId, setSelectedCurrencyId] = useState(currencyObj[0].id);

  const handleContinue = () => {
    onFinish();
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedCurrencyId;

    return (
      <TouchableOpacity
        onPress={() => setSelectedCurrencyId(item.id)}
        activeOpacity={0.9}
        style={{
          width: itemSize,
          height: itemSize,
          margin: 10,
          borderRadius: 20,
          borderWidth: isSelected ? 5 : 1,
          borderColor: isSelected ? theme.dark.primary : theme.dark.tertiaryContainer,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ padding: 10, gap: 10, alignItems: "center" }}>
          <IconComponent
            name={item.iconName}
            category={item.iconType}
            size={40}
            color={theme.dark.primaryContainer}
          />
          <Text
            variant="titleMedium"
            style={{ textAlign: "center", padding: 10 }}
            allowFontScaling={false}
            ellipsizeMode="tail"
            numberOfLines={3}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LottieView
          source={require("../assets/coin.json")}
          autoPlay
          loop={false}
          style={{ width: 250, height: 250, marginBottom: 0, marginTop: 30 }}
          colorFilters={[
            { keypath: "C- 4", color: theme.dark.secondary },
            { keypath: "C- 2", color: theme.dark.secondary },
            { keypath: "Pou", color: theme.dark.secondary },
            { keypath: "Yen 3", color: theme.dark.secondary },
            { keypath: "Yen 2", color: theme.dark.secondary },
            { keypath: "Dollar", color: theme.dark.secondary },
            { keypath: "Half 4", color: theme.dark.primary },
            { keypath: "Half 6", color: theme.dark.primary },
            { keypath: "Half 5", color: theme.dark.primary },
            { keypath: "Half 2", color: theme.dark.primary },
            { keypath: "Half 3", color: theme.dark.primary },
            { keypath: "Half", color: theme.dark.primary },
            { keypath: "Circle 3", color: theme.dark.tertiaryContainer },
            { keypath: "Circle 2", color: theme.dark.tertiaryContainer },
            { keypath: "Circle", color: theme.dark.tertiaryContainer },
          ]}
        />
        <Text style={{ fontWeight: "bold", marginBottom: 10 }} variant="headlineLarge">
          Select currency
        </Text>
        <FlatList
          data={currencyObj}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingBottom: 20,
          paddingRight: 30,
        }}
      >
        <Button mode="contained" onPress={handleContinue}>
          Let's go
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen3;
