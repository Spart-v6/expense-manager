import { constants as types } from "../actionTypes";

const initialState = {
  expenses: [],
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_DATA:
      return {
        expenses: [...state.expenses, action.payload],
      };
    case types.UPDATE_DATA:
      return state.map((item) =>
        item.key === action.payload.key ? action.payload : item
      );
    case types.DELETE_DATA:
      return state.filter((item) => item.key !== action.payload);
    case types.GET_DATA:
      return state;
    default:
      return state;
  }
};

export default expenseReducer;
