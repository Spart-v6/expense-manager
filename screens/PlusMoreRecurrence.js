import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Portal, TextInput, Text, Dialog, Button } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BouncyCheckboxGroup from "react-native-bouncy-checkbox-group";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import Chip from "../components/Chip";
import { IconComponent } from "../components/IconPickerModal";
import { useSelector } from "react-redux";
import React, { useState, useRef } from "react";

const obj = [{ name: "Subscriptions" }, { name: "Income" }, { name: "Rent" }];

const datesObj = [
  { id: 0, text: "Daily" },
  { id: 1, text: "Weekly" },
  { id: 2, text: "Monthly" },
  { id: 3, text: "Yearly" },
];

const styles = StyleSheet.create({
  commonStyles: {
    gap: 20,
    marginTop: 20,
  },
  commonTouchableStyle: {
    marginRight: 20,
  },
  moreCardStyle: {
    padding: 20,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: allColors.backgroundColorLessPrimary,
    height: 100,
    width: 125,
  },
  highlightedCardStyle: {
    backgroundColor: allColors.backgroundColorSecondary,
    color: allColors.textColorPrimary,
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

const PlusMoreRecurrence = ({ navigation }) => {
  const [selectedCardInExpense, setSelectedCardInExpense] = useState(null);

  const [isDeleteBtnPressed, setIsDeleteBtnPressed] = useState(false);
  const [clickedIndex, setClickedIndex] = React.useState(null);
  const [needRepeat, setNeedRepeat] = React.useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [addNewRecurrenceName, setAddNewRecurrenceName] = useState("");
  const [openNewRecurrence, setOpenNewRecurrence] = useState(false);

  const [recName, setRecName] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

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

  const cardsData = useSelector((state) => state.cardReducer.allCards);

  const handleChipPress = (index) => {
    setClickedIndex(index);
  };

  const handlePress = (e) => {
    setSelectedCardInExpense(e.paymentNetwork);
  };

  const commonText = (name, setter, placeholder) => (
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
      keyboardType={placeholder === "Amount" ? "phone-pad" : "default"}
    />
  );

  const dateInput = (title) => (
    <View style={{ flexDirection: "column", flex: 0.5, justifyContent: "center" }}>
      <Text variant="titleSmall" style={{ marginTop: 10 }}>
        Starting Date
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          ...styles.monthAndYearInput,
        }}
      >
        <TextInput
          style={{ backgroundColor: "transparent" }}
          contentStyle={{ paddingLeft: 12, paddingRight: 12 }}
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
        <Text
          variant="headlineLarge"
          style={{ color: allColors.textColorTertiary }}
        >
          /
        </Text>
        <TextInput
          style={{ backgroundColor: "transparent" }}
          contentStyle={{ paddingLeft: 12, paddingRight: 12 }}
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
        <Text
          variant="headlineLarge"
          style={{ color: allColors.textColorTertiary }}
        >
          /
        </Text>
        <TextInput
          style={{ backgroundColor: "transparent" }}
          contentStyle={{ paddingLeft: 12, paddingRight: 12 }}
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
    </View>
  );

  /*Recurrence Name: 
AMOUNT!
Recurrence Type: Subscriptions / rent / income
Payment Type: Gpay, paytm etc. (cards)
Payment interval: day, week, month, year, custom
Start date, frequency and end date (optional)
checkbox for repeateance 


*/
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add Recurrence Payments"
        navigation={navigation}
        isPlus={true}
        isDeletePressed={(val) => setIsDeleteBtnPressed(val)}
      />
      <View style={{ margin: 20, gap: 10, flex: 1 }}>
        {commonText(recName, setRecName, "Recurrence Name")}
        {commonText(amount, setAmount, "Amount")}
        <View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            {dateInput()}
            {dateInput()}
            {/* Repeat button */}
            <View style={{ flexDirection: "column", gap: 20, justifyContent:"center", alignItems:"center" }}>
              <Text
                variant="titleSmall"
                style={{ color: "white" }}
              >
                Repeat
              </Text>
              <BouncyCheckbox
                onPress={() => setNeedRepeat(true)}
                fillColor={allColors.textColorPrimary}
                innerIconStyle={{ borderRadius: 0, borderColor: "grey" }}
                iconStyle={{ borderRadius: 0 }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text variant="titleSmall">Frequency</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <BouncyCheckboxGroup
                data={datesObj.map((item) => ({
                  id: item.id.toString(),
                  text: item.text,
                  style: { marginRight: 15 },
                }))}
                checkboxProps={{
                  textStyle: { textDecorationLine: "none" },
                  textContainerStyle: { marginLeft: 5 },
                  innerIconStyle: { borderColor: "grey" },
                  fillColor: allColors.textColorPrimary,
                }}
                onChange={setSelectedFrequency}
              />
            </View>
          </View>
        </View>

        {/* Recurrence type scroll */}
        <View>
          <Text variant="titleSmall" style={{ marginTop: 10 }}>
            Recurrence Type
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setOpenNewRecurrence(true)}
              style={{
                backgroundColor: allColors.backgroundColorLessPrimary,
                borderRadius: 6,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-start",
                flexDirection: "row",
                padding: 10,
                gap: 8,
                marginRight: 10,
              }}
            >
              <IconComponent
                name={"plus-circle"}
                category={"Feather"}
                size={20}
              />
              <Text>Add new</Text>
            </TouchableOpacity>
            {obj.length > 0 &&
              obj.map((item, index) => (
                <Chip
                  index={index}
                  onPress={handleChipPress}
                  isClicked={clickedIndex === index}
                  text={item.name}
                />
              ))}
          </ScrollView>
        </View>

        {/* Payment network cards */}
        <View style={{ ...styles.commonStyles, height: 150 }}>
          <Text>Payment network</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.commonTouchableStyle}
              onPress={() => navigation.navigate("PlusMoreAccount")}
              activeOpacity={0.5}
            >
              <View style={styles.moreCardStyle}>
                <IconComponent
                  name={"plus-circle"}
                  category={"Feather"}
                  size={20}
                />
                <Text
                  variant="bodyLarge"
                  style={{ color: allColors.textColorFive }}
                >
                  Add new
                </Text>
              </View>
            </TouchableOpacity>
            {cardsData?.length !== 0 &&
              cardsData
                ?.filter((item) => item?.paymentNetwork)
                .map((e, index) => (
                  <TouchableOpacity
                    style={styles.commonTouchableStyle}
                    activeOpacity={0.5}
                    onPress={() => handlePress(e)}
                    key={index}
                  >
                    <View
                      style={[
                        styles.moreCardStyle,
                        selectedCardInExpense === e.paymentNetwork && {
                          ...styles.moreCardStyle,
                          ...styles.highlightedCardStyle,
                        },
                      ]}
                    >
                      <Text style={{ color: allColors.textColorFive }}>
                        {e.paymentNetwork}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>

        {/* Add button */}
        <View style={{ flexDirection: "column-reverse", flex: 1 }}>
          <Button
            onPress={() => {}}
            mode="contained"
            labelStyle={{ fontSize: 15 }}
            textColor={"black"}
            style={{
              borderColor: "transparent",
              backgroundColor: allColors.backgroundColorLessPrimary,
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            }}
          >
            <Text
              style={{
                color: allColors.textColorPrimary,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Add
            </Text>
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog
          visible={openNewRecurrence}
          dismissable
          onDismiss={() => setOpenNewRecurrence(false)}
          style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
        >
          <Dialog.Title>Add new Recurrence name</Dialog.Title>
          <Dialog.Content>
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
              value={addNewRecurrenceName}
              placeholder={""}
              onChangeText={(val) => setAddNewRecurrenceName(val)}
              keyboardType={"default"}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setOpenNewRecurrence(false)}
              contentStyle={{ width: 60 }}
            >
              <Text style={{ color: allColors.textColorSecondary }}>
                Cancel
              </Text>
            </Button>
            <Button
              onPress={() => setOpenNewRecurrence(false)}
              contentStyle={{ width: 60 }}
            >
              <Text style={{ color: allColors.textColorPrimary }}>Okay</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default PlusMoreRecurrence;
