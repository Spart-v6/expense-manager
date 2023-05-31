import { combineReducers } from "redux";
import expenseReducer from "./expenseReducer";
import cardReducer from "./cardReducer";
import recurrenceReducer from "./recurrenceReducer";
import groupsReducer from "./groupsReducer";
import sectionReducer from "./sectionReducer";
import recurrTypeReducer from "./recurrTypeReducer";

const rootReducer = combineReducers({
  expenseReducer,
  cardReducer,
  recurrenceReducer,
  groupsReducer,
  sectionReducer,
  recurrTypeReducer
});

export default rootReducer;
