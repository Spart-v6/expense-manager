import { useState, useRef, useEffect, useMemo } from "react";
import { View, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import React from "react";
import RadioButton from "../components/RadioButton";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import { useDispatch } from "react-redux";
import moment from "moment";
import { addCard, updateCard } from "../redux/actions";
import SnackbarComponent from "../commons/snackbar";

const makeStyles = () =>
  StyleSheet.create({
    safeView: {
      flex: 1
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
      backgroundColor: allColors.backgroundColorQuinary,
    },
    addCardBtn: {
      margin: 20, marginTop: 0
    },
  });

const PlusMoreAccount = ({ navigation, route }) => {
  const styles = makeStyles();
  const dispatch = useDispatch();

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Please fill all the fields");
  const timeoutRef = useRef(null);

  const [isUpdateCardPressed, setIsUpdateCardPressed] = useState(false);
  const [valuesToChangeInCard, setValuesToChangeInCard] = useState({});
  const [btnName] = useState(() => {
    if(route.params) return "Update Card";
    return "Add Card";
  });
  const [cardHolderName, setCardHolderName] = useState(() => {
    if(route.params) return route.params.updateCard.cardHolderName;
    return "";
  });
  const [paymentNetwork, setPaymentNetwork] = useState(() => {
    if(route.params) return route.params.updateCard.paymentNetwork;
    return "";
  });
  const [month, setMonth] = useState(() => {
    if(route.params) return route.params.updateCard.month;
    return "";
  });
  const [year, setYear] = useState(() => {
    if(route.params) return route.params.updateCard.year;
    return "";
  });
  const [checked, setChecked] = useState(() => {
    if(route.params) return route.params.updateCard.checked;
    return "debit";
  });

  const memoizedCardObj = useMemo(
    () => route?.params?.updateCard,
    [route?.params?.updateCard]
  );

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

  const textInput = (name, setter, placeholder) => {
    return (
      <TextInput
        style={{
          borderRadius: 15,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          borderColor: "black",
          borderWidth: 2,
          backgroundColor: allColors.backgroundColorQuinary
        }}
        selectionColor={allColors.textColorFour}
        textColor={allColors.textColorFour}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        placeholderTextColor={allColors.textColorFour}
        autoComplete="off"
        textContentType="none"
        value={name}
        placeholder={placeholder}
        onChangeText={(val) => setter(val)}
        keyboardType={"default"}
      />
    );
  };

  useEffect(() => {
    if (route.params) {
      setValuesToChangeInCard(memoizedCardObj);
      setIsUpdateCardPressed(true);
    }
  }, [memoizedCardObj]);

  const handleAddOrUpdateCard = () => {
    const cardDetails = {
      id: Math.random() + 10 + Math.random(),
      cardHolderName: cardHolderName,
      paymentNetwork: paymentNetwork,
      month: month,
      year: year,
      checked
    };
    const updatedCardDetails = {
      cardHolderName: cardHolderName,
      paymentNetwork: paymentNetwork,
      month: month,
      year: year,
      checked
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
      const parsedMonth = moment(month, 'M', true);
      const parsedYear = moment(year, 'YY', true);
      if (year.length > 0 || month.length > 0) {
        const isValidMonth = parsedMonth.isValid() && parsedMonth.month() < 12;
        const isValidYear = parsedYear.isValid();
        if (!isValidMonth || !isValidYear) {
          setErrorMsg("Invalid month or year");
          return true;
        }
      }
      return false;
    }
    if (checkError()) {
      setError(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setError(false), 2000);
      return;
    }


    if(route.params) dispatch(updateCard(valuesToChangeInCard.id, updatedCardDetails));
    else dispatch(addCard(cardDetails));
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <AppHeader title={btnName} navigation={navigation} />
        <View style={{flex: 1}}>
          <View style={{ ...styles.commonStyles, marginTop: 0 }}>
            {textInput(cardHolderName, setCardHolderName, "Cardholder name")}
          </View>

          <View style={{ ...styles.commonStyles }}>
            <TextInput
              style={{
                borderRadius: 15,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                backgroundColor: allColors.backgroundColorQuinary,
              }}
              selectionColor={allColors.textColorFour}
              textColor={allColors.textColorFour}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholderTextColor={allColors.textColorFour}
              autoComplete="off"
              textContentType="none"
              value={paymentNetwork}
              placeholder={"Payment network like VISA, Google Pay"}
              onChangeText={(val) => setPaymentNetwork(val)}
              keyboardType={"default"}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              ...styles.commonStyles,
            }}
          >
            <Text variant="titleSmall">
              Expiry Date (optional)
            </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "30%",
                  ...styles.monthAndYearInput,
                }}
              >
                <TextInput
                  style={{ backgroundColor: "transparent" }}
                  contentStyle={{ paddingLeft: 14, paddingRight: 14 }}
                  selectionColor={allColors.textColorFour}
                  textColor={allColors.textColorFour}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  placeholder="MM"
                  placeholderTextColor={allColors.textColorFour}
                  value={month}
                  onChangeText={handleMonthChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text
                  variant="headlineSmall"
                  style={{ color: allColors.textColorFour }}
                >
                  /
                </Text>
                <TextInput
                  style={{ backgroundColor: "transparent" }}
                  contentStyle={{ paddingLeft: 14, paddingRight: 14 }}
                  selectionColor={allColors.textColorFour}
                  textColor={allColors.textColorFour}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  placeholder="YY"
                  placeholderTextColor={allColors.textColorFour}
                  ref={yearInputRef}
                  value={year}
                  onChangeText={handleYearChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
          </View>
 
          <View
            style={{
              ...styles.commonStyles,
              flexDirection: "row",
              marginRight: 0,
            }}
          >
            <TouchableOpacity
              style={styles.wholeRadioBtnStyle}
              onPress={() => setChecked("debit")}
              activeOpacity={1}
            >
              <RadioButton
                isSelected={checked === "debit"}
                onPress={() => setChecked("debit")}
              />
              <Text>Debit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wholeRadioBtnStyle}
              onPress={() => setChecked("credit")}
              activeOpacity={1}
            >
              <RadioButton
                isSelected={checked === "credit"}
                onPress={() => setChecked("credit")}
              />
              <Text>Credit Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addCardBtn}>
          <Button
            style={{
              borderColor: "transparent",
              backgroundColor: allColors.backgroundColorLessPrimary,
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15
            }}
            onPress={handleAddOrUpdateCard}
          >
            <Text
              style={{
                color: allColors.textColorPrimary,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {btnName}
            </Text>
          </Button>
        </View>
      </SafeAreaView>
      {error && <SnackbarComponent errorMsg={errorMsg}/>}
    </>
  );
};

export default PlusMoreAccount;
