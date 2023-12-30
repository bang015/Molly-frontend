import { createReducer, createAction } from '@reduxjs/toolkit';
import { userType } from '../Interfaces/user';
import { Dispatch } from 'redux';
import axios from 'axios';

// 액션 타입들 정의
const SET_TOKEN = 'auth/SET_TOKEN';
const REMOVE_TOKEN = 'auth/REMOVE_TOKEN';
const POST_USER_SUCCESS = 'auth/POST_USER_SUCCESS';
const POST_USER_FAIL = 'auth/POST_USER_FAIL';
const GET_USER_SUCCESS = 'auth/GET_USER_SUCCESS';
const GET_USER_FAIL = 'auth/GET_USER_FAIL';

const setToken = createAction<string>(SET_TOKEN); // result.data.token
const removeToken = createAction(REMOVE_TOKEN);
const postUserSuccess = createAction(POST_USER_SUCCESS);
const postUserFail = createAction(POST_USER_FAIL);
const getUserSuccess = createAction<userType>(GET_USER_SUCCESS); // Modify 'any' to your expected user type
const getUserFail = createAction(GET_USER_FAIL);


type AuthState = {
  isLogin: boolean,
  token: string|null,
  user: userType|null
}

const initialState : AuthState = {
  isLogin : !!localStorage.getItem("token"),
  token : localStorage.getItem("token"),
  user : null
}

const authReducer = createReducer(initialState, builder => {
  builder
    .addCase(setToken, (state, action) => {
      if (action.payload) {
        localStorage.setItem('token', action.payload);
        state.isLogin = true;
        state.token = action.payload;
      }
    })
    .addCase(removeToken, state => {
      localStorage.removeItem('token');
      state.isLogin = false;
      state.token = null;
      state.user = null;
    })
    .addCase(getUserSuccess, (state, action) => {
      if(action.payload){
        state.user = action.payload
      }
    })
    .addCase(getUserFail, (state, action) => {
      state.isLogin = false;
      state.token = null;
      state.user = null;
    })
    .addDefaultCase(state => state);
});

export default authReducer;

export const postUser = (userData: userType) =>{
  return async (dispatch : Dispatch) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth',
        userData
      );
      if(response.status === 200){
        dispatch(postUserSuccess());
        return response.status;
      }
    }catch(error){
      dispatch(postUserFail());
      return null;
    }
  }
}