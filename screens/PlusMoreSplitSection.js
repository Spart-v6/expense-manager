import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import allColors from "../commons/allColors";
import AppHeader from "../components/AppHeader";
import { useDispatch } from "react-redux";
import { addSections } from "../redux/actions";
import { getUsernameFromStorage } from "../helper/constants";
import SnackbarComponent from "../commons/snackbar";
import React from "react";

const PlusMoreSplitSection = ({ navigation, route }) => {
  const [username, setUsername] = React.useState(null);

  React.useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  const dispatch = useDispatch();

  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("Please fill all the fields");
  const timeoutRef = React.useRef(null);
  const [sectionName, setSectionName] = React.useState("");
  const [totalAmountSpent, setTotalAmountSpent] = React.useState(null);
  const [whoPaid, setWhoPaid] = React.useState("");
  const [divideEqually, setDivideEqually] = React.useState(false);
  const [divideByPercent, setDivideByPercent] = React.useState(false);

  const [percentageLeft, setPercentageLeft] = React.useState(100);
  const [totalAmountLeft, setTotalAmountLeft] = React.useState(0);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const [currentGroupMembers, setCurrentGroupMembers] = React.useState(
    route.params.currGrpMems
  );
  const [groupIdentity, setGroupIdentity] = React.useState(route.params.grpIdentity);

  const [amountOfEachMember, setAmountOfEachMember] = React.useState({});
  // Setting isChecked true initially ( all members are checked intially )
  const initialIsChecked = currentGroupMembers.reduce(
    (acc, name) => ({ ...acc, [name]: true }),
    {}
  );
  const [isChecked, setIsChecked] = React.useState(initialIsChecked);

  const handleInputChange = (name, value) => {
    // preventing > two decimals in a number
    const sanitizedValue = value.replace(".", "");
    if (sanitizedValue.includes(".")) {
      return;
    }
    setAmountOfEachMember({ ...amountOfEachMember, [name]: value });
  };
  const handleCheckboxChange = (name, value) => {
    setIsChecked({ ...isChecked, [name]: value });
  };

  // #region dividing equally + by percent and re-initalzing to it's inital value
  const handleDivideAmount = () => {
    const checkedMembers = Object.keys(isChecked).filter(
      (name) => isChecked[name]
    );
    const numberOfCheckedMembers = checkedMembers.length;

    if (numberOfCheckedMembers > 0) {
      const amountPerMember = (
        totalAmountSpent / numberOfCheckedMembers
      ).toFixed(2);
      const newAmountOfEachMember = checkedMembers.reduce(
        (acc, name) => ({ ...acc, [name]: amountPerMember.toString() }),
        {}
      );
      setAmountOfEachMember(newAmountOfEachMember);
    }
  };

  React.useEffect(() => {
    if (divideEqually) handleDivideAmount();
  }, [totalAmountSpent, divideEqually, isChecked]);

  // checking if divideEqually is set to false, (so that if it was true then already there was some value of amount, so it's better to re-initialize it with empty string, else user has to backspace every member's value)

  React.useEffect(() => {
    if (!divideEqually) setAmountOfEachMember({});
  }, [divideEqually]);

  // checking if divideEqully is on, set dividePercent to emptyString and vice-versa
  React.useEffect(() => {
    if (divideEqually) setDivideByPercent(false);
  }, [divideEqually]);

  React.useEffect(() => {
    if (divideByPercent) setDivideEqually(false);
  }, [divideByPercent]);

  // TODO: not important- checking if u have set divide equally to true or divide by percent has some value and ur trying to enter manually then both these divides should be false

  //#endregion

  const handleDividePercent = (x) =>
    x && totalAmountSpent && ((x / 100) * totalAmountSpent).toFixed(2);

  const handleSubmit = () => {
    const helper = (values) => {
      const vals = Array.isArray(values) ? values : [values];
      return divideByPercent
        ? vals.map((val) => (val / 100) * totalAmountSpent)
        : vals.map((val) => (val / 1) * 1);
    };

    const result = currentGroupMembers
      .filter((name) => isChecked[name])
      .map((name) => {
        const percentages = helper(amountOfEachMember[name]) || [0];
        const amount = percentages
          .reduce((acc, curr) => acc + curr, 0)
          .toFixed(2);
        return {
          name,
          amount,
          isChecked: true
        };
      });
    const finalRes = result.concat({ sectionName, totalAmountSpent, whoPaid, id: Math.random() * 10, groupIdentity });

    const checkError = () => {
      if (sectionName.length === 0) { setErrorMsg("Please fill the section name"); return true; }
      if (totalAmountSpent === null || totalAmountSpent.length === 0) {setErrorMsg("Please fill total amount spent"); return true;}

      // checks for whoPaid, whoPaid really exists inn the array
      const lastObject = finalRes[finalRes.length - 1];
      const restObjects = finalRes.slice(0, finalRes.length - 1);
      const isWhoPaidValid = restObjects.some(obj => obj.name === lastObject.whoPaid);
      const doesWhoPaidReallyExists = restObjects.slice(0, restObjects.length - 1).find(obj => obj.whoPaid === whoPaid);
      if (!isWhoPaidValid && !doesWhoPaidReallyExists) {
        if (whoPaid !== "") {
          setErrorMsg("The member is not selected or it does not exist");
          return true; 
        }
      }
      const isAmountNan = restObjects.some(obj => obj.amount === "NaN")
      if (isAmountNan) {
        setErrorMsg("Please enter correct amount or percentage for the members");
        return true;
      }
      return false;
    }
    if (checkError()) {
      setError(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setError(false), 2000);
      return;
    }
    dispatch(addSections(finalRes));
    // console.log(finalRes);
    navigation.goBack();
  };

  // Calculating the left over percentage and total amount left after spending it
  React.useEffect(() => {
    if (totalAmountSpent && divideByPercent) {
      const sum = Object.values(amountOfEachMember).reduce((acc, curr) => {
        if (curr.length > 0) return acc + parseFloat(curr);
        return acc;
      }, 0);
      setPercentageLeft(100 - sum);

      // summing up x % y values
      const values = Object.values(amountOfEachMember);
      const percentages = values.map((val) => (val / 100) * totalAmountSpent);
      const sum2 = percentages.reduce((acc, curr) => acc + curr, 0);
      const result = totalAmountSpent - sum2;
      setTotalAmountLeft(result);
    }
  }, [totalAmountSpent, amountOfEachMember, divideByPercent]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title="Add a new section"
        navigation={navigation}
        isPlus={true}
      />
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

        <TextInput 
          label="Who paid (leave this empty if you have paid)"
          value={whoPaid}
          onChangeText={text => setWhoPaid(text)}
          style={{backgroundColor: 'transparent'}}
          keyboardType="default"
        />

        <Text>Select members for this section</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
            <BouncyCheckbox
              isChecked={divideByPercent}
              disableBuiltInState
              onPress={() => setDivideByPercent((prevState) => !prevState)}
              fillColor={allColors.textColorPrimary}
              innerIconStyle={{ borderRadius: 50, borderColor: "grey" }}
              iconStyle={{ borderRadius: 50 }}
              style={{ paddingLeft: 5 }}
            />
            <Text>Divide by percent</Text>
          </View>
        </View>

        {divideByPercent && (
          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 30 }}
          >
            <Text style={percentageLeft < 0 && {color: allColors.errorColor}}>{percentageLeft.toFixed(2)}% left</Text>
            <Text style={totalAmountLeft < 0 && {color: allColors.errorColor}}>{totalAmountLeft.toFixed(2)} left</Text>
          </View>
        )}

        <ScrollView style={!divideByPercent && { marginTop: 35.8 }}>
          {currentGroupMembers?.map((name, index) => (
            <View key={index} style={styles.allGrpMems}>
              <BouncyCheckbox
                isChecked={isChecked[name]}
                onPress={(isChecked) => handleCheckboxChange(name, isChecked)}
                fillColor={allColors.textColorPrimary}
                innerIconStyle={{ borderRadius: 50, borderColor: "grey" }}
                iconStyle={{ borderRadius: 50 }}
                style={{ paddingLeft: 5, flex: 0.1 }}
                disabled={username?.toLowerCase() === whoPaid.toLowerCase()}
              />
              <View style={styles.grpTexts}>
                <View style={{ flexDirection: "column" }}>
                  <Text>{name}</Text>
                  {divideByPercent && amountOfEachMember[name] && (
                    <Text variant="labelSmall">
                      {handleDividePercent(amountOfEachMember[name])}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "26%",
                  }}
                >
                  <TextInput
                    label={divideByPercent ? "Percent" : "Amount"}
                    style={{
                      backgroundColor: "transparent",
                      flex: 1,
                      height: 50,
                    }}
                    value={amountOfEachMember[name] || ""}
                    onChangeText={(value) => handleInputChange(name, value)}
                    disabled={!isChecked[name]}
                    keyboardType="number-pad"
                  />
                  {divideByPercent && <Text>%</Text>}
                </View>
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
      {error && <SnackbarComponent errorMsg={errorMsg}/>}
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
  },
});

export default PlusMoreSplitSection;
