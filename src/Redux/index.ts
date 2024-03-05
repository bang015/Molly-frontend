import { combineReducers } from "redux";
import authReducer from "./auth";
import followReducer from "./follow";
import postListReducer from "./postList";
import commentReducer from "./comment";
import postReducer from "./post";
import profileReducer from "./profile";
import searchReducer from"./search";
const rootReducer = combineReducers({
  authReducer,
  followReducer,
  postListReducer,
  commentReducer,
  postReducer,
  profileReducer,
  searchReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;