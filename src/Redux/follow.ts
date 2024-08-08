import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { FOLLOW_API, INIT } from '../utils/api-url'
import { FollowType } from '../interfaces/follow'
import { request } from './baseRequest'
import { getUser } from './auth'
import { openSnackBar } from './snackBar'

interface FollowState {
  list: {
    suggest: FollowType[]
    follower: FollowType[]
    following: FollowType[]
  }
  followed: boolean
  totalPages: {
    follower: number
    following: number
  }
}

const initialState: FollowState = {
  list: {
    suggest: [],
    follower: [],
    following: [],
  },
  followed: false,
  totalPages: {
    follower: 0,
    following: 0,
  },
}

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    followUserSuccess: (state, action: PayloadAction<boolean>) => {
      state.followed = action.payload
    },

    getSuggestFollowSuccess: (
      state,
      action: PayloadAction<{
        suggestFollowerList: FollowType[]
        followed: boolean
      }>,
    ) => {
      state.list.suggest = action.payload.suggestFollowerList
      state.followed = action.payload.followed
    },
    getFollowingSuccess: (
      state,
      action: PayloadAction<{ followings: FollowType[]; totalPages: number }>,
    ) => {
      state.list.following = [...state.list.following, ...action.payload.followings]
      state.totalPages.following = action.payload.totalPages
    },
    getFollowerSuccess: (
      state,
      action: PayloadAction<{ followers: FollowType[]; totalPages: number }>,
    ) => {
      state.list.follower = [...state.list.follower, ...action.payload.followers]
      state.totalPages.follower = action.payload.totalPages
    },
    clearFollowList: state => {
      state.list.follower = []
      state.list.following = []
      state.list.suggest = []
    },
  },
})

export const {
  followUserSuccess,
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
      const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}`, {
        data: { followUserId },
        method: 'POST',
        headers: {},
      })
      if (response.status === 200) {
        const result = response.data
        dispatch(followUserSuccess(result))
        dispatch(getUser())
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getSuggestFollow = createAsyncThunk(
  'follow/getFollow',
  async ({ limit }: { limit: number }, { dispatch }) => {
    try {
      const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}`, {
        method: 'GET',
        headers: {},
        params: {
          limit: limit,
        },
      })
      if (response.status === 200) {
        const result = response.data
        dispatch(getSuggestFollowSuccess(result))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getFollowing = createAsyncThunk(
  'follow/getFollowing',
  async (
    { userId, page, keyword }: { userId: number; page: number; keyword: string },
    { dispatch },
  ) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}/${userId}/?page=${page}&query=${keyword}`,
        { method: 'GET' },
      )
      if (response.status === 200) {
        dispatch(getFollowingSuccess(response.data))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getFollower = createAsyncThunk(
  'follow/getFollower',
  async (
    { userId, page, keyword }: { userId: number; page: number; keyword: string },
    { dispatch },
  ) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}/r/${userId}/?page=${page}&query=${keyword}`,
        { method: 'GET' },
      )
      if (response.status === 200) {
        dispatch(getFollowerSuccess(response.data))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
export const followedCheck = async (userId: number) => {
  try {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}/check/${userId}`,
      {
        method: 'GET',
        headers: {},
      },
    )
    if (response.status === 200) {
      return response.data
    }
  } catch (e: any) {
    alert(e.response.data.message)
  }
}
