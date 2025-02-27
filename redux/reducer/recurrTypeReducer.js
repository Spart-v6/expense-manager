import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  recurrTypes: [{ name: "Rent" }, { name: "Income" }, { name: "Spotify" }],
  allRecurrTypes: [{ name: "Rent" }, { name: "Income" }, { name: "Spotify" }],
};

const recurrTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_RECURR_TYPE:
      const newRecurrType = { name: action.payload.name };
      AsyncStorage.setItem(
        "ALL_RECURR_TYPES",
        JSON.stringify([...state.allRecurrTypes, newRecurrType])
      );
      return {
        recurrTypes: [...state.recurrTypes, newRecurrType],
        allRecurrTypes: [...state.allRecurrTypes, newRecurrType],
      };

    case types.STORE_RECURR_TYPE:
      return {
        ...state,
        allRecurrTypes: action.payload,
      };

    default:
      return state;
  }
};

export default recurrTypeReducer;
