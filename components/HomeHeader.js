import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Tooltip } from "react-native-paper";
import React, { useCallback } from "react";
import useDynamicColors from "../commons/useDynamicColors";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MyText from "../components/MyText";
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeData } from "../redux/actions";

const makeStyles = allColors =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.defaultHomeRecurrCard,
      borderRadius: 25,
      margin: 16,
      padding: 16,
    },
    incomeCard: {
      backgroundColor: allColors.backgroundColorCard,
      borderRadius: 25,
      elevation: 1,
      margin: 15,
      marginTop: 4,
      marginBottom: 20,
      padding: 0,
      height: 100,
      flex: 1,
    },
    incomeContent: {
      flexDirection: 'row',
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingTop: 16,
      paddingRight: 16,
    },
    expenseCard: {
      backgroundColor: allColors.backgroundColorCard,
      borderRadius: 25,
      elevation: 1,
      margin: 15,
      marginTop: 4,
      marginBottom: 20,
      padding: 0,
      height: 100,
      flex: 1,
    },
    expenseContent: {
      flexDirection: 'row',
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingTop: 16,
      paddingRight: 16,
    },
    header: {
      alignItems: "flex-start",
      borderBottomColor: "#ddd",
      paddingBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      gap: 20
    },
    text: {
      fontSize: 16,
    },
});

const MyBezierLineChart = (colors, chartData) => {
  const data = {
    datasets: [
      {
        data: chartData || [0, 0, 0, 0],
        color: () => colors,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "transparent",
    strokeWidth: 3,
    backgroundGradientTo: "transparent",
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };
  return (
    <>
      <LineChart
        bezier
        data={data}
        width={170}
        height={70}
        withDots={false}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withVerticalLabels={false}
        withHorizontalLines={false}
        withHorizontalLabels={false}
        chartConfig={chartConfig}
        strokeLinejoin={"round"}
        style={{
          paddingTop: 3,
          paddingRight: 3,
          paddingLeft: 15,
          paddingBottom: 0,
          borderRadius: 10
        }}
      />
    </>
  );
};

const DashboardCard = ({ currency }) => {
  const allColors = useDynamicColors();
  const expenseData = useSelector((state) => state.expenseReducer.allExpenses);
  const styles = makeStyles(allColors);

  const totalValue = expenseData?.reduce((acc, curr) => {
    if (curr.type === "Income") return acc + +curr.amount; 
    else if (curr.type === "Expense") return acc - +curr.amount;
    else return acc;
  }, 0);

  const currentMonth = moment().month() + 1;
  const filteredArr = expenseData?.filter(item => moment(item.date,"YYYY/MM/DD").month() + 1 === currentMonth);

  const {totalIncomeForMonth, totalExpenseForMonth} = filteredArr?.length > 0
  ? filteredArr?.reduce((acc, item) => {
      if (item.type === "Income") acc.totalIncomeForMonth += (+item.amount);
      else if (item.type === "Expense") acc.totalExpenseForMonth += (+item.amount);
      return acc;
    },
    {totalIncomeForMonth: 0, totalExpenseForMonth: 0}
  )
  : {totalIncomeForMonth: 0, totalExpenseForMonth: 0};

  return (
    <Card style={[styles.card]}>
      <Card.Title
        title="My balance"
        titleStyle={{ color: allColors.textColorPrimary, fontSize: 18, fontFamily: "Rubik_400Regular" }}
      />
      <MyText style={{
        fontSize: 30,
        textAlignVertical: "center",
        padding: 16,
        paddingTop: 0,
        marginTop: -15,
        color: allColors.textColorSecondary,
      }}>
        {formatNumberWithCurrency(totalValue, currency)}
      </MyText>
      <Card.Content>
        <MyText
          variant="titleLarge"
          style={{ color: allColors.textColorPrimary }}
        >
           {moment().format("MMMM")} month
        </MyText>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <MyText style={{ color: allColors.textColorPrimary }}>Income</MyText>
            <View style={{flexDirection:"row", gap: 2}}>
              <AntDesign name="caretup" size={10} color={allColors.successColor} style={{alignSelf:"center"}}/>
              <MyText style={{ color: allColors.textColorFive }}>
                + {formatNumberWithCurrency(totalIncomeForMonth, currency)}
              </MyText>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <MyText style={{ color: allColors.textColorPrimary }}>Expense</MyText>
            <View style={{flexDirection:"row", gap: 2}}>
              <AntDesign name="caretdown" size={10} color={allColors.warningColor} style={{alignSelf:"center"}}/>
              <MyText style={{ color: allColors.textColorFive }}>
                - {formatNumberWithCurrency(totalExpenseForMonth, currency)}
              </MyText>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const IncomeCard = ({ incomeArray, currency }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const totalIncome = incomeArray?.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={styles.incomeCard}>
      <View style={styles.incomeContent}>
        <Feather name="trending-up" size={20} color={allColors.successColor} style={{alignSelf:"center"}}/>
        <Tooltip title={formatNumberWithCurrency(totalIncome, currency)}  
          theme={{ colors: { onSurface: allColors.backgroundColorSecondary, surface: allColors.textColorFour } }} >
          <View>
            <MyText style={{ color: allColors.successColor, maxWidth: Dimensions.get("window").width / 4 }} numberOfLines={1} ellipsizeMode="tail" variant="labelSmall" allowFontScaling={false}>
              + {formatNumberWithCurrency(totalIncome, currency)}
            </MyText>
          </View>
        </Tooltip>
      </View>
      <View>{MyBezierLineChart("#4bba38", incomeArray)}</View> 
    </View>
  );
};

const ExpenseCard = ({ expenseArray, currency }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const totalExpense = expenseArray?.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={styles.expenseCard}>
      <View style={styles.expenseContent}>
        <Feather name="trending-down" size={20} color={allColors.warningColor} style={{alignSelf:"center"}}/>
        <Tooltip title={formatNumberWithCurrency(totalExpense, currency)}  
          theme={{ colors: { onSurface: allColors.backgroundColorSecondary, surface: allColors.textColorFour } }} >  
          <View>
            <MyText style={{ color: allColors.warningColor, maxWidth: Dimensions.get("window").width / 4 }}numberOfLines={1} ellipsizeMode="tail" variant="labelSmall" allowFontScaling={false}>
              - {formatNumberWithCurrency(totalExpense, currency)}
            </MyText>
          </View>
        </Tooltip>
      </View>
      <View>{MyBezierLineChart("#FF0000", expenseArray)}</View>
    </View>
  );
};

const HomeHeader = () => {
  const dispatch = useDispatch();
  //fetching currency
  const [currency, setCurrency] = React.useState({
    curr: "$"
  });

  React.useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchCurrency();
  }, []);

  // #region fetching all expenses in home header
  useFocusEffect(
    useCallback(() => {
      fetchExpensesData();
    }, [])
  );

  const fetchExpensesData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_EXPENSES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeData(newData));
    } catch (e) {}
  };

  // #endregion

  const expenseData = useSelector((state) => state.expenseReducer.allExpenses);

  const [incomeArray, setIncomeArray] = React.useState([]);
  const [expenseArray, setExpenseArray] = React.useState([]);

  React.useEffect(() => {
    const newIncomeArray = expenseData
      ?.filter((item) => item?.type === "Income")
      ?.sort((a, b) => {
        const dateComparison = moment(a.date, "YYYY/MM/DD").diff(moment(b.date, "YYYY/MM/DD"));
        if (dateComparison !== 0) return dateComparison;
        else return moment(a.time, "HH:mm:ss").diff(moment(b.time, "HH:mm:ss"));
      })
      ?.map((item) => +item?.amount);
  
    const newExpenseArray = expenseData
      ?.filter((item) => item?.type === "Expense")
      ?.sort((a, b) => {
        const dateComparison = moment(a.date, "YYYY/MM/DD").diff(moment(b.date, "YYYY/MM/DD"));
        if (dateComparison !== 0) return dateComparison;
        else return moment(a.time, "HH:mm:ss").diff(moment(b.time, "HH:mm:ss"));
      })
      ?.map((item) => +item?.amount);
  
    setIncomeArray(newIncomeArray);
    setExpenseArray(newExpenseArray);
  }, [expenseData]);

  return (
    <View>
      <DashboardCard currency={currency.curr}/>
      <View style={{ flexDirection: "row" }}>
        <IncomeCard incomeArray={incomeArray} currency={currency.curr}/>
        <ExpenseCard expenseArray={expenseArray} currency={currency.curr}/>
      </View>
    </View>
  );
};

export default HomeHeader;
