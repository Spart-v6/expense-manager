import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  RadioButton,
  Text,
  HelperText,
  Snackbar,
  Chip
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useThemeContext } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cardNetworks = [ 'Mastercard', 'Visa', 'RuPay', 'Amex', 'Discover', 'UnionPay' ];
const paymentTypes = [ 'GPay', 'PhonePe', 'Paytm', 'CRED', 'UPI', 'PayPal' ];

const PlusMoreCard = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();
  const styles = makeStyles(theme, colorScheme);

  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState("debit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [paymentType, setPaymentType] = useState(null);
  const [cardNetwork, setCardNetwork] = useState(null);
  
  const handlePressCardNetwork = type => {
    setCardNetwork(type);
  }
  const handlePressPaymentType = type => {
    setPaymentType(type);
  }

  const handleSave = async () => {
    if (!cardName.trim()) {
      setSnackbarMessage("All fields must be filled out");
      setSnackbarVisible(true);
      return;
    }
    if (cardNumber.length !== 4) {
      setSnackbarMessage("Please enter exactly 4 digits for card number");
      setSnackbarVisible(true);
      return;
    }
    if (cardNetwork === null) {
      setSnackbarMessage("Please select a card network");
      setSnackbarVisible(true);
      return;
    }
    if (paymentType === null) {
      setSnackbarMessage("Please select a payment type");
      setSnackbarVisible(true);
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      name: cardName,
      type: cardType,
      last4Digits: cardNumber,
      cardNetwork,
      paymentType,
      expiryDate: expiryDate.toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem("cards");
      const parsedData = existingData ? JSON.parse(existingData) : [];
      const updatedData = [newCard, ...parsedData];
      await AsyncStorage.setItem("cards", JSON.stringify(updatedData));
      navigation.goBack();
    } catch (error) {
      setSnackbarMessage("Failed to save card.");
      setSnackbarVisible(true);
      console.error("Error saving card:", error);
    }
  };


  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Only set the month and year
      const monthYearDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      setExpiryDate(monthYearDate);
    }
  };

  const hasCardNumberError = cardNumber.length > 0 && cardNumber.length !== 4;

  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TextInput
            label="Card Name"
            value={cardName}
            onChangeText={setCardName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Last 4 Digits of Card"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            maxLength={4}
            mode="outlined"
          />
          <HelperText type="error" visible={hasCardNumberError}>
            Must be exactly 4 digits
          </HelperText>
        <View style={{ flexDirection: "column", marginVertical: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Card Network
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {cardNetworks.map((type, index) => (
                <Chip mode={type === cardNetwork ? "flat" : "outlined"} key={index} onPress={() => handlePressCardNetwork(type)}>{type}</Chip>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{ flexDirection: "column", marginVertical: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Payment App
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {paymentTypes.map((type, index) => (
                <Chip mode={type === paymentType ? "flat" : "outlined"} key={index} onPress={() => handlePressPaymentType(type)}>{type}</Chip>
              ))}
            </View>
          </ScrollView>
        </View>

          <Text variant="titleMedium" style={styles.label}>
            Card Type
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setCardType(value)}
            value={cardType}
          >
            <View style={styles.radioRow}>
              <RadioButton.Item label="Debit" value="debit" position="leading" />
              <RadioButton.Item label="Credit" value="credit" position="leading" />
            </View>
          </RadioButton.Group>

          <Text variant="titleMedium" style={[styles.label, {paddingBottom: 10, marginTop: 0}]}>
            Expiry Date
          </Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            {formatMonthYear(expiryDate)}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
            />
          )}

          <View style={styles.saveButtonContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              contentStyle={styles.saveButtonContent}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}> Add Card </Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme, colorScheme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  saveButtonContainer: {
    marginTop: "auto",
    marginBottom: 20,
  },
  saveButton: {
    borderRadius: 8,
  },
  saveButtonContent: {
    paddingVertical: 10,
  },
  saveButtonText: {
    color: theme[colorScheme].onPrimary,
    fontSize: 18,
    textAlign: "center",
  },
});

export default PlusMoreCard;
