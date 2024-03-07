import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, SEARCH_API } from "../Utils/api-url";
import { resultType } from "../Interfaces/search";

interface searchState {
  result: resultType[];
  history: resultType[];
  loading: boolean;
}
const initialState: searchState = {
  result: [],
  history: [],
  loading: false,
};
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    getResultStart: (state) => {
      state.loading = true;
    },
    getResultSuccess: (state, action: PayloadAction<resultType[]>) => {
      state.loading = false;
      state.result = action.payload;
    },
    getHistorySuccess: (state, action: PayloadAction<resultType[]>) => {
      state.history = action.payload;
    },
    resetResult: (state) => {
      state.result = [];
    },
  },
});
export const {
  getResultStart,
  getResultSuccess,
  getHistorySuccess,
  resetResult,
} = searchSlice.actions;
export default searchSlice.reducer;
export const getSearchResult = createAsyncThunk(
  "search/getSearchResult",
  async (keyword: string, { dispatch }) => {
    console.log(keyword);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/?query=${keyword}`
      );
      if (response.status === 200) {
        dispatch(getResultSuccess(response.data));
      }
    } catch {}
  }
);

export const saveSearchHistory = createAsyncThunk(
  "search/saveSearchHistory",
  async (
    { token, result }: { token: string; result: resultType },
    { dispatch }
  ) => {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/history`,
      { result },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch(getSearchHistory(token));
    }
  }
);

export const getSearchHistory = createAsyncThunk(
  "search/getSearchHistory",
  async (token: string, { dispatch }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch(getHistorySuccess(response.data));
    }
  }
);
export const deleteSearchHistory = createAsyncThunk(
  "search/deleteSearchHistory",
  async (
    { token, history }: { token: string; history: string | null },
    { dispatch }
  ) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/history`,
      {
        params: { history },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      dispatch(getSearchHistory(token));
    }
  }
);
