import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { INIT, SEARCH_API } from '../utils/api-url'
import { resultType } from '../interfaces/search'
import { request } from './baseRequest'
import { authStore } from './auth'

interface searchState {
  result: resultType[]
  history: resultType[]
  loading: boolean
}
const initialState: searchState = {
  result: [],
  history: [],
  loading: false,
}
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    getResultStart: state => {
      state.loading = true
    },
    getResultSuccess: (state, action: PayloadAction<resultType[]>) => {
      state.loading = false
      state.result = action.payload
    },
    getHistorySuccess: (state, action: PayloadAction<resultType[]>) => {
      state.history = action.payload
    },
    resetResult: state => {
      state.result = []
    },
  },
})
export const { getResultStart, getResultSuccess, getHistorySuccess, resetResult } =
  searchSlice.actions
export default searchSlice.reducer


export const getSearchResult = createAsyncThunk(
  'search/getSearchResult',
  async ({ keyword, type }: { keyword: string; type: string }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/q/${type}/?query=${keyword}`,
        { method: 'GET' },
      )
      console.log(response.data)

      if (response.status === 200) {
        dispatch(getResultSuccess(response.data))
      }
    } catch {}
  },
)

export const saveSearchHistory = createAsyncThunk(
  'search/saveSearchHistory',
  async ({ token, result }: { token: string; result: resultType }, { dispatch }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/history`,
      { result },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.status === 200) {
      dispatch(getSearchHistory(token))
    }
  },
)

export const getSearchHistory = createAsyncThunk(
  'search/getSearchHistory',
  async (token: string, { dispatch }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/history1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.status === 200) {
      dispatch(getHistorySuccess(response.data))
    }
  },
)

export const deleteSearchHistory = createAsyncThunk(
  'search/deleteSearchHistory',
  async ({ token, history }: { token: string; history: string | null }, { dispatch }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/history`,
      {
        params: { history },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.status === 200) {
      dispatch(getSearchHistory(token))
    }
  },
)
