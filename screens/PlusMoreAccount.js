import { useState, useRef } from "react";
import { View, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import React from "react";
import RadioButton from "../components/RadioButton";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import { useDispatch } from "react-redux";
import { addCard } from "../redux/actions";

const makeStyles = () =>
  StyleSheet.create({
    safeView: {
      flex: 1,
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
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
  });

const PlusMoreAccount = ({ navigation }) => {
  const styles = makeStyles();
  const dispatch = useDispatch();
  const [cardHolderName, setCardHolderName] = useState("");
  const [paymentNetwork, setPaymentNetwork] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [checked, setChecked] = useState("debit");

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
          backgroundColor: allColors.backgroundColorQuinary,
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

  const handleAddOrUpdateCard = () => {
    const cardDetails = {
      id: Math.random() + 10 + Math.random(),
      cardHolderName: cardHolderName,
      paymentNetwork: paymentNetwork,
      month: month,
      year: year,
      checked
    };
    dispatch(addCard(cardDetails));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeView}>
        <AppHeader title="Add Card" navigation={navigation} />
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
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            ...styles.commonStyles,
          }}
        >
          <TextInput
            style={styles.monthAndYearInput}
            selectionColor={allColors.textColorFour}
            textColor={allColors.textColorFour}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholderTextColor={allColors.textColorFour}
            placeholder="MM"
            value={month}
            onChangeText={handleMonthChange}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text variant="headlineLarge">/</Text>
          <TextInput
            style={styles.monthAndYearInput}
            selectionColor={allColors.textColorFour}
            textColor={allColors.textColorFour}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholderTextColor={allColors.textColorFour}
            ref={yearInputRef}
            placeholder="YY"
            value={year}
            onChangeText={handleYearChange}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text>(Optional)</Text>
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

        <View style={styles.addCardBtn}>
          <Button
            style={{
              borderColor: "transparent",
              backgroundColor: allColors.backgroundColorLessPrimary,
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              margin: 10,
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
              Add Card
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PlusMoreAccount;
