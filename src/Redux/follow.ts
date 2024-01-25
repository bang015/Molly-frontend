import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FOLLOW_API, INIT } from "../Utils/api-url";
import { suggestFollower } from "../Interfaces/user";
import { useDispatch } from "react-redux";
interface FollowState {
  followedUsers: suggestFollower[];
  followLoading: boolean;
}

const initialState: FollowState = {
  followedUsers: [],
  followLoading: false,
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
      state.followedUsers=action.payload;
    },
    followUserFailure: (state) => {
      state.followLoading = false;
      // 실패 시 처리
    },
  },
});

export const { followUserStart, followUserSuccess, followUserFailure } =
  followSlice.actions;
export default followSlice.reducer;

export const followUser = createAsyncThunk(
  "follow/followUser",
  async ({ token, followUserId }: { token: string; followUserId: number }, { dispatch }) => {
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
