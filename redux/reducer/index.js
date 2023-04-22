import { combineReducers } from "redux";
import expenseReducer from "./expenseReducer";
import cardReducer from "./cardReducer";
import recurrenceReducer from "./recurrenceReducer";

const rootReducer = combineReducers({
  expenseReducer,
  cardReducer,
  recurrenceReducer
});

export default rootReducer;
