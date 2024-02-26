import { combineReducers } from "redux";
import authReducer from "./auth";
import followReducer from "./follow";
import postListReducer from "./postList";
import commentReducer from "./comment";
import postReducer from "./post";
import profileReducer from "./profile";
const rootReducer = combineReducers({
  authReducer,
  followReducer,
  postListReducer,
  commentReducer,
  postReducer,
  profileReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;