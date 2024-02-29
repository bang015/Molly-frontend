import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FOLLOW_API, INIT } from "../Utils/api-url";
import { followType } from "../Interfaces/follow";

interface checkFollowedState {
  check: boolean;
  followUserId: number | null;
}
interface FollowState {
  suggestList: followType[];
  followingUser: followType[];
  followerUser: followType[];
  followLoading: boolean;
  followed: boolean;
  chekcFollowed: checkFollowedState;
}

const initialState: FollowState = {
  suggestList: [],
  followingUser: [],
  followerUser: [],
  followLoading: false,
  followed: false,
  chekcFollowed: { check: false, followUserId: null },
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    followUserStart: (state) => {
      state.followLoading = true;
    },
    followUserSuccess: (state, action: PayloadAction<checkFollowedState>) => {
      state.followLoading = false;
      state.chekcFollowed = action.payload;
    },
    followUserFailure: (state) => {
      state.followLoading = false;
      // 실패 시 처리
    },
    getSuggestFollowSuccess: (
      state,
      action: PayloadAction<{
        suggestFollowerList: followType[];
        followed: boolean;
      }>
    ) => {
      state.suggestList = action.payload.suggestFollowerList;
      state.followed = action.payload.followed;
    },
    getFollowingSuccess: (state, action: PayloadAction<followType[]>) => {
      state.followingUser = [...state.followingUser, ...action.payload];
    },
    getFollowerSuccess: (state, action: PayloadAction<followType[]>) => {
      state.followerUser = [...state.followerUser, ...action.payload];
    },
    clearFollowList: (state) => {
      state.followingUser = [];
      state.followerUser = [];
    },
  },
});

export const {
  followUserStart,
  followUserSuccess,
  followUserFailure,
  getSuggestFollowSuccess,
  getFollowingSuccess,
  getFollowerSuccess,
  clearFollowList,
} = followSlice.actions;
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

export const getSuggestFollow = createAsyncThunk(
  "follow/getFollow",
  async ({ token, limit }: { token: string; limit: number }, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: limit,
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        dispatch(getSuggestFollowSuccess(result));
      }
    } catch (err) {}
  }
);

export const getFollowing = createAsyncThunk(
  "follow/getFollowing",
  async ({userId, page, keyword}: {userId: number, page: number, keyword: string}, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}/${userId}/?page=${page}&query=${keyword}`
      );
      if (response.status === 200) {
        dispatch(getFollowingSuccess(response.data));
      }
    } catch {}
  }
);

export const getFollower = createAsyncThunk(
  "follow/getFollower",
  async ({userId, page, keyword}: {userId: number, page: number, keyword: string}, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}/r/${userId}/?page=${page}&query=${keyword}`
      );
      if (response.status === 200) {
        dispatch(getFollowerSuccess(response.data));
      }
    } catch {}
  }
)
export const followedCheck = async (token: string, userId: number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}/check/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch {}
};
