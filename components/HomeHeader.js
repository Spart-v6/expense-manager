import { View, StyleSheet, PlatformColor } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";
import React from "react";
import { LineChart } from "react-native-chart-kit";

const makeStyles = (colors) => StyleSheet.create({
  card: {
    backgroundColor: PlatformColor('@android:color/system_accent1_500'),
    borderRadius: 4,
    margin: 16,
    padding: 16,
  },
  incomeCard: {
    backgroundColor: "#fff",
    borderRadius: 4,
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
    backgroundColor: "#fff",
    borderRadius: 4,
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
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
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
  
  const theme = useTheme();
  const styles = makeStyles(theme.colors)

  return (
    <Card style={[styles.card]}>
      <Card.Title title="Total balance" subtitle="- $1,111" titleStyle={{color:PlatformColor('@android:color/system_accent1_200')}}/>
      <Card.Content>
        <Text variant="titleLarge">March month</Text>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <Text>Income</Text>
            <Text>+ $12,222</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Expense</Text>
            <Text>- $12,222</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const IncomeCard = ({ incomeArray }) => {
  const totalIncome = incomeArray.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={styles.incomeCard}>
      <View style={styles.incomeContent}>
        <Text>Income</Text>
        <Text>+ ${totalIncome}</Text>
      </View>
      <View>{MyBezierLineChart("#4bba38", incomeArray)}</View>
    </View>
  );
};

const ExpenseCard = ({ expenseArray }) => {
  const totalExpense = expenseArray.reduce((a, b) => a + b, 0) || 0;

  return (
    <View style={styles.expenseCard}>
      <View style={styles.expenseContent}>
        <Text>Expense</Text>
        <Text>- ${totalExpense}</Text>
      </View>
      <View>{MyBezierLineChart("#FF0000", expenseArray)}</View>
    </View>
  );
};

const HomeHeader = ({ incomeArray, expenseArray }) => {

  return (
    <View>
      <DashboardCard />
      <View style={{ flexDirection: "row" }}>
        {/* <IncomeCard incomeArray={incomeArray} />
        <ExpenseCard expenseArray={expenseArray} /> */}
      </View>
    </View>
  );
};

export default HomeHeader;
