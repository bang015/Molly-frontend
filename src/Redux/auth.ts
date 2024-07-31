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
  userLoading: boolean
}

const initialState: AuthState = {
  isLogin: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  user: null,
  userLoading: false,
}
export let socket: Socket | null = null

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token>) => {
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
      socket?.disconnect()
    },
    refreshTokens: (state, action: PayloadAction<Token>) => {
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      state.accessToken = action.payload.accessToken
    },
    getUserSuccess: (state, action) => {
      state.user = action.payload
      state.userLoading = false
    },
    getUserFail: state => {
      state.isLogin = false
      state.accessToken = null
      state.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      socket?.disconnect()
    },
  },
})
export const { setTokens, removeTokens, refreshTokens, getUserSuccess, getUserFail } =
  authSlice.actions
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
        console.log(result)
        dispatch(setTokens(result))
        return ''
      }
    } catch (e: any) {
      dispatch(removeTokens())
      return e.response.data.message
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
    const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
    if (response.status === 200) {
      const result = response.data
      dispatch(getUserSuccess(result))
    }
  } catch (e: any) {
    dispatch(getUserFail())
  }
})
// 소켓 연결
export const initializeSocket = (token: string) => {
  socket = io(`${process.env.REACT_APP_SERVER_URL}`, {
    auth: { token },
  })
}
// refreshToken
export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { dispatch }) => {
  console.log('refresh')
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${AUTH_API}${REFRESH_TOKEN}`,
      { refreshToken: localStorage.getItem('refreshToken') },
    )
    if (response.status === 200) {
      dispatch(refreshTokens(response.data))
      if (socket) {
        socket.disconnect()
        initializeSocket(response.data)
      }
      return response.data.accessToken
    }
  } catch (e) {
    dispatch(removeTokens())
  }
})
