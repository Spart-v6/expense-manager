import * as constants from "../actions/constants";

const initialState = {
    expenses: []
}

const transactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ADD_DATA:
      console.log("adding", action, " ", state);
      return { 
        ...state, 
        expenses: action.payload
      }
    case constants.UPDATE_DATA:
      return state.map((item) =>
        item.key === action.payload.key ? action.payload : item
      );
    case constants.DELETE_DATA:
      return state.filter((item) => item.key !== action.payload);
    case constants.GET_DATA:
      return state;
    default:
      return state;
  }
};

export default transactionsReducer;