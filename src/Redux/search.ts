import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, SEARCH_API } from "../Utils/api-url";
import { resultType } from "../Interfaces/search";

interface searchState {
  result: resultType[];
  loading: boolean
}
const initialState: searchState = {
  result: [],
  loading: false
};
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    getResultStart: (state) => {
      state.loading = true
    },
    getResultSuccess: (state, action: PayloadAction<resultType[]>) => {
      state.loading = false;
      state.result = action.payload;
    },
    resetResult: (state) => {
      state.result = []
    },
  },
});
export const {getResultStart, getResultSuccess, resetResult } = searchSlice.actions;
export default searchSlice.reducer;

export const getSearchResult = createAsyncThunk(
  "search/getSearchResult",
  async (keyword: string, { dispatch }) => {
    console.log(keyword)

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${SEARCH_API}/?query=${keyword}`
      );
      if(response.status === 200) {
        dispatch(getResultSuccess(response.data));
      }
    } catch {

    }
  }
);
