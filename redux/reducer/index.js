import { combineReducers } from "redux";
import expenseReducer from "./expenseReducer";
import cardReducer from "./cardReducer";
import recurrenceReducer from "./recurrenceReducer";
import groupsReducer from "./groupsReducer";
import sectionReducer from "./sectionReducer";
import recurrTypeReducer from "./recurrTypeReducer";
import recentTransactionsReducer from "./recentTransReducer";
import smsReducer from "./smsReducer";

const rootReducer = combineReducers({
  expenseReducer,
  cardReducer,
  recurrenceReducer,
  groupsReducer,
  sectionReducer,
  recurrTypeReducer,
  recentTransactionsReducer,
  smsReducer,
});

export default rootReducer;
