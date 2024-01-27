import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FOLLOW_API, INIT } from "../Utils/api-url";
import { suggestFollower } from "../Interfaces/user";
interface FollowState {
  suggestList: suggestFollower[];
  followingUser: suggestFollower[];
  followLoading: boolean;
  followed: boolean;
}

const initialState: FollowState = {
  suggestList: [],
  followingUser: [],
  followLoading: false,
  followed : false
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    followUserStart: (state) => {
      state.followLoading = true;
    },
    followUserSuccess: (state, action: PayloadAction<suggestFollower[]>) => {
      state.followLoading = false;
      state.followingUser = action.payload;
    },
    followUserFailure: (state) => {
      state.followLoading = false;
      // 실패 시 처리
    },
    getFollowSuccess: (
      state,
      action: PayloadAction<{
        followingUser: suggestFollower[];
        suggestFollowerList: suggestFollower[];
        followed: boolean;
      }>
    ) => {
      state.followingUser = action.payload.followingUser;
      state.suggestList = action.payload.suggestFollowerList;
      state.followed = action.payload.followed;
    },
  },
});

export const { followUserStart, followUserSuccess, followUserFailure,getFollowSuccess } =
  followSlice.actions;
export default followSlice.reducer;

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (
    { token, followUserId }: { token: string; followUserId: number },
    { dispatch }
  ) => {
    try {
      dispatch(followUserStart());
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}`,
        { followUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        dispatch(followUserSuccess(result));
      }
    } catch (err) {
      dispatch(followUserFailure());
    }
  }
);

export const getFollow = createAsyncThunk(
  "follow/getFollow",
  async (token: string, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        dispatch(getFollowSuccess(result));
      }
    } catch (err) {}
  }
);
