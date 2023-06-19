import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  recurrences: [],
  allRecurrences: [],
};

const recurrenceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_RECURRENCE:
      const allRecurrences = state.allRecurrences || [];
      AsyncStorage.setItem(
        "ALL_RECURRENCES",
        JSON.stringify([...allRecurrences, action.payload])
      );
      return {
        ...state,
        allRecurrences: [...allRecurrences, action.payload],
      };
    case types.UPDATE_RECURRENCE:
      const { sameId, updatedRecurrence } = action.payload;
      const updatedObjects = state.allRecurrences.map((obj) => {
        if (obj.id === sameId) {
          return { ...obj, recurrenceStartDate: updatedRecurrence };
        }
        return obj;
      });
      AsyncStorage.setItem("ALL_RECURRENCES", JSON.stringify(updatedObjects));
      return { ...state, allRecurrences: updatedObjects };

    case types.DELETE_RECURRENCE:
      const id = action.payload;
      const updatedArray = state.allRecurrences?.filter((obj) => obj.id !== id);

      AsyncStorage.setItem("ALL_RECURRENCES", JSON.stringify(updatedArray));
      return { ...state, allRecurrences: updatedArray || [] };
    case types.STORE_RECURRENCE:
      return {
        ...state,
        allRecurrences: action.payload || [],
      };
    default:
      return state;
  }
};

export default recurrenceReducer;
