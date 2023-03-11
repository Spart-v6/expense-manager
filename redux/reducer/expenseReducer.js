import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  expenses: [],
  allExpenses: [],
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_DATA:
      AsyncStorage.setItem(
        "ALL_EXPENSES",
        JSON.stringify([...state.allExpenses, action.payload])
      );
      return {
        expenses: [...state.expenses, action.payload],
      };
    case types.UPDATE_DATA:
      const { sameId, updatedObj } = action.payload;
      const index = state.allExpenses.findIndex(obj => obj.id === sameId);
      if (index !== -1) {
        const updatedObjects = [...state.allExpenses];
        updatedObjects[index] = { ...updatedObjects[index], ...updatedObj };
        AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedObjects));
        return { ...state, allExpenses: updatedObjects };
      }
      return state;
    case types.DELETE_DATA:
      const id = action.payload;
      const updatedArray = state.allExpenses.filter((obj) => obj.id !== id);

      AsyncStorage.setItem("ALL_EXPENSES", JSON.stringify(updatedArray));
      return { ...state, allExpenses: updatedArray };
    case types.STORE_DATA:
      return {
        ...state,
        allExpenses: action.payload,
      };
    default:
      return state;
  }
};

export default expenseReducer;
