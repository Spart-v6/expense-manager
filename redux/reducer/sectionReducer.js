import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  sections: [],
  allSections: [],
};

const sectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_SECTIONS:
      // AsyncStorage.setItem(
      //   "ALL_SECTIONS",
      //   JSON.stringify([...state.allSections, action.payload])
      // );
      // return {
      //   sections: [...state.sections, action.payload],
      // };
      const newSection = action.payload;
      const updatedAllSections = [...state.allSections, newSection];
      AsyncStorage.setItem("ALL_SECTIONS", JSON.stringify(updatedAllSections));
      return {
        sections: [...state.sections, newSection],
        allSections: updatedAllSections,
      };

    case types.DELETE_SECTIONS:
      const id = action.payload;
      const updatedArray = state.allSections?.filter(
        (arr) => !arr.some((obj) => obj.id === id)
      );

      AsyncStorage.setItem("ALL_SECTIONS", JSON.stringify(updatedArray));
      return { ...state, allSections: updatedArray };

    case types.DELETE_GROUP_AND_SECTIONS:
      const idToDelete = action.payload;

      const updatedSections = state.allSections?.filter(
        (arr) => !arr.some((obj) => idToDelete.includes(obj.id))
      );

      if (updatedSections && updatedSections.length > 0) {
        AsyncStorage.setItem("ALL_SECTIONS", JSON.stringify(updatedSections));
      }

      return {
        ...state,
        allSections: updatedSections,
      };

    case types.STORE_SECTIONS:
      return {
        ...state,
        allSections: action.payload,
      };

    default:
      return state;
  }
};

export default sectionReducer;
