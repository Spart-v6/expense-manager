import { combineReducers } from "redux";
import expenseReducer from "./expenseReducer";
import cardReducer from "./cardReducer";
import recurrenceReducer from "./recurrenceReducer";
import groupsReducer from "./groupsReducer";
import sectionReducer from "./sectionReducer";

const rootReducer = combineReducers({
  expenseReducer,
  cardReducer,
  recurrenceReducer,
  groupsReducer,
  sectionReducer
});

export default rootReducer;
