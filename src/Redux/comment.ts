import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addCommentType } from "../Interfaces/comment";
import axios from "axios";
import { COMMENT_API, INIT, QUERY_POSTID } from "../Utils/api-url";

interface commentState {
  commentList : [],
  commentLoading : boolean
}

const initialState : commentState = {
  commentList : [],
  commentLoading : false
}

const commentSlice = createSlice({
  name : "Comment",
  initialState,
  reducers : {
    postCommentStart : (state)=>{
      state.commentLoading = true;
    },
    postCommentSuccess : (state) => {
      state.commentLoading = false;
    },
    postCommentFailure : (state) => {
      state.commentLoading = false;
    }
  }
})
export const { postCommentStart, postCommentSuccess, postCommentFailure, } =
commentSlice.actions;
export default commentSlice.reducer;

export const addComment = createAsyncThunk (
  'comment/addComment',
  async({token, commentInfo} : {token: string, commentInfo: addCommentType}, {dispatch}) => {
    try{
      const response = axios.post(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}`,
        commentInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
    }catch(err){

    }
  }
);

export const getComment = createAsyncThunk (
  'comment/getComment',
  async(postId: number, {dispatch}) => {
    try{
      const response = axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}`
      )
    }catch(err){

    }
  }
)