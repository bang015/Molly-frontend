import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { FOLLOW_API, FOLLOWER, FOLLOWING, INIT } from '../utils/api-url'
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
    clearFollowList: state => {
      state.list.follower = []
      state.list.following = []
      state.list.suggest = []
    },
  },
  extraReducers: builder => {
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        state.followed = action.payload
      })
      .addCase(getSuggestFollow.fulfilled, (state, action) => {
        state.list.suggest = action.payload.suggestFollowerList
        state.followed = action.payload.followed
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        const followings = [...state.list.following, ...action.payload.followings]
        const filter = new Map(followings.map(f => [f.id, f]))
        state.list.following = Array.from(filter.values())
        state.totalPages.following = action.payload.totalPages
      })
      .addCase(getFollower.fulfilled, (state, action) => {
        const followers = [...state.list.follower, ...action.payload.followers]
        const filter = new Map(followers.map(f => [f.id, f]))
        state.list.follower = Array.from(filter.values())
        state.totalPages.follower = action.payload.totalPages
      })
  },
})

export const { clearFollowList } = followSlice.actions
export default followSlice.reducer

export const followUser = createAsyncThunk<boolean, number>(
  'follow/followUser',
  async (followUserId: number, { dispatch }) => {
    try {
      const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}`, {
        data: { followUserId },
        method: 'POST',
        headers: {},
      })
      if (response.status === 200) {
        dispatch(getUser())
      }
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getSuggestFollow = createAsyncThunk<
  {
    suggestFollowerList: FollowType[]
    followed: boolean
  },
  number
>('follow/getFollow', async (limit: number, { dispatch }) => {
  try {
    const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}`, {
      method: 'GET',
      headers: {},
      params: {
        limit: limit,
      },
    })

    return response.data
  } catch (e: any) {
    dispatch(openSnackBar(e.response.data.message))
  }
})

export const getFollowing = createAsyncThunk<
  { followings: FollowType[]; totalPages: number },
  { userId: number; page: number; keyword: string }
>(
  'follow/getFollowing',
  async (
    { userId, page, keyword }: { userId: number; page: number; keyword: string },
    { dispatch },
  ) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}/${FOLLOWING}/${userId}/?page=${page}&query=${keyword}`,
        { method: 'GET' },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getFollower = createAsyncThunk<
  { followers: FollowType[]; totalPages: number },
  { userId: number; page: number; keyword: string }
>(
  'follow/getFollower',
  async (
    { userId, page, keyword }: { userId: number; page: number; keyword: string },
    { dispatch },
  ) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${FOLLOW_API}/${FOLLOWER}/${userId}/?page=${page}&query=${keyword}`,
        { method: 'GET' },
      )
      return response.data
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
