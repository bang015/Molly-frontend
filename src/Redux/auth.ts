import {
  createReducer,
  createAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { userType, IUserforSignUp, updateProfile } from "../Interfaces/user";
import axios from "axios";
import { AUTH_API, INIT, USER_API } from "../Utils/api-url";
import { showSnackBar } from "./post";
import { updatedProfileSucces, updatedProfileStart } from "./profile";
import io, { Socket } from "socket.io-client";

// 액션 타입들 정의
const SET_TOKEN = "auth/SET_TOKEN";
const REMOVE_TOKEN = "auth/REMOVE_TOKEN";
const POST_USER_SUCCESS = "auth/POST_USER_SUCCESS";
const POST_USER_FAIL = "auth/POST_USER_FAIL";
const GET_USER_SUCCESS = "auth/GET_USER_SUCCESS";
const GET_USER_FAIL = "auth/GET_USER_FAIL";

const setToken = createAction<string>(SET_TOKEN); // result.data.token
const removeToken = createAction(REMOVE_TOKEN);
const postUserSuccess = createAction(POST_USER_SUCCESS);
const postUserFail = createAction(POST_USER_FAIL);
const getUserSuccess = createAction<userType>(GET_USER_SUCCESS);
const getUserFail = createAction(GET_USER_FAIL);
type AuthState = {
  isLogin: boolean;
  token: string | null;
  user: userType | null;
};

const initialState: AuthState = {
  isLogin: !!sessionStorage.getItem("token"),
  token: sessionStorage.getItem("token"),
  user: null,
};
export let socket:Socket | null = null;
const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setToken, (state, action) => {
      if (action.payload) {
        socket = io(`${process.env.REACT_APP_SERVER_URL}`);
        sessionStorage.setItem("token", action.payload);
        state.isLogin = true;
        state.token = action.payload;
      }
    })
    .addCase(removeToken, (state) => {
      sessionStorage.removeItem("token");
      state.isLogin = false;
      state.token = null;
    })
    .addCase(getUserSuccess, (state, action) => {
      if (action.payload) {
        socket = io(`${process.env.REACT_APP_SERVER_URL}`);
        state.user = action.payload;
      }
    })
    .addCase(getUserFail, (state) => {
      state.isLogin = false;
      state.token = null;
      state.user = null;
    })
    .addCase(postUserSuccess, (state) => {
      return state;
    })
    .addCase(postUserFail, (state) => {
      return state;
    })
    .addDefaultCase((state) => state);
});

export default authReducer;

export const postUser = createAsyncThunk(
  "auth/postUser",
  async (userData: IUserforSignUp) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${USER_API}`,
        userData
      );
      if (response.status === 200) {
        console.log("성공띠"); // Success case
      } else {
        console.log("실패!"); // Failure case
      }
    } catch (error) {
      console.log("실패!"); // Error case
    }
  }
);

export const postSignIn = createAsyncThunk(
  "auth/postSignIn",
  async (userData: { email: string; password: string }, { dispatch }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}`,
        userData
      );
      if (response.status === 200) {
        const result = response.data;
        dispatch(setToken(result.token));
        return result.token;
      }
      dispatch(removeToken());
      return null;
    } catch (error) {
      dispatch(removeToken());
      return null;
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { dispatch }) => {
    dispatch(removeToken());
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (token: string, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        dispatch(getUserSuccess(result));
        return result;
      } else {
        dispatch(getUserFail());
        return null;
      }
    } catch (error) {
      dispatch(getUserFail());
      return null;
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (
    { token, newInfo }: { token: string; newInfo: updateProfile },
    { dispatch }
  ) => {
    try {
      console.log(newInfo);
      const formData = new FormData();
      if (newInfo.name) formData.append("name", newInfo.name);
      if (newInfo.nickname) formData.append("nickname", newInfo.nickname);
      if (newInfo.introduce) formData.append("introduce", newInfo.introduce);
      if (newInfo.profileImg) {
        dispatch(updatedProfileStart());
        const profileImageFile = new File(
          [newInfo.profileImg],
          "profile_image.jpg"
        );
        formData.append("profile_image", profileImageFile);
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${USER_API}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        dispatch(showSnackBar(response.data.message));
        dispatch(updatedProfileSucces(response.data.user));
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
);
