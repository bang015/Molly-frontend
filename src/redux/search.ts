import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { INIT, SEARCH_API } from '../utils/api-url'
import { ResultType } from '../interfaces/search'
import { request } from './baseRequest'

interface searchState {
  result: ResultType[]
  history: ResultType[]
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
    getResultSuccess: (state, action: PayloadAction<ResultType[]>) => {
      state.loading = false
      state.result = action.payload
    },
    getHistorySuccess: (state, action: PayloadAction<ResultType[]>) => {
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
        `${import.meta.env.VITE_SERVER_URL}${INIT}${SEARCH_API}/${type}?query=${keyword}`,
        { method: 'GET', headers: {} },
      )
      if (response.status === 200) {
        dispatch(getResultSuccess(response.data))
      }
    } catch {}
  },
)

export const saveSearchHistory = createAsyncThunk(
  'search/saveSearchHistory',
  async ({ result }: { result: ResultType }, { dispatch }) => {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${SEARCH_API}/history`,
      {
        method: 'POST',
        data: result,
        headers: {},
      },
    )
    if (response.status === 200) {
      dispatch(getSearchHistory())
    }
  },
)

export const getSearchHistory = createAsyncThunk(
  'search/getSearchHistory',
  async (_, { dispatch }) => {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${SEARCH_API}/history`,
      {
        method: 'GET',
        headers: {},
      },
    )
    if (response.status === 200) {
      dispatch(getHistorySuccess(response.data))
    }
  },
)

export const deleteSearchHistory = createAsyncThunk(
  'search/deleteSearchHistory',
  async ({ history }: { history: ResultType | null }, { dispatch }) => {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${SEARCH_API}/history`,
      {
        method: 'DELETE',
        data: history,
        headers: {},
      },
    )
    if (response.status === 200) {
      dispatch(getSearchHistory())
    }
  },
)
