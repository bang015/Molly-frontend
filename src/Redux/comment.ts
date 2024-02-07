import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addCommentType, commentType } from "../Interfaces/comment";
import axios from "axios";
import { COMMENT_API, INIT, } from "../Utils/api-url";

interface commentState {
  commentList : commentType[],
  addCommentLoading : boolean,
  getCommentLoading: boolean
  totalPages : number
}

const initialState : commentState = {
  commentList : [],
  addCommentLoading : false,
  getCommentLoading: false,
  totalPages: 0
}

const commentSlice = createSlice({
  name : "Comment",
  initialState,
  reducers : {
    postCommentStart : (state)=>{
      state.addCommentLoading = true;
    },
    postCommentSuccess : (state, action: PayloadAction<commentType>) => {
      state.addCommentLoading = false;
      state.commentList = [action.payload, ...state.commentList];
    },
    postCommentFailure : (state) => {
      state.addCommentLoading = false;
    },
    getCommentStart : (state) => {
      state.getCommentLoading = true;
    },
    getCommentSuccess : (state, action: PayloadAction<{commentList:commentType[], totalPages: number}>) => {
      state.getCommentLoading = false;
      state.commentList = [...state.commentList, ...action.payload.commentList];
      state.totalPages = action.payload.totalPages;
    },
    getCommentFailure : (state) => {
      state.getCommentLoading = false;
    },
    clearComment : (state) => {
      state.commentList = []
    }
  }
})
export const { postCommentStart, postCommentSuccess, postCommentFailure, getCommentStart, getCommentSuccess, getCommentFailure, clearComment} =
commentSlice.actions;
export default commentSlice.reducer;

export const addComment = createAsyncThunk (
  'comment/addComment',
  async({token, commentInfo} : {token: string, commentInfo: addCommentType}, {dispatch}) => {
    try{
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}`,
        commentInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if(response.status === 200) {
        dispatch(postCommentSuccess(response.data));
        console.log(response.data);
      }
    }catch(err){

    }
  }
);

export const getComment = createAsyncThunk (
  'comment/getComment',
  async({postId, page}:{postId: number,page: number}, {dispatch}) => {
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}?page=${page}`
      )

      if(response.status === 200) {
        dispatch(getCommentSuccess(response.data));
      }
    }catch(err){

    }
  }
);

export const getSubComment = async (postId: number, id: number, page: number) => {
  try{
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}/${id}?page=${page}`
    )

    if(response.status === 200) {
      return response.data
    }
  }catch{

  }
}