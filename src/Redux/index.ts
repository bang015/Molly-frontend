import { combineReducers } from 'redux'
import authReducer from './auth'
import followReducer from './follow'
import postListReducer from './postList'
import commentReducer from './comment'
import postReducer from './post'
import userReducer from './user'
import searchReducer from './search'
import modalReducer from './modal'

const rootReducer = combineReducers({
  authReducer,
  followReducer,
  postListReducer,
  commentReducer,
  postReducer,
  userReducer,
  searchReducer,
  modalReducer,
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
