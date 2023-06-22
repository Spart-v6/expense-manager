import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView
} from "react-native";
import { Text, Button } from "react-native-paper";
import React from "react";
import useDynamicColors from "../commons/useDynamicColors";
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

const WelcomeScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const windowWidth = Dimensions.get('window').width;

  const [clickedCurrency, setClickedCurrency] = React.useState({
    name: currencyObj[0].name,
    id: currencyObj[0].id,
    curr: currencyObj[0].curr,
    iconName: currencyObj[0].iconName,
    iconType: currencyObj[0].iconType,
  });
  const [isCurrencyClicked, setIsCurrencyClicked] = React.useState(() => {
    if(route.params) {
      return {
        name: route.params.updatedCurr.name,
        id: route.params.updatedCurr.id,
        curr: route.params.updatedCurr.curr,
        iconName: route.params.updatedCurr.iconName,
        iconType: route.params.updatedCurr.iconType,
      };
    }
    return {
      name: currencyObj[0].name,
      id: currencyObj[0].id,
      curr: currencyObj[0].curr,
      iconName: currencyObj[0].iconName,
      iconType: currencyObj[0].iconType,
    };
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

  const renderItem = ({ item }) => {
    const itemWidth = (windowWidth - 60) / 2;
    return (
      <View
        style={[
          {
            width: itemWidth,
            borderRadius: 26,
            marginBottom: 20, 
          },
          isCurrencyClicked.id === item.id && {
            backgroundColor: allColors.addBtnColors,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => handleItemClick(item)}
          activeOpacity={0.9}
          style={{ flex: 1 }}
        >
          <View style={styles.item}>
            <View style={{ paddingLeft: 15, paddingRight: 15, gap: 10 }}>
              <IconComponent
                name={item.iconName}
                category={item.iconType}
                size={20}
                color={allColors.addBtnColors}
              />
              <Text variant="titleMedium" style={{ color: allColors.universalColor, maxWidth:  Dimensions.get("window").width / 2 }} allowFontScaling={false} ellipsizeMode="tail" numberOfLines={3}>{item.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        marginTop: 80,
        marginBottom: 40,
        marginLeft: 10,
        marginRight: 20,
        flex: 1,
      }}
    >
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
        <SimpleLineIcons
          name="globe-alt"
          size={100}
          color={allColors.textColorPrimary}
          style={{ alignSelf: "center" }}
        />
        <Text variant="displaySmall" style={{color: allColors.universalColor,  maxWidth: Dimensions.get("window").width / 2}}>
          Select currency
        </Text>
      </View>

      <ScrollView style={{ flex: 1, marginTop: 10 }}>
        <FlatList
          scrollEnabled={false} 
          data={currencyObj}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            justifyContent: 'space-between',
          }}
          />
      </ScrollView>
      
      <View style={{ flex : 0.1, justifyContent: 'center', alignItems :'flex-end' }}>
        <Button
          onPress={handleContinue}
          mode="contained"
          textColor={"black"}
          style={{
            borderColor: "transparent",
            backgroundColor: allColors.addBtnColors,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            width: 200,
          }}
        >
          <Text
            style={{
              color: allColors.backgroundColorPrimary,
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

const makeStyles = allColors => StyleSheet.create({
  item: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    height: 120,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: allColors.backgroundColorLessPrimary,
  },
});

export default WelcomeScreen;
