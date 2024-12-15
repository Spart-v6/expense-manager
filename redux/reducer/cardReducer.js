import { constants as types } from "../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  cards: [],
  allCards: [],
};

const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_CARD: {
      const allCards = state.allCards || [];
      const updatedCards = [
        ...allCards,
        ...(Array.isArray(action.payload) ? action.payload : [action.payload]),
      ];

      AsyncStorage.setItem(
        "ALL_CARDS",
        JSON.stringify(updatedCards)
      );
      return {
        ...state,
        allCards: updatedCards,
      };
    }
    case types.UPDATE_CARD:
      const { sameId, updatedCard } = action.payload;
      const index = state.allCards.findIndex(obj => obj.id === sameId);
      if (index !== -1) {
        const updatedObjects = [...state.allCards];
        updatedObjects[index] = { ...updatedObjects[index], ...updatedCard };
        AsyncStorage.setItem("ALL_CARDS", JSON.stringify(updatedObjects));
        return { ...state, allCards: updatedObjects };
      }
      return state;

    case types.DELETE_CARD:
      const id = action.payload;
      const updatedArray = state.allCards?.filter((obj) => obj.id !== id);

      AsyncStorage.setItem("ALL_CARDS", JSON.stringify(updatedArray));
      return { ...state, allCards: updatedArray };

    case types.STORE_CARD:
      return {
        ...state,
        allCards: action.payload,
      };

    default:
      return state;
  }
};

export default cardReducer;
