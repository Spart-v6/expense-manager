import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  recentTransactions: [],
};

const recentTransactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_RECENT_TRANSACTIONS:
      let updatedRecentTransactions;
    
      if (Array.isArray(action.payload)) {
        updatedRecentTransactions = [...action.payload.slice(0, 10), ...state.recentTransactions.slice(0, 9)];
      } else {
        updatedRecentTransactions = [action.payload, ...state.recentTransactions.slice(0, 9)];
      }
    
      storeRecentTransactions(updatedRecentTransactions);
    
      return {
        ...state,
        recentTransactions: updatedRecentTransactions.slice(0, 10),
      };
    

    case types.UPDATE_RECENT_TRANSACTIONS:
      const { sameId, updatedObj } = action.payload;
      const index = state.recentTransactions.findIndex(
        (obj) => obj.id === sameId
      );
      if (index !== -1) {
        const updatedObjects = [...state.recentTransactions];
        updatedObjects[index] = { ...updatedObjects[index], ...updatedObj };
        storeRecentTransactions(updatedObjects);
        return { ...state, recentTransactions: updatedObjects };
      }
      return state;

    case types.DELETE_RECENT_TRANSACTIONS:
      const id = action.payload;
      const updatedArray = state.recentTransactions?.filter(
        (obj) => obj.id !== id
      );

      storeRecentTransactions(updatedArray);
      return { ...state, recentTransactions: updatedArray || [] };

    case types.STORE_RECENT_TRANSACTIONS:
      return {
        ...state,
        recentTransactions: action.payload || [],
      };

    default:
      return state;
  }
};

const storeRecentTransactions = async (transactions) => {
  try {
    const jsonValue = JSON.stringify(transactions);
    await AsyncStorage.setItem("RECENT_TRANSACTIONS", jsonValue);
  } catch (error) {}
};

export default recentTransactionsReducer;
