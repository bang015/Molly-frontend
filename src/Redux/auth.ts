import { configureStore, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../interfaces/user'
import axios from 'axios'
import { AUTH_API, INIT, REFRESH_TOKEN, SIGN_IN, SIGN_UP } from '../utils/api-url'
import io, { Socket } from 'socket.io-client'
import { SignUpInput, Token } from '@/interfaces/auth'
import { request } from './baseRequest'

interface AuthState {
  isLogin: boolean
  accessToken: string | null
  user: UserType | null
}

const initialState: AuthState = {
  isLogin: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  user: null,
}
export let socket: Socket | null = null

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token>) => {
      socket = io(`${process.env.REACT_APP_SERVER_URL}`)
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      state.isLogin = true
      state.accessToken = action.payload.accessToken
    },
    removeTokens: state => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      state.isLogin = false
      state.accessToken = null
      state.user = null
    },
    refreshTokens: (state, action: PayloadAction<Token>) => {
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      state.accessToken = action.payload.accessToken
    },
    getUserSuccess: (state, action) => {
      socket = io(`${process.env.REACT_APP_SERVER_URL}`)
      state.user = action.payload
    },
    getUserFail: state => {
      state.isLogin = false
      state.accessToken = null
      state.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
})
export const { setTokens, removeTokens, refreshTokens, getUserSuccess, getUserFail } = authSlice.actions
export const authStore = configureStore({ reducer: authSlice.reducer })
export default authSlice.reducer

// 회원가입
export const createUser = createAsyncThunk(
  'auth/createUser',
  async (data: SignUpInput, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}${SIGN_UP}`,
        {
          method: 'POST',
          data,
        },
      )
      if (response.status === 200) {
        dispatch(setTokens(response.data))
      }
    } catch (e: any) {
      return false
    }
  },
)

// 로그인
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data: { email: string; password: string }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}${SIGN_IN}`,
        {
          method: 'POST',
          data,
        },
      )
      if (response.status === 200) {
        const result = response.data
        dispatch(setTokens(result))
        return result.token
      }
    } catch (error: any) {
      console.log(error.response.data)
      dispatch(removeTokens())
      return null
    }
  },
)

// 로그아웃
export const signOut = createAsyncThunk('auth/signOut', async (_, { dispatch }) => {
  dispatch(removeTokens())
})

// 유저 정보
export const getUser = createAsyncThunk('auth/getUser', async (_, { dispatch }) => {
  try {
    const response = await request(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      },
    )
    if (response.status === 200) {
      const result = response.data
      dispatch(getUserSuccess(result))
      return result
    } else {
      dispatch(getUserFail())
      return null
    }
  } catch (error: any) {
    console.log(error);
    dispatch(getUserFail())
    return null
  }
})
// refreshToken
export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { dispatch }) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}${REFRESH_TOKEN}`,
      { refreshToken: localStorage.getItem('refreshToken') },
    )
    if (response.status === 200) {
      dispatch(refreshTokens(response.data))
      return response.data.accessToken;
    }
  } catch (e) {
    console.log(e)
    dispatch(removeTokens())
  }
})
