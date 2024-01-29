import { combineReducers } from "redux";
import authReducer from "./auth";
import followReducer from "./follow";
import postListReducer from "./postList";
const rootReducer = combineReducers({
  authReducer,
  followReducer,
  postListReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;