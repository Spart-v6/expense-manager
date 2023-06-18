import { View, StyleSheet } from "react-native";
import { Text, Card, Tooltip } from "react-native-paper";
import React from "react";
import useDynamicColors from "../commons/useDynamicColors";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import { useSelector } from "react-redux";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";

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
  // TODO: sort by time too
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
          paddingTop: 5,
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
        titleStyle={{ color: allColors.textColorPrimary, fontSize: 17 }}
      />
      <Text style={{
        fontSize: 30,
        textAlignVertical: "center",
        padding: 16,
        paddingTop: 0,
        marginTop: -15,
        color: allColors.textColorSecondary,
      }}>
        {formatNumberWithCurrency(totalValue, currency)}
      </Text>
      <Card.Content>
        <Text
          variant="titleLarge"
          style={{ color: allColors.textColorPrimary }}
        >
           {moment().format("MMMM")} month
        </Text>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: allColors.textColorPrimary }}>Income</Text>
            <View style={{flexDirection:"row", gap: 2}}>
              <AntDesign name="caretup" size={10} color={'green'} style={{alignSelf:"center"}}/>
              <Text style={{ color: allColors.textColorFive }}>
                + {formatNumberWithCurrency(totalIncomeForMonth, currency)}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: allColors.textColorPrimary }}>Expense</Text>
            <View style={{flexDirection:"row", gap: 2}}>
              <AntDesign name="caretdown" size={10} color={'red'} style={{alignSelf:"center"}}/>
              <Text style={{ color: allColors.textColorFive }}>
                - {formatNumberWithCurrency(totalExpenseForMonth, currency)}
              </Text>
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
        <Text style={{color: allColors.universalColor}} variant="labelMedium">Income</Text>
        <Tooltip title={formatNumberWithCurrency(totalIncome, currency)}  
          theme={{ colors: { onSurface: allColors.backgroundColorSecondary, surface: allColors.textColorFour } }} >
          <View>
            <Text style={{ color: allColors.successColor, maxWidth: 120 }} numberOfLines={1} ellipsizeMode="tail" variant="labelMedium">
              + {formatNumberWithCurrency(totalIncome, currency)}
            </Text>
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
        <Text style={{color: allColors.universalColor}} variant="labelMedium">Expense</Text>
        <Tooltip title={formatNumberWithCurrency(totalExpense, currency)}  
          theme={{ colors: { onSurface: allColors.backgroundColorSecondary, surface: allColors.textColorFour } }} >  
          <View>
            <Text style={{ color: allColors.warningColor, maxWidth: 120 }}numberOfLines={1} ellipsizeMode="tail" variant="labelMedium">
              - {formatNumberWithCurrency(totalExpense, currency)}
            </Text>
          </View>
        </Tooltip>
      </View>
      <View>{MyBezierLineChart("#FF0000", expenseArray)}</View>
    </View>
  );
};

const HomeHeader = () => {
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
