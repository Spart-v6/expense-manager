import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  groups: [],
  allGroups: [],
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_GROUPS:
      // AsyncStorage.removeItem("ALL_GROUPS");
      const allGroups = state.allGroups || [];
      let updatedGroups = [];

      updatedGroups = [...allGroups, action.payload];

      AsyncStorage.setItem("ALL_GROUPS", JSON.stringify(updatedGroups));
      return {
        ...state,
        allGroups: updatedGroups,
      };
    case types.DELETE_GROUPS:
      const identity = action.payload;
      const updatedArray = state.allGroups?.filter((innerArray) => {
        return !innerArray.some((obj) => obj.identity === identity);
      });

      AsyncStorage.setItem("ALL_GROUPS", JSON.stringify(updatedArray));
      return { ...state, allGroups: updatedArray || [] };
    case types.STORE_GROUPS:
      return {
        ...state,
        allGroups: action.payload || [],
      };
    default:
      return state;
  }
};

export default groupsReducer;
