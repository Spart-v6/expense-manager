import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import allColors from "../commons/allColors";
import AppHeader from "../components/AppHeader";
import React from "react";

const PlusMoreSplitSection = ({ navigation, route }) => {
  const [sectionName, setSectionName] = React.useState("");
  const [totalAmountSpent, setTotalAmountSpent] = React.useState(null);
  const [divideEqually, setDivideEqually] = React.useState(false);
  const [divideByPercent, setDivideByPercent] = React.useState("");

  const [currentGroupMembers, setCurrentGroupMembers] = React.useState(
    route.params.currGrpMems
  );

  const [amountOfEachMember, setAmountOfEachMember] = React.useState({});
  // Setting isChecked true initially ( all members are checked intially )
  const initialIsChecked = currentGroupMembers.reduce(
    (acc, name) => ({ ...acc, [name]: true }),
    {}
  );
  const [isChecked, setIsChecked] = React.useState(initialIsChecked);

  const handleInputChange = (name, value) => {
    setAmountOfEachMember({ ...amountOfEachMember, [name]: value });
  };
  const handleCheckboxChange = (name, value) => {
    setIsChecked({ ...isChecked, [name]: value });
  };
  

  // #region dividing equally + by percent and re-initalzing to it's inital value
  const handleDivideAmount = isEqual => {
    const checkedMembers = Object.keys(isChecked).filter((name) => isChecked[name]);
    const numberOfCheckedMembers = checkedMembers.length;

    if (numberOfCheckedMembers > 0) {
      const convertedDecimalValue = parseFloat(divideByPercent) / 100;
      const totalAmountToDivide = totalAmountSpent * convertedDecimalValue;
      const amountToBeDivideByPercent = totalAmountSpent - totalAmountToDivide;

      let amountPerMember = 0;

      if (!isEqual) amountPerMember = (amountToBeDivideByPercent / numberOfCheckedMembers).toFixed(2);
      else amountPerMember = (totalAmountSpent / numberOfCheckedMembers).toFixed(2); 

      const newAmountOfEachMember = checkedMembers.reduce((acc, name) => ({ ...acc, [name]: amountPerMember.toString() }), {});
      setAmountOfEachMember(newAmountOfEachMember);
    }
  };

  React.useEffect(() => {
    if(divideByPercent || divideEqually) handleDivideAmount(divideEqually);
  }, [totalAmountSpent, divideEqually, divideByPercent])


  // checking if divideEqually is set to false, (so that if it was true then already there was some value of amount, so it's better to re-initialize it with empty string, else user has to backspace every member's value)

  React.useEffect(() => {
    if (!divideEqually) setAmountOfEachMember({});
  }, [divideEqually]);


  // checking if divideEqully is on, set dividePercent to emptyString and vice-versa
  React.useEffect(() => {
    if (divideEqually) {
      setDivideByPercent("");
    }
  }, [divideEqually]);
  
  React.useEffect(() => {
    if (divideByPercent.length > 0) {
      setDivideEqually(false);
    }
  }, [divideByPercent]);

  // TODO: not important- checking if u have set divide equally to true or divide by percent has some value and ur trying to enter manually then both these divides should be false

  //#endregion

  const handleSubmit = () => {
    const result = currentGroupMembers
      .filter((name) => isChecked[name])
      .map((name) => ({
        name,
        amount: amountOfEachMember[name] || 0,
        isChecked: true,
      }));
    // console.log(result);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title="Add a new section" navigation={navigation} isPlus={true} />
      <View style={{ marginLeft: 20, marginRight: 20, gap: 20, flex: 1 }}>
        <TextInput
          label="Section name"
          style={{ backgroundColor: "transparent" }}
          value={sectionName}
          onChangeText={(text) => setSectionName(text)}
        />
        <TextInput
          label="Total amount spent"
          style={{ backgroundColor: "transparent" }}
          value={totalAmountSpent}
          onChangeText={(text) => setTotalAmountSpent(text)}
          keyboardType="number-pad"
          autoCorrect={false}
        />
        <Text>Select members for this section</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BouncyCheckbox
              isChecked={divideEqually}
              disableBuiltInState
              onPress={() => setDivideEqually((prevState) => !prevState)}
              fillColor={allColors.textColorPrimary}
              innerIconStyle={{ borderRadius: 50, borderColor: "grey" }}
              iconStyle={{ borderRadius: 50 }}
              style={{ paddingLeft: 5 }}
            />
            <Text>Divide Equally</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Divide by</Text>
            <TextInput
              style={{
                height: 30,
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
              activeUnderlineColor="grey"
              value={divideByPercent}
              onChangeText={(text) => setDivideByPercent(text)}
              keyboardType="number-pad"
            />
            <Text>%</Text>
          </View>
        </View>

        <ScrollView style={{ marginTop: 20 }}>
          {currentGroupMembers?.map((name, index) => (
            <View key={index} style={styles.allGrpMems}>
              <BouncyCheckbox
                isChecked={isChecked[name]}
                onPress={(isChecked) => handleCheckboxChange(name, isChecked)}
                fillColor={allColors.textColorPrimary}
                innerIconStyle={{ borderRadius: 50, borderColor: "grey" }}
                iconStyle={{ borderRadius: 50 }}
                style={{ paddingLeft: 5, flex: 0.1 }}
              />
              <View style={styles.grpTexts}>
                <Text>{name}</Text>
                <TextInput
                  label="Amount"
                  style={{
                    backgroundColor: "transparent",
                    width: "26%",
                    height: 50,
                  }}
                  value={amountOfEachMember[name] || ""}
                  onChangeText={(value) => handleInputChange(name, value)}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={{ margin: 20, marginTop: 0 }}>
        <Button
          onPress={handleSubmit}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  allGrpMems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grpTexts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default PlusMoreSplitSection;
