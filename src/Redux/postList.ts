import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, POST_API } from "../Utils/api-url";
import { postType } from "../Interfaces/post";

interface postListState{
  allPostList: postType[];
  getPostLoading : boolean;
  getPostDetail: postType|null;
}

const initialState: postListState = {
  allPostList : [],
  getPostLoading : false,
  getPostDetail: null
}
const postListSlice = createSlice({
  name: "postList",
  initialState,
  reducers: {
    getListStart: (state) => {
      state.getPostLoading = true;
    },
    getAllPostList: (state, action: PayloadAction<postType[]>) => {
      state.getPostLoading = false;
      state.allPostList = [...state.allPostList, ...action.payload];
    },
    getListfailure: (state) => {
      state.getPostLoading = false;
    },
    getPostDetailSuccess: (state, action: PayloadAction<postType>)=> {
      state.getPostLoading = false;
      state.getPostDetail = action.payload;
    }
  }
});

export const { getListStart, getAllPostList, getListfailure, getPostDetailSuccess } =
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

export const getPostByPostId = createAsyncThunk(
  'postList/getPostByPostId',
  async(postId : number, {dispatch}) => {
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/${postId}`,
      )
      if(response.status === 200) {
        dispatch(getPostDetailSuccess(response.data));
      }
    }catch(err) {
      dispatch(getListfailure());
    }
  }
)