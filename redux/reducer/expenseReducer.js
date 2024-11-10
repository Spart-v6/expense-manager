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
    
      AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedExpenses));
      AsyncStorage.setItem("TOTAL_INCOME", JSON.stringify(updatedTotalIncome));
      AsyncStorage.setItem("TOTAL_EXPENSE", JSON.stringify(updatedTotalExpense));
      AsyncStorage.setItem("MONTHLY_INCOME", JSON.stringify(totalIncomeForMonth));
      AsyncStorage.setItem("MONTHLY_EXPENSE", JSON.stringify(totalExpenseForMonth));
    
      return {
        ...state,
        allExpenses: updatedExpenses,
        totalIncome: updatedTotalIncome,
        totalExpense: updatedTotalExpense,
        totalIncomeForMonth,
        totalExpenseForMonth,
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
    
        console.log("Updated income:", updatedTotalIncome);
        console.log("Updated expense:", updatedTotalExpense);
    
        // Save the updated expenses and totals to AsyncStorage
        AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedObjects));
        AsyncStorage.setItem("TOTAL_INCOME", JSON.stringify(updatedTotalIncome));
        AsyncStorage.setItem("TOTAL_EXPENSE", JSON.stringify(updatedTotalExpense));
    
        return {
          ...state,
          allExpenses: updatedObjects,
          totalIncome: updatedTotalIncome,
          totalExpense: updatedTotalExpense,
        };
      }
      return state;
    }
    case types.DELETE_DATA : {
      const id = action.payload;
      const updatedArray = state.allExpenses?.filter((obj) => obj.id !== id);
    
      // Calculate the new totals after deletion
      const { totalIncome: updatedTotalIncome, totalExpense: updatedTotalExpense } = calculateTotals(updatedArray);
    
      console.log("Income after deletion:", updatedTotalIncome);
      console.log("Expense after deletion:", updatedTotalExpense);
    
      // Save the updated expenses and totals to AsyncStorage
      AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedArray));
      AsyncStorage.setItem("TOTAL_INCOME", JSON.stringify(updatedTotalIncome));
      AsyncStorage.setItem("TOTAL_EXPENSE", JSON.stringify(updatedTotalExpense));
    
      return {
        ...state,
        allExpenses: updatedArray || [],
        totalIncome: updatedTotalIncome,
        totalExpense: updatedTotalExpense,
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
