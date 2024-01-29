import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, POST_API } from "../Utils/api-url";
import { postListType } from "../Interfaces/post";

interface postListState{
  allPostList: postListType[];
  getListLoading : boolean;
}

const initialState: postListState = {
  allPostList : [],
  getListLoading : false,
}
const postListSlice = createSlice({
  name: "postList",
  initialState,
  reducers: {
    getListStart: (state) => {
      state.getListLoading = true;
    },
    getAllPostList: (state, action: PayloadAction<postListType[]>) => {
      state.getListLoading = false;
      state.allPostList = [...state.allPostList, ...action.payload];
    },
    getListfailure: (state) => {
      state.getListLoading = false;
    }
  }
});

export const { getListStart, getAllPostList, getListfailure } =
postListSlice.actions;
export default postListSlice.reducer;

export const getAllPost = createAsyncThunk(
  'postList/getAllPost',
  async(page : number , {dispatch}) => {
    dispatch(getListStart());
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}?page=${page}`,
      )
      if(response.status === 200){
        const result = response.data;
        dispatch(getAllPostList(result));
      }else{
        dispatch(getListfailure());
      }
    }catch(err){
      dispatch(getListfailure());
    }
  }
)