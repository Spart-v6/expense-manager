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
      const newRecurrence = { ...action.payload, processedDates: [] }; // Add processedDates
      AsyncStorage.setItem(
        "ALL_RECURRENCES",
        JSON.stringify([...allRecurrences, newRecurrence])
      );
      return {
        ...state,
        allRecurrences: [...allRecurrences, newRecurrence],
      };
    
    case types.UPDATE_RECURRENCE:
      const { sameId, updatedRecurrence, updatedLastProcessedDate } = action.payload;
      const updatedRecurrences = state.allRecurrences.map((recurrence) => {
        if (recurrence.id === sameId) {
          return {
            ...recurrence,
            recurrenceStartDate: updatedRecurrence,
            processedDates: [...(recurrence.processedDates || []), updatedLastProcessedDate],
          };
        }
        return recurrence;
      });
    
      AsyncStorage.setItem("ALL_RECURRENCES", JSON.stringify(updatedRecurrences));
      return { ...state, allRecurrences: updatedRecurrences };

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
