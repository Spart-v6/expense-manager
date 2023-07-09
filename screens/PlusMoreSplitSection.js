import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, TouchableRipple } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import useDynamicColors from "../commons/useDynamicColors";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import MyDatePicker from "../components/DatePicker";
import { IconComponent } from "../components/IconPickerModal";
import { useDispatch } from "react-redux";
import { addSections } from "../redux/actions";
import { getUsernameFromStorage } from "../helper/constants";
import SnackbarComponent from "../commons/snackbar";
import moment from "moment";
import React from "react";

const PlusMoreSplitSection = ({ navigation, route }) => {
  const allColors = useDynamicColors();
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

  // for date
  const [dateValue, setDateValue] = React.useState(moment().format("DD/MM/YYYY"));
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState(moment().format("YYYY/MM/DD"));
  const [selectedMonth, setSelectedMonth] = React.useState(moment().format("MMMM"));
  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [selectedDate, setSelectedDate] = React.useState(moment().date());

  const fetchDates = obj => {
    const { selectedDate, selectedMonth, selectedYear } = obj;
    const paddedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
    const month = moment().month(selectedMonth).format('MM');
    const formattedDate = moment(`${selectedYear}-${month}-${paddedDate}`).format('YYYY/MM/DD');
    setTempDate(formattedDate);
    setDateValue(moment(formattedDate, "YYYY/MM/DD").format("DD/MM/YYYY"));
  }

  const [currentGroupMembers, setCurrentGroupMembers] = React.useState(
    route.params.currGrpMems.sort()
  );
  const [groupIdentity, setGroupIdentity] = React.useState(route.params.grpIdentity);

  const [amountOfEachMember, setAmountOfEachMember] = React.useState({});
  // Setting isChecked true initially ( all members are checked intially )
  const initialIsChecked = currentGroupMembers.reduce(
    (acc, name) => ({ ...acc, [name]: true }),
    {}
  );
  const [isChecked, setIsChecked] = React.useState(initialIsChecked);

  const commonTextSection = (label, value, setter, keyboardType) => {
    const handleTextCheck = (val) => {
      if (keyboardType === 'number-pad') {
        val = val.replace(',', '.');
        const regex = /^\d{0,10}(\.\d{0,2})?$/;
        if (!regex.test(val)) {
          return;
        }
      }
      setter(val);
    };

    return (
      <TextInput
        label={<MyText style={{color: allColors.universalColor}}>{label}</MyText>}
        style={{ backgroundColor: "transparent" }}
        underlineColor={allColors.textColorPrimary}
        textColor={allColors.universalColor}
        selectionColor={allColors.textSelectionColor}
        placeholder={label === "Paid by" && "You paid? Leave it blank"}
        activeUnderlineColor={allColors.textColorPrimary}
        contentStyle={{fontFamily: "Rubik_400Regular"}}
        value={value}
        onChangeText={handleTextCheck}
        keyboardType={keyboardType}
        autoCorrect={false}
      />
    )
  };

  const dateTextInput = (name) => {
    return (
      <TouchableRipple
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          paddingLeft: 0,
          paddingTop: 15,
        }}
        onPress={() => setOpen(true)}
        rippleColor={allColors.rippleColor} 
      >
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 0}}>
          <IconComponent
            name={"calendar"}
            category={"MaterialCommunityIcons"}
            size={25}
            color={allColors.addBtnColors}
          />
           <TextInput
            style={{ backgroundColor: "transparent", height: 20, width: "100%" }}
            contentStyle={{fontFamily: "Rubik_400Regular"}}
            placeholderTextColor={allColors.textColorSecondary}
            disabled
            underlineColor={'transparent'}
            activeUnderlineColor={'transparent'}
            placeholder={name}
            underlineColorAndroid={'red'}
            underlineStyle={{backgroundColor: 'transparent'}}
          />
        </View>
      </TouchableRipple>
    );
  };

  const commonCheckBox = (vall, setter, text) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BouncyCheckbox
          isChecked={vall}
          disableBuiltInState
          onPress={() => setter((prevState) => !prevState)}
          fillColor={allColors.textColorPrimary}
          innerIconStyle={{ borderRadius: 50, borderColor: "grey" }}
          iconStyle={{ borderRadius: 50 }}
          style={{ paddingLeft: 5 }}
        />
        <MyText style={{color: allColors.universalColor}}>{text}</MyText>
      </View>
    )
  }

  const handleInputChange = (name, value, keyboardType) => {
    if (keyboardType === 'number-pad') {
      value = value.replace(',', '.');
      const regex = /^\d{0,10}(\.\d{0,2})?$/;
      if (!regex.test(value)) {
        return;
      }
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
          isChecked: true,
          markAsDone: false
        };
      });
    const finalRes = result.concat({ 
      sectionName,
      totalAmountSpent,
      whoPaid,
      id: Math.random() * 10,
      groupIdentity,
      dateOfSection: dateValue,
      timeOfSection: moment().format('HH:mm:ss')
    });
    const isValidNumber = input => {
      const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;      
      return numberRegex.test(input);
    }
    const checkTotalMembersAmount = () => {
      let sum = 0;
      for (let key in amountOfEachMember) {
        if (amountOfEachMember.hasOwnProperty(key)) sum += +amountOfEachMember[key];
      }
      return sum;
    }

    const checkError = () => {
      if (sectionName.length === 0) { setErrorMsg("Please fill the section name"); return true; }
      if (!isValidNumber(totalAmountSpent)) {setErrorMsg("Please enter a valid amount"); return true;}

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
      if (checkTotalMembersAmount() > totalAmountSpent + 1) { // +- 1 
        setErrorMsg("Individual members total amount must be less than or equal to the total amount spent");
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
      <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, gap: 20, flex: 1 }}>
        {commonTextSection("Section name", sectionName, setSectionName, "default")}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            {commonTextSection("Total amount spent", totalAmountSpent, setTotalAmountSpent, "number-pad")}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            {commonTextSection("Paid by", whoPaid, setWhoPaid, "default")}
          </View>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          {dateTextInput(dateValue)}
        </View>

        <MyText style={{color: allColors.universalColor}}>Select members for this section</MyText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {commonCheckBox(divideEqually, setDivideEqually, "Divide Equally")}
          {commonCheckBox(divideByPercent, setDivideByPercent, "Divide by percent")}
        </View>

        {divideByPercent && (
          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 30 }}
          >
            <MyText style={[{color: allColors.universalColor},percentageLeft < 0 && {color: allColors.errorColor}]}>{percentageLeft.toFixed(2)}% left</MyText>
            <MyText style={[{color: allColors.universalColor},totalAmountLeft < 0 && {color: allColors.errorColor}]}>{totalAmountLeft.toFixed(2)} left</MyText>
          </View>
        )}

        <ScrollView style={!divideByPercent && { marginTop: 35.8 }} showsVerticalScrollIndicator={false}>
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
                  <MyText style={{color: allColors.universalColor, maxWidth: 250}} numberOfLines={1} ellipsizeMode="tail">{name}</MyText>
                  {divideByPercent && amountOfEachMember[name] && (
                    <MyText variant="labelSmall" style={{color: allColors.universalColor}}>
                      {handleDividePercent(amountOfEachMember[name])}
                    </MyText>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "34%",
                  }}
                >
                  <TextInput
                    label={
                      <MyText style={{color: allColors.universalColor}}>
                        {divideByPercent ? "Percent" : "Amount"}
                      </MyText>
                    }
                    style={{
                      backgroundColor: "transparent",
                      flex: 1,
                      height: 50,
                    }}
                    value={amountOfEachMember[name] || ""}
                    onChangeText={(value) => handleInputChange(name, value, "number-pad")}
                    disabled={!isChecked[name]}
                    keyboardType="number-pad"
                    textColor={allColors.universalColor}
                    selectionColor={allColors.textSelectionColor}
                    contentStyle={{fontFamily: "Rubik_400Regular"}}
                    underlineColor={allColors.textColorPrimary}
                    activeUnderlineColor={allColors.textColorPrimary}
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                  {divideByPercent && <MyText style={{color: allColors.universalColor}}>%</MyText>}
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
            backgroundColor: allColors.addBtnColors,
            borderRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <MyText
            style={{
              color: allColors.backgroundColorPrimary,
              fontFamily: "Rubik_500Medium",
              fontSize: 18,
            }}
          >
            Add section
          </MyText>
        </Button>
      </View>
      {error && <SnackbarComponent errorMsg={errorMsg}/>}
              
      <MyDatePicker 
        open={open} 
        setOpen={setOpen} 
        fetchDates={fetchDates}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedDate={setSelectedDate}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        disableTheDates={false}
        screen={"PlusMoreSplitSection"}
      />

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
