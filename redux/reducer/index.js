import { combineReducers } from "redux";
import expenseReducer from "./expenseReducer";

const rootReducer = combineReducers({
  expenseReducer,
});

export default rootReducer;
