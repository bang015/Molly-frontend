import { combineReducers } from "redux";
import authReducer from "./auth";
import followReducer from "./follow";
const rootReducer = combineReducers({
  authReducer,
  followReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;