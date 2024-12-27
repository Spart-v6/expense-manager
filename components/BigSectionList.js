import React, { useMemo, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator
} from "react-native";
import moment from "moment";
import { Appbar, Button, Divider, List, Menu, Subheading, Text, TouchableRipple } from "react-native-paper";
import Expenses from "./Expenses";
import useDynamicColors from "../commons/useDynamicColors";
// Import FlashList instead of BigList
import { FlashList } from "@shopify/flash-list";
import sections from "../helper/dammy.json";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addData, storeData, storeRecurrences, updateRecurrences } from "../redux/actions";
import MyText from "../components/MyText";
import Octicons from "react-native-vector-icons/Octicons";
import { Chip } from 'react-native-paper';
import { IconComponent } from "./IconPickerModal";
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";

export default function BigSectionList() {
  const navigation = useNavigation();
  const allColors = useDynamicColors();
  const dispatch = useDispatch();
  const styles = makeStyles(allColors);

  const [loading, setLoading] = useState(true); // Loading state
  const [filter, setFilter] = useState("Daily");
  const [visible, setVisible] = React.useState(false);
  
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [currency, setCurrency] = React.useState({curr: "$"});

  React.useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchCurrency();
  }, []);


  // #region Fetching expenses

  useEffect(() => {
    const loadData = async () => {
      const totalIncome = JSON.parse(await AsyncStorage.getItem("TOTAL_INCOME")) || 0;
      const totalExpense = JSON.parse(await AsyncStorage.getItem("TOTAL_EXPENSE")) || 0;
      const totalIncomeForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_INCOME")) || 0;
      const totalExpenseForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_EXPENSE")) || 0;
      const allExpenses = JSON.parse(await AsyncStorage.getItem("ALL_EXPENSES")) || [];
    
      dispatch({
        type: "SET_INITIAL_TOTALS",
        payload: { totalIncome, totalExpense, totalIncomeForMonth, totalExpenseForMonth, allExpenses },
      });
    };
  
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpensesData();
    }, [])
  );

  const fetchExpensesData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      const res = await AsyncStorage.getItem("ALL_EXPENSES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeData(newData));
    } catch (e) {}
    finally { setLoading(false) }
  };
  // #endregion

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);

  const parseDateString = (dateString) => moment(dateString, 'YYYY/MM/DD');
  const parseDateTimeString = (date, time) => {
    return moment(`${date} ${time}`, 'YYYY/MM/DD HH:mm:ss');
  };

  const sortedData = expensesData.sort((a, b) => {
    return parseDateTimeString(b.date, b.time) - parseDateTimeString(a.date, a.time);
  });

  const groupByWeek = (data) => {
    const grouped = {};
  
    data.forEach(item => {
      const date = parseDateString(item.date);
      const weekNumber = date.week(); // Get ISO week number
      const year = date.format('YYYY'); // Get the year in YYYY format
      
      const key = `${year}-W${weekNumber}`; // Combine year and week number as the key
  
      if (!grouped[key]) {
        grouped[key] = {
          week: weekNumber,
          year: year,
          items: [],
          totalAmount: 0
        };
      }
  
      const amount = parseFloat(item.amount);
      grouped[key].totalAmount += item.type === "Income" ? amount : -amount;
  
      grouped[key].items.push(item);
    });
  
    return grouped;
  };

  const groupByMonth = (data) => {
    const grouped = {};
  
    data.forEach(item => {
      const date = parseDateString(item.date);
      const monthName = date.format('MMMM'); // Get month name
      const year = date.format('YYYY'); // Get year
  
      const key = `${year}-${monthName}`; // Combine year and month name as the key
  
      if (!grouped[key]) {
        grouped[key] = {
          month: monthName,
          year: year,
          items: [],
          totalAmount: 0
        };
      }
  
      const amount = parseFloat(item.amount);
      grouped[key].totalAmount += item.type === "Income" ? amount : -amount;
  
      grouped[key].items.push(item);
    });
  
    return grouped;
  };

  const groupByYear = (data) => {
    const grouped = {};
  
    data.forEach(item => {
      const date = parseDateString(item.date);
      const year = date.format('YYYY'); // Get year
  
      const key = year; // Year is the key
  
      if (!grouped[key]) {
        grouped[key] = {
          year: year,
          items: [],
          totalAmount: 0
        };
      }
  
      const amount = parseFloat(item.amount);
      grouped[key].totalAmount += item.type === "Income" ? amount : -amount;
  
      grouped[key].items.push(item);
    });
  
    return grouped;
  };
  
  const groupedData = groupByWeek(sortedData);
  const groupedDataByMonth = groupByMonth(sortedData);
  const groupedDataByYear = groupByYear(sortedData);

  const getWeekHeaders = (groupedData) => {
    const dataWithHeaders = [];
    
    Object.keys(groupedData).forEach(key => {
      const { week, year, items, totalAmount } = groupedData[key];
      dataWithHeaders.push({ 
        header: `Week ${week} of ${year} - ${totalAmount.toFixed(2)}`, 
        totalAmount 
      });
      items.forEach(item => {
        dataWithHeaders.push(item);
      });
    });
  
    return dataWithHeaders;
  };
  
  const getMonthHeaders = (groupedData) => {
    const dataWithHeaders = [];
    
    Object.keys(groupedData).forEach(key => {
      const { month, year, items, totalAmount } = groupedData[key];
      dataWithHeaders.push({ 
        header: `${month} ${year} - ${totalAmount.toFixed(2)}`, 
        totalAmount 
      });
      items.forEach(item => {
        dataWithHeaders.push(item);
      });
    });
  
    return dataWithHeaders;
  };

  const getYearHeaders = (groupedData) => {
    const dataWithHeaders = [];
    
    Object.keys(groupedData).forEach(key => {
      const { year, items, totalAmount } = groupedData[key];
      dataWithHeaders.push({ 
        header: `${year} - ${totalAmount.toFixed(2)}`, 
        totalAmount 
      });
      items.forEach(item => {
        dataWithHeaders.push(item);
      });
    });
  
    return dataWithHeaders;
  };

  const renderItem = ({ item, index }) => {
    if (item.header) {
      // Split the string at the first occurrence of ' - '
      const [leftText, ...rest] = item.header.split(' - ');
      const rightText = rest.join(' - '); // Join the rest back to handle negative numbers

      return (
        <View style={[{flexDirection: "row", justifyContent: "space-between", paddingLeft: 15, paddingRight: 15, paddingTop: 25}, index === 0 && {paddingTop: 10}]}>
          <MyText variant="titleMedium" style={{color:allColors.universalColor}}>{leftText}</MyText>
          <MyText variant="titleMedium" style={{color:allColors.universalColor}}>{formatNumberWithCurrency(rightText, currency.curr)}</MyText>
        </View>
      );
    }
    
    return (
      <View style={{paddingLeft: 20, paddingRight: 20}}>
        <Expenses
          index={index}
          item={item}
          onPress={(item) =>
            navigation.navigate("PlusMoreHome", { updateItem: item })
          }
        />
        <View style={styles.separator} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={{height: Dimensions.get("screen").height / 1.3, justifyContent: 'center', alignItems: 'center'}}>
      <MyText variant="titleMedium" style={{color: allColors.universalColor}}>All expenses will be shown here</MyText>
    </View>
  )

  const dataToShow = () => {
    if (filter === "Daily") return sortedData;
    if (filter === "Weekly") return getWeekHeaders(groupedData);
    if (filter === "Monthly") return getMonthHeaders(groupedDataByMonth);
    if (filter === "Yearly") return getYearHeaders(groupedDataByYear);
    return sortedData;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 20,
          paddingLeft: 20,
          alignContent: 'center',
          alignItems: 'center'
      }}>
        <View>
          <Chip icon={() => ( <IconComponent name="information" category={"MaterialCommunityIcons"} color={allColors.addBtnColors} size={20} /> )} style={{backgroundColor: allColors.backgroundColorDatesSelected, borderColor: allColors.universalColor}} textStyle={{color: allColors.universalColor}} mode="outlined">{filter}</Chip>
        </View>
        <Menu
          anchorPosition="bottom"
          contentStyle={{right: 0, top: 70, backgroundColor: allColors.backgroundColorLessPrimary}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <View style={{flexDirection: "row", justifyContent: "flex-end", alignContent: "center", alignItems: "center"}}>
            <TouchableRipple style={{padding: 10}} rippleColor="rgba(0, 0, 0, .22)" onPress={openMenu}>
              <View style={{flexDirection: "row", gap: 20, alignItems: "center"}}>
                <MyText variant="bodyLarge" style={{ color: allColors.universalColor}} fontWeight= "bold">Filters</MyText>
                <Octicons
                  name="filter"
                  size={20}
                  color={allColors.addBtnColors}
                  style={{ alignSelf: "center" }}
                />
              </View>
            </TouchableRipple>
            </View>
          }
          >
          <Menu.Item onPress={() => {setFilter("Weekly"); closeMenu()}} title="Weekly" titleStyle={{color: allColors.universalColor}}/>
          <Menu.Item onPress={() => {setFilter("Monthly"); closeMenu()}} title="Monthly" titleStyle={{color: allColors.universalColor}}/>
          <Menu.Item onPress={() => {setFilter("Yearly"); closeMenu()}} title="Yearly" titleStyle={{color: allColors.universalColor}}/>
          <Divider style={styles.line}/>
          <Menu.Item onPress={() => {setFilter("Daily"); closeMenu()}} title="Reset" titleStyle={{color: allColors.universalColor}}/>
        </Menu>
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={allColors.universalColor} />
        </View>
      ) : (
      <KeyboardAvoidingView style={styles.container}>
        {
          sortedData.length > 0 ? (
            <View style={{flex: 1, paddingTop: 5, paddingBottom: 20}}>
              
              <FlashList
                data={dataToShow()}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={200}
                alwaysBounceVertical
              />
            </View>
          ) 
          : (
            renderEmpty()
          )
        }
      </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const makeStyles = allColors =>
  StyleSheet.create({
    container: {
        flex: 1,
      },
      separator: {
        height: 1,
        backgroundColor: "#80808029",
        width: Dimensions.get("screen").width * 0.8,
        alignSelf: "center",
      },
      outerContainer: {
        width: "95%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "flex-start",
        paddingLeft: 5,
        backgroundColor: allColors.backgroundColorPrimary,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    line: {
      height: 2,
      borderRadius: 100,
      width: "100%",
      opacity: 0.5,
      alignSelf: "center",
    },
});