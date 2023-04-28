import { combineReducers } from "redux";
import expenseReducer from "./expenseReducer";
import cardReducer from "./cardReducer";
import recurrenceReducer from "./recurrenceReducer";
import groupsReducer from "./groupsReducer";

const rootReducer = combineReducers({
  expenseReducer,
  cardReducer,
  recurrenceReducer,
  groupsReducer
});

export default rootReducer;
