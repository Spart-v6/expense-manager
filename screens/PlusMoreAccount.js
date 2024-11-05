import { useState, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Dimensions } from "react-native";
import { TextInput, Button, Banner, Portal } from "react-native-paper";
import React from "react";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import { useDispatch } from "react-redux";
import moment from "moment";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { addCard } from "../redux/actions";
import SnackbarComponent from "../commons/snackbar";
import Feather from "react-native-vector-icons/Feather";

const makeStyles = (allColors) =>
  StyleSheet.create({
    safeView: {
      flex: 1,
    },
    commonStyles: {
      marginLeft: 20,
      marginRight: 20,
      gap: 10,
      marginTop: 20,
    },
    wholeRadioBtnStyle: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    monthAndYearInput: {
      borderRadius: 15,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      borderColor: "black",
      borderWidth: 2,
      backgroundColor: allColors.innerTextFieldColor,
    },
    addCardBtn: {
      margin: 20,
      marginTop: 0,
    },
    bannerContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

const PlusMoreAccount = ({ navigation }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const dispatch = useDispatch();

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Please fill all the fields");
  const timeoutRef = useRef(null);

  const [btnName] = useState("Add Card");
  const [cardHolderName, setCardHolderName] = useState("");
  const [paymentNetwork, setPaymentNetwork] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [checked, setChecked] = useState("debit");

  const [debitCard, setDebitCard] = useState(true);
  const [creditCard, setCreditCard] = useState(false);

  const [isInfoPressed, setIsInfoPressed] = useState(false);

  const yearInputRef = useRef(null);

  const handleMonthChange = (text) => {
    if (text.length <= 2) {
      setMonth(text);
    }
    if (text.length === 2) {
      yearInputRef.current.focus();
    }
  };

  const handleYearChange = (text) => {
    if (text.length <= 2) {
      setYear(text);
    }
  };

  const handleDebitCardPress = () => {
    setDebitCard(true);
    setCreditCard(false);
    setChecked("debit");
  };

  const handleCreditCardPress = () => {
    setDebitCard(false);
    setCreditCard(true);
    setChecked("credit");
  };

  const textInput = (name, setter, placeholder) => {
    return (
      <TextInput
        style={{
          borderRadius: 15,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          borderColor: allColors.textColorPrimary,
          borderWidth: 2,
          backgroundColor: allColors.innerTextFieldColor,
        }}
        selectionColor={allColors.textSelectionColor}
        textColor={allColors.universalColor}
        underlineColor="transparent"
        cursorColor={allColors.universalColor}
        activeUnderlineColor="transparent"
        contentStyle={{ fontFamily: "Karla_400Regular" }}
        placeholderTextColor={allColors.placeholderTextColor}
        autoComplete="off"
        textContentType="none"
        value={name}
        placeholder={placeholder}
        onChangeText={(val) => setter(val)}
        keyboardType={"default"}
      />
    );
  };

  const handleAddOrUpdateCard = () => {
    const cardDetails = {
      id: Math.random() + 10 + Math.random(),
      cardHolderName: cardHolderName,
      paymentNetwork: paymentNetwork,
      month: month,
      year: year,
      checked,
    };

    const checkError = () => {
      if (cardHolderName.length === 0) {
        setErrorMsg("Please enter a card holder name");
        return true;
      }
      if (paymentNetwork.length === 0) {
        setErrorMsg("Please enter a payment network");
        return true;
      }
      const parsedMonth = moment(month, "M", true);
      const parsedYear = moment(year, "YY", true);
      if (year.length > 0 || month.length > 0) {
        const isValidMonth = parsedMonth.isValid() && parsedMonth.month() < 12;
        const isValidYear = parsedYear.isValid();
        if (!isValidMonth || !isValidYear) {
          setErrorMsg("Invalid month or year");
          return true;
        }
      }
      return false;
    };
    if (checkError()) {
      setError(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setError(false), 2000);
      return;
    }
    dispatch(addCard(cardDetails));
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <AppHeader
          title={btnName}
          navigation={navigation}
          isInfoPressed={(val) => setIsInfoPressed(val)}
          needInfo={true}
        />
        <View style={{ flex: 1 }}>
          <View style={{ ...styles.commonStyles, marginTop: 0 }}>
            {textInput(cardHolderName, setCardHolderName, "Cardholder name")}
          </View>

          <View style={{ ...styles.commonStyles }}>
            {textInput(
              paymentNetwork,
              setPaymentNetwork,
              "Payment network (e.g., Visa, GPay)"
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              ...styles.commonStyles,
            }}
          >
            <MyText
              variant="titleSmall"
              style={{ color: allColors.universalColor }}
            >
              Expiry Date (optional)
            </MyText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                label={
                  <MyText style={{ color: allColors.universalColor }}>
                    MM
                  </MyText>
                }
                style={{ width: 80, backgroundColor: "transparent" }}
                underlineColor={allColors.textColorPrimary}
                allowFontScaling={false}
                textColor={allColors.universalColor}
                cursorColor={allColors.universalColor}
                selectionColor={allColors.textSelectionColor}
                activeUnderlineColor={allColors.textColorPrimary}
                contentStyle={{ fontFamily: "Karla_400Regular" }}
                value={month}
                onChangeText={handleMonthChange}
                keyboardType={"number-pad"}
                maxLength={2}
                autoCorrect={false}
              />
              <MyText
                variant="titleMedium"
                allowFontScaling={false}
                style={{ color: allColors.universalColor }}
              >
                /
              </MyText>
              <TextInput
                label={
                  <MyText style={{ color: allColors.universalColor }}>
                    YY
                  </MyText>
                }
                style={{ width: 80, backgroundColor: "transparent" }}
                allowFontScaling={false}
                underlineColor={allColors.textColorPrimary}
                textColor={allColors.universalColor}
                cursorColor={allColors.universalColor}
                selectionColor={allColors.textSelectionColor}
                activeUnderlineColor={allColors.textColorPrimary}
                contentStyle={{ fontFamily: "Karla_400Regular" }}
                value={year}
                ref={yearInputRef}
                onChangeText={handleYearChange}
                keyboardType={"number-pad"}
                maxLength={2}
                autoCorrect={false}
              />
            </View>
          </View>

          <View
            style={{
              ...styles.commonStyles,
              flexDirection: "row",
              marginRight: 0,
              gap: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BouncyCheckbox
                isChecked={debitCard}
                disableBuiltInState
                onPress={handleDebitCardPress}
                fillColor={allColors.addBtnColors}
                innerIconStyle={{ borderRadius: 50, borderColor: "grey" }}
                iconStyle={{ borderRadius: 50 }}
              />
              <MyText style={{ color: allColors.universalColor }}>
                Debit Card
              </MyText>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BouncyCheckbox
                isChecked={creditCard}
                disableBuiltInState
                onPress={handleCreditCardPress}
                fillColor={allColors.addBtnColors}
                innerIconStyle={{ borderRadius: 50, borderColor: "grey" }}
                iconStyle={{ borderRadius: 50 }}
              />
              <MyText style={{ color: allColors.universalColor }}>
                Credit Card
              </MyText>
            </View>
          </View>
        </View>

        <View style={styles.addCardBtn}>
          <Button
            style={{
              borderColor: "transparent",
              backgroundColor: allColors.addBtnColors,
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            }}
            mode="contained"
            labelStyle={{ fontSize: 15 }}
            onPress={handleAddOrUpdateCard}
          >
            <MyText
              style={{
                color: allColors.backgroundColorPrimary,
                fontFamily: "Karla_400Regular",
                fontSize: 18,
              }}
            >
              {btnName}
            </MyText>
          </Button>
        </View>
      </SafeAreaView>
      {error && <SnackbarComponent errorMsg={errorMsg} />}

      <Portal>
        <View style={styles.bannerContainer}>
          <Banner
            visible={isInfoPressed}
            style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
            actions={[
              {
                label: "OK",
                onPress: () => setIsInfoPressed(false),
                style: { marginRight: 20 },
                textColor: allColors.universalColor,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather
                name="info"
                size={20}
                color={allColors.textColorPrimary}
              />
              <MyText
                style={{
                  color: allColors.universalColor,
                  maxWidth: Dimensions.get("window").width / 1.2,
                }}
                numberOfLines={4}
              >
                The details you provide here are for visualization purposes only
                and are not collected in any way. Feel free to add any
                information, even if it's not accurate.
              </MyText>
            </View>
          </Banner>
        </View>
      </Portal>
    </>
  );
};

export default PlusMoreAccount;
