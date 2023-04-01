import { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Dialog,
  Portal,
  Card,
} from "react-native-paper";
import React from "react";
import RadioButton from "../components/RadioButton";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import Icon from "react-native-vector-icons/Entypo";

const makeStyles = () =>
  StyleSheet.create({
    safeView: {
      flex: 1,
    },
    commonStyles: {
      marginLeft: 20,
      marginRight: 20,
      gap: 20,
      marginTop: 20,
    },
    commonTouchableStyle: {
      marginRight: 20,
    },
    moreCardStyle: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "orange",
      height: 150,
      width: 150,
    },
    commonCardIconStyle: {
      backgroundColor: "red",
      borderRadius: 50,
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
  });

const PlusMoreAccount = ({ navigation }) => {
  const styles = makeStyles();
  const [cardHolderName, setCardHolderName] = useState("");
  const [paymentNetwork, setPaymentNetwork] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [checked, setChecked] = React.useState("first");
  const yearInputRef = useRef(null);

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

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

  const getCategories = () => {
    return (
      <View>
        <TouchableOpacity onPress={showDialog} activeOpacity={1}>
          <Card>
            <Card.Title
              title="Add"
              titleStyle={{ color: allColors.textColorFive }}
            />
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  const obj = [
    { name: "Google Pay" },
    { name: "VISA" },
    { name: "MasterCard" },
    { name: "MasterCard" },
    { name: "MasterCard" },
    { name: "MasterCard" },
    { name: "MasterCard" },
    { name: "MasterCard" },
    { name: "MasterCard" },
    { name: "MasterCard" },
  ];

  return (
    <SafeAreaView style={styles.safeView}>
      <AppHeader title="Add Card" navigation={navigation} />
      <View style={{ ...styles.commonStyles, marginTop: 0 }}>
        {textInput(cardHolderName, setCardHolderName, "Cardholder Name")}
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
      </View>

      <View style={{ ...styles.commonStyles, height: 150 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.commonTouchableStyle}>
            <View style={styles.moreCardStyle}>
              <Icon
                name={"plus"}
                color={"white"}
                size={30}
                style={styles.commonCardIconStyle}
              />
              <Text style={{ padding: 20 }} variant="bodyLarge">
                Add a new payment network
              </Text>
            </View>
          </TouchableOpacity>
          {obj.length !== 0 &&
            obj.map((e) => (
              <TouchableOpacity style={styles.commonTouchableStyle}>
                <View style={styles.moreCardStyle}>
                  <Text style={{ padding: 20 }}> {e.name} </Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <View
        style={{ ...styles.commonStyles, flexDirection: "row", marginRight: 0 }}
      >
        <TouchableOpacity
          style={styles.wholeRadioBtnStyle}
          onPress={() => setChecked("first")}
        >
          <RadioButton isSelected={checked === "first"} />
          <Text>Debit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wholeRadioBtnStyle}
          onPress={() => setChecked("second")}
        >
          <RadioButton isSelected={checked === "second"} />
          <Text>Credit Card</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Button style={{ backgroundColor: "red" }}>Add Card</Button>
      </View>

      {/* Portal.. Select category like Office, Home */}
      <View>
        {/* <Button onPress={showDialog}>Show Dialog</Button> */}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} dismissable={false}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">This is simple dialog</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
};

export default PlusMoreAccount;
