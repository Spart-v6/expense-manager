import moment from "moment";
import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  expenses: [],
  allExpenses: [],
  totalIncome: 0,
  totalExpense: 0,
  totalIncomeForMonth: 0,
  totalExpenseForMonth: 0,
  chartData: {}
};


const calculateTotals = (expenses, filterByMonth = false) => {
  const currentMonth = moment().month();
  const currentYear = moment().year();

  const filteredExpenses = filterByMonth
    ? expenses.filter(
        (item) =>
          moment(item.date, "YYYY/MM/DD").month() === currentMonth &&
          moment(item.date, "YYYY/MM/DD").year() === currentYear
      )
    : expenses;

  const totalIncome = filteredExpenses
    .filter((item) => item?.type === "Income")
    .reduce((sum, item) => sum + parseFloat(item?.amount), 0);

  const totalExpense = filteredExpenses
    .filter((item) => item?.type === "Expense")
    .reduce((sum, item) => sum + parseFloat(item?.amount), 0);

  return { totalIncome, totalExpense };
};

const calculateChartData = (expenses) => {
  const chartData = {};

  expenses.forEach((item) => {
    const date = moment(item.date, "YYYY/MM/DD");
    const year = date.year();
    const month = date.month();
    const day = date.date();
    const weekOfMonth = Math.ceil(day / 7) - 1; // Determine week of the month (0-indexed)

    if (!chartData[year]) {
      chartData[year] = {
        expense: {
          daily: Array(7).fill(0),
          weekly: Array(5).fill(0),
          monthly: Array(12).fill(0),
          yearly: 0,
        },
        income: {
          daily: Array(7).fill(0),
          weekly: Array(5).fill(0),
          monthly: Array(12).fill(0),
          yearly: 0,
        },
      };
    }

    const dayOfWeek = date.day(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    if (item.type === "Expense") {
      // Update daily data
      chartData[year].expense.daily[dayOfWeek] += parseFloat(item.amount);

      // Update weekly data
      chartData[year].expense.weekly[weekOfMonth] += parseFloat(item.amount);

      // Update monthly data
      chartData[year].expense.monthly[month] += parseFloat(item.amount);

      // Update yearly total
      chartData[year].expense.yearly += parseFloat(item.amount);
    }

    if (item.type === "Income") {
      // Update daily data
      chartData[year].income.daily[dayOfWeek] += parseFloat(item.amount);

      // Update weekly data
      chartData[year].income.weekly[weekOfMonth] += parseFloat(item.amount);

      // Update monthly data
      chartData[year].income.monthly[month] += parseFloat(item.amount);

      // Update yearly total
      chartData[year].income.yearly += parseFloat(item.amount);
    }
  });

  return chartData;
};


const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_DATA: {
      const allExpenses = state.allExpenses || [];
      const updatedExpenses = [
        ...allExpenses,
        ...(Array.isArray(action.payload) ? action.payload : [action.payload]),
      ];

      const { totalIncome: updatedTotalIncome, totalExpense: updatedTotalExpense } = calculateTotals(updatedExpenses);
      const { totalIncome: totalIncomeForMonth, totalExpense: totalExpenseForMonth } = calculateTotals(updatedExpenses, true);

      const chartData = calculateChartData(updatedExpenses);
    
      AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedExpenses));
      AsyncStorage.setItem("TOTAL_INCOME", JSON.stringify(updatedTotalIncome));
      AsyncStorage.setItem("TOTAL_EXPENSE", JSON.stringify(updatedTotalExpense));
      AsyncStorage.setItem("MONTHLY_INCOME", JSON.stringify(totalIncomeForMonth));
      AsyncStorage.setItem("MONTHLY_EXPENSE", JSON.stringify(totalExpenseForMonth));
      AsyncStorage.setItem("CHART_DATA", JSON.stringify(chartData));

      console.log("Chart data when added data ", chartData);
      
    
      return {
        ...state,
        allExpenses: updatedExpenses,
        totalIncome: updatedTotalIncome,
        totalExpense: updatedTotalExpense,
        totalIncomeForMonth,
        totalExpenseForMonth,
        chartData: chartData
      };
    }

    case types.UPDATE_DATA : {
      const { sameId, updatedObj } = action.payload;
      const index = state.allExpenses.findIndex((obj) => obj.id === sameId);
      if (index !== -1) {
        // Create a new array with the updated expense item
        const updatedObjects = [...state.allExpenses];
        updatedObjects[index] = { ...updatedObjects[index], ...updatedObj };
    
        // Calculate updated totals based on the modified list of expenses
        const { totalIncome: updatedTotalIncome, totalExpense: updatedTotalExpense } = calculateTotals(updatedObjects);
        const { totalIncome: totalIncomeForMonth, totalExpense: totalExpenseForMonth } = calculateTotals(updatedObjects, true);

        const chartData = calculateChartData(updatedObjects);
        
      console.log("Chart data when updated data ", chartData);

        // Save the updated expenses and totals to AsyncStorage
        AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedObjects));
        AsyncStorage.setItem("TOTAL_INCOME", JSON.stringify(updatedTotalIncome));
        AsyncStorage.setItem("TOTAL_EXPENSE", JSON.stringify(updatedTotalExpense));
        AsyncStorage.setItem("MONTHLY_INCOME", JSON.stringify(totalIncomeForMonth));
        AsyncStorage.setItem("MONTHLY_EXPENSE", JSON.stringify(totalExpenseForMonth));
        AsyncStorage.setItem("CHART_DATA", JSON.stringify(chartData));
    
        return {
          ...state,
          allExpenses: updatedObjects,
          totalIncome: updatedTotalIncome,
          totalExpense: updatedTotalExpense,
          totalIncomeForMonth,
          totalExpenseForMonth,
          chartData: chartData
        };
      }
      return state;
    }
    case types.DELETE_DATA : {
      const id = action.payload;
      const updatedArray = state.allExpenses?.filter((obj) => obj.id !== id);

      console.log("Updated array ", updatedArray);
      
    
      // Calculate the new totals after deletion
      const { totalIncome: updatedTotalIncome, totalExpense: updatedTotalExpense } = calculateTotals(updatedArray);
      const { totalIncome: totalIncomeForMonth, totalExpense: totalExpenseForMonth } = calculateTotals(updatedArray, true);

      const chartData = calculateChartData(updatedArray);

      console.log("Chart data when delted data ", chartData);


      // Save the updated expenses and totals to AsyncStorage
      AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedArray));
      AsyncStorage.setItem("TOTAL_INCOME", JSON.stringify(updatedTotalIncome));
      AsyncStorage.setItem("TOTAL_EXPENSE", JSON.stringify(updatedTotalExpense));
      AsyncStorage.setItem("MONTHLY_INCOME", JSON.stringify(totalIncomeForMonth));
      AsyncStorage.setItem("MONTHLY_EXPENSE", JSON.stringify(totalExpenseForMonth));
      AsyncStorage.setItem("CHART_DATA", JSON.stringify(chartData));
    
      return {
        ...state,
        allExpenses: updatedArray || [],
        totalIncome: updatedTotalIncome,
        totalExpense: updatedTotalExpense,
        totalIncomeForMonth,
        totalExpenseForMonth,
        chartData: chartData,
      };
    }

    case types.STORE_DATA :{
      return {
        ...state,
        totalIncome: action.payload.totalIncome,
        totalExpense: action.payload.totalExpense,
      };
    }

    case types.SET_INITIAL_TOTALS: {
      return {
        ...state,
        totalIncome: action.payload.totalIncome,
        totalExpense: action.payload.totalExpense,
        allExpenses: action.payload.allExpenses || [],
        totalIncomeForMonth: action.payload.totalIncomeForMonth || 0,
        totalExpenseForMonth: action.payload.totalExpenseForMonth || 0,
      };
    }
    default:
      return state;
  }
};

export default expenseReducer;
