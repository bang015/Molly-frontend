import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FOLLOW_API, INIT } from "../Utils/api-url";

interface FollowState {
  followedUsers: number[];
  followLoading: boolean;
}

const initialState: FollowState = {
  followedUsers: [],
  followLoading: false,
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    followUserStart: (state) => {
      state.followLoading = true;
    },
    followUserSuccess: (state, action: PayloadAction<number>) => {
      state.followLoading = false;
      state.followedUsers.push(action.payload);
    },
    followUserFailure: (state) => {
      state.followLoading = false;
      // 실패 시 처리
    },
  },
});

export const { followUserStart, followUserSuccess, followUserFailure } = followSlice.actions;
export default followSlice.reducer;

export const followUser = createAsyncThunk(
  'follow/followUser',
  async ({token,userId} : {token: string, userId: number}) => {
    try{
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}`,
        userId
      )
      if(response.status === 200){
        const result = response.data;
        
      }
    }catch(err){

    }
  }
)
