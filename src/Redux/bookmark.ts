import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BOOKMARK_API, INIT } from "../Utils/api-url";


export const bookmarkPost = async(token : string, postId: number) => {
  try{
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/`,
      {postId},
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      }
    );
    if(response.status === 200){
      return response.data
    } 
  }catch{

  }
}
export const getPostBookmark = async(postId: number, token: string) => {
  try{
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      }
    );
    if(response.status === 200) {
      return response.data;
    }
  }catch{

  }
}
