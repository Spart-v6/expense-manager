import { combineReducers } from "redux";
import expenseReducer from "./expenseReducer";
import cardReducer from "./cardReducer";

const rootReducer = combineReducers({
  expenseReducer,
  cardReducer
});

export default rootReducer;
