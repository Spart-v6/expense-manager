import { View, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";
import React from "react";
import allColors from "../commons/allColors";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import { useSelector } from "react-redux";
import AntDesign from 'react-native-vector-icons/AntDesign';

const makeStyles = () =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.backgroundColorSecondary,
      borderRadius: 25,
      margin: 16,
      padding: 16,
    },
    incomeCard: {
      backgroundColor: allColors.backgroundColorTertiary,
      borderRadius: 25,
      elevation: 4,
      margin: 16,
      padding: 0,
      flex: 1,
    },
    incomeContent: {
      paddingLeft: 16,
      paddingTop: 16,
    },
    expenseCard: {
      backgroundColor: allColors.backgroundColorTertiary,
      borderRadius: 25,
      elevation: 4,
      margin: 16,
      padding: 0,
      flex: 1,
    },
    expenseContent: {
      paddingLeft: 16,
      paddingTop: 16,
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
    strokeWidth: 4,
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
        height={100}
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
          paddingRight: 0,
          paddingLeft: 15,
          paddingBottom: 0,
        }}
      />
    </>
  );
};

const DashboardCard = () => {
  const expenseData = useSelector((state) => state.expenseReducer.allExpenses);
  const styles = makeStyles();

  const totalValue = expenseData?.reduce((acc, curr) => {
    if (curr.type === "Income") return acc + +curr.amount; 
    else if (curr.type === "Expense") return acc - +curr.amount;
    else return acc;
  }, 0);

  let overallExpense = totalValue?.toString();
  if (totalValue >= 0) overallExpense = "$" + overallExpense;
  else
    overallExpense =
      overallExpense?.slice(0, 1) + "$" + overallExpense?.slice(1);

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
        subtitle={overallExpense}
        titleStyle={{ color: allColors.textColorPrimary, fontSize: 17 }}
        subtitleStyle={{
          fontSize: 30,
          textAlignVertical: "center",
          paddingTop: 20,
          paddingBottom: 10,
          color: allColors.textColorSecondary,
        }}
      />
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
                + ${totalIncomeForMonth}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: allColors.textColorPrimary }}>Expense</Text>
            <View style={{flexDirection:"row", gap: 2}}>
              <AntDesign name="caretdown" size={10} color={'red'} style={{alignSelf:"center"}}/>
              <Text style={{ color: allColors.textColorFive }}>
                - ${totalExpenseForMonth}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const IncomeCard = ({ incomeArray }) => {
  const styles = makeStyles();
  const totalIncome = incomeArray?.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={styles.incomeCard}>
      <View style={styles.incomeContent}>
        <Text>Income</Text>
          <Text style={{ color: allColors.successColor }}>+ ${totalIncome}</Text>
      </View>
      <View>{MyBezierLineChart("#4bba38", incomeArray)}</View>
    </View>
  );
};

const ExpenseCard = ({ expenseArray }) => {
  const styles = makeStyles();
  const totalExpense = expenseArray?.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={styles.expenseCard}>
      <View style={styles.expenseContent}>
        <Text>Expense</Text>
          <Text style={{ color: allColors.warningColor }}>- ${totalExpense}</Text>
      </View>
      <View>{MyBezierLineChart("#FF0000", expenseArray)}</View>
    </View>
  );
};

const HomeHeader = () => {
  const expenseData = useSelector((state) => state.expenseReducer.allExpenses);

  const [incomeArray, setIncomeArray] = React.useState([]);
  const [expenseArray, setExpenseArray] = React.useState([]);

  React.useEffect(() => {
    const newIncomeArray = expenseData
      ?.filter((item) => item?.type === "Income")
      ?.map((item) => +item?.amount);
    const newExpenseArray = expenseData
      ?.filter((item) => item.type === "Expense")
      ?.map((item) => +item.amount);

    setIncomeArray(newIncomeArray);
    setExpenseArray(newExpenseArray);
  }, [expenseData]);

  return (
    <View>
      <DashboardCard />
      <View style={{ flexDirection: "row" }}>
        <IncomeCard incomeArray={incomeArray} />
        <ExpenseCard expenseArray={expenseArray} />
      </View>
    </View>
  );
};

export default HomeHeader;
