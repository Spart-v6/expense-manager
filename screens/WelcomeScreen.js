import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Text, Button } from "react-native-paper";
import React from "react";
import allColors from "../commons/allColors";
import { IconComponent } from "../components/IconPickerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const currencyObj = [
  {
    id: 1,
    name: "United States Dollar (USD)",
    curr: "$",
    iconName: "dollar",
    iconType: "FontAwesome",
  },
  { id: 2, name: "Euro (EUR)", iconName: "euro", iconType: "FontAwesome" },
  {
    id: 3,
    name: "British Pound Sterling (GBP)",
    curr: "£",
    iconName: "pound-sign",
    iconType: "FontAwesome5",
  },
  {
    id: 5,
    name: "Japanese Yen (JPY)",
    curr: "¥",
    iconName: "yen",
    iconType: "FontAwesome",
  },
  {
    id: 6,
    name: "Indian Rupee (INR)",
    curr: "₹",
    iconName: "rupee-sign",
    iconType: "FontAwesome5",
  },
  {
    id: 7,
    name: "South Korean Won (KRW)",
    curr: "₩",
    iconName: "won",
    iconType: "FontAwesome",
  },
  {
    id: 8,
    name: "Russian Ruble (RUB)",
    curr: "₽",
    iconName: "ruble",
    iconType: "FontAwesome",
  },
  {
    id: 9,
    name: "Turkish Lira (TRY)",
    curr: "₺",
    iconName: "turkish-lira",
    iconType: "FontAwesome",
  },
  {
    id: 10,
    name: "Ukrainian Hryvnia (UAH)",
    curr: "₴",
    iconName: "hryvnia",
    iconType: "FontAwesome5",
  },
];

const WelcomeScreen = ({ navigation }) => {
  const [clickedCurrency, setClickedCurrency] = React.useState({
    name: currencyObj[0].name,
    id: currencyObj[0].id,
    curr: currencyObj[0].curr,
    iconName: currencyObj[0].iconName,
    iconType: currencyObj[0].iconType,
  });
  const [isCurrencyClicked, setIsCurrencyClicked] = React.useState({
    name: currencyObj[0].name,
    id: currencyObj[0].id,
    curr: currencyObj[0].curr,
    iconName: currencyObj[0].iconName,
    iconType: currencyObj[0].iconType,
  });

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem("currency", JSON.stringify(clickedCurrency));
      await AsyncStorage.setItem("hasSeenWelcomeScreen", "true");
      navigation.replace("HomeApp");
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
    }
  };

  const handleItemClick = (item) => {
    setClickedCurrency({
      name: item.name,
      id: item.id,
      curr: item.curr,
      iconName: item.iconName,
      iconType: item.iconType,
    });
    setIsCurrencyClicked({
      name: item.name,
      id: item.id,
      curr: item.curr,
      iconName: item.iconName,
      iconType: item.iconType,
    });
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        {
          borderRadius: 20,
        },
        isCurrencyClicked.id === item.id && {
          backgroundColor: allColors.textColorSecondary,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => handleItemClick(item)}
        activeOpacity={0.9}
      >
        <View style={styles.item}>
          <View style={{ marginLeft: 20, gap: 10 }}>
            <IconComponent
              name={item.iconName}
              category={item.iconType}
              size={40}
            />
            <Text variant="titleMedium">{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        marginTop: 80,
        marginBottom: 40,
        marginLeft: 20,
        marginRight: 20,
      }}
    >
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
        <SimpleLineIcons
          name="globe-alt"
          size={100}
          color={allColors.textColorPrimary}
          style={{ alignSelf: "center" }}
        />
        <Text variant="displaySmall">Select currency</Text>
      </View>

      <View style={{ marginTop: 20, gap: 40 }}>
        <FlatList
          scrollEnabled={true}
          data={currencyObj}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.containerStyle}
        />

        <Button
          onPress={handleContinue}
          mode="contained"
          labelStyle={{ fontSize: 15 }}
          textColor={"black"}
          style={{
            borderColor: "transparent",
            backgroundColor: allColors.backgroundColorLessPrimary,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            width: 200,
            alignSelf: "flex-end",
          }}
        >
          <Text
            style={{
              color: allColors.textColorPrimary,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Continue
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  item: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    height: 120,
    width: 170,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: allColors.textColorFour,
  },
});

export default WelcomeScreen;
