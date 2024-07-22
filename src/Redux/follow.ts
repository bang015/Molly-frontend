import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { FOLLOW_API, INIT } from '../utils/api-url'
import { followType } from '../interfaces/follow'
import { request } from './baseRequest'
import { authStore } from './auth'

interface checkFollowedState {
  check: boolean
  followUserId: number | null
}
interface FollowState {
  suggestList: followType[]
  followingUser: followType[]
  followerUser: followType[]
  followLoading: boolean
  followed: boolean
  checkFollowed: checkFollowedState
}

const initialState: FollowState = {
  suggestList: [],
  followingUser: [],
  followerUser: [],
  followLoading: false,
  followed: false,
  checkFollowed: { check: false, followUserId: null },
}

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    followUserStart: state => {
      state.followLoading = true
    },
    followUserSuccess: (state, action: PayloadAction<checkFollowedState>) => {
      state.followLoading = false
      state.checkFollowed = action.payload
    },
    followUserFailure: state => {
      state.followLoading = false
    },
    getSuggestFollowSuccess: (
      state,
      action: PayloadAction<{
        suggestFollowerList: followType[]
        followed: boolean
      }>,
    ) => {
      state.suggestList = action.payload.suggestFollowerList
      state.followed = action.payload.followed
    },
    getFollowingSuccess: (state, action: PayloadAction<followType[]>) => {
      state.followingUser = [...state.followingUser, ...action.payload]
    },
    getFollowerSuccess: (state, action: PayloadAction<followType[]>) => {
      state.followerUser = [...state.followerUser, ...action.payload]
    },
    clearFollowList: state => {
      state.followingUser = []
      state.followerUser = []
      state.suggestList = []
    },
  },
})

export const {
  followUserStart,
  followUserSuccess,
  followUserFailure,
  getSuggestFollowSuccess,
  getFollowingSuccess,
  getFollowerSuccess,
  clearFollowList,
} = followSlice.actions
export default followSlice.reducer

export const followUser = createAsyncThunk(
  'follow/followUser',
  async ({ followUserId }: { followUserId: number }, { dispatch }) => {
    try {
      dispatch(followUserStart())
      const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}`, {
        data: followUserId,
        method: 'POST',
        headers: {},
      })
      if (response.status === 200) {
        const result = response.data
        dispatch(followUserSuccess(result))
      }
    } catch (err) {
      dispatch(followUserFailure())
    }
  },
)

export const getSuggestFollow = createAsyncThunk(
  'follow/getFollow',
  async ({ token, limit }: { token: string; limit: number }, { dispatch }) => {
    try {
      const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: limit,
        },
      })
      if (response.status === 200) {
        const result = response.data
        dispatch(getSuggestFollowSuccess(result))
      }
    } catch (err) {}
  },
)

export const getFollowing = createAsyncThunk(
  'follow/getFollowing',
  async (
    { userId, page, keyword }: { userId: number; page: number; keyword: string },
    { dispatch },
  ) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}/${userId}/?page=${page}&query=${keyword}`,
      )
      if (response.status === 200) {
        dispatch(getFollowingSuccess(response.data))
      }
    } catch {}
  },
)

export const getFollower = createAsyncThunk(
  'follow/getFollower',
  async (
    { userId, page, keyword }: { userId: number; page: number; keyword: string },
    { dispatch },
  ) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}/r/${userId}/?page=${page}&query=${keyword}`,
      )
      if (response.status === 200) {
        dispatch(getFollowerSuccess(response.data))
      }
    } catch {}
  },
)
export const followedCheck = async (userId: number) => {
  try {
    const response = await request(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${FOLLOW_API}/check/${userId}`,
      {
        method: 'GET',
        headers: {},
      },
    )
    if (response.status === 200) {
      return response.data
    }
  } catch {}
}
