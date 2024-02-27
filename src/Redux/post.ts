import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { updatePostType, uploadPostType } from "../Interfaces/post";
import { INIT, POST_API } from "../Utils/api-url";
import { getPostByPostId, postDelete, postUpload } from "./postList";
import { deletePostProfile } from "./profile";
interface updatedPost {
  postId: number | null;
  updatedPost: string | null
}
interface postState {
  posting: boolean;
  message: string;
  updatedPost: updatedPost;
  
}

const initialState: postState = {
  posting: false,
  message: "",
  updatedPost: {postId: null, updatedPost: null},

};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postStart: (state) => {
      state.posting = true;
    },
    postSuccess: (state, action: PayloadAction<string>) => {
      state.posting = false;
      state.message = action.payload;
    },
    postFailure: (state, action: PayloadAction<string>) => {
      state.posting = false;
      state.message = action.payload;
    },
    postUpdate : (state, action: PayloadAction<updatedPost>) => {
      state.updatedPost = action.payload;
    },
  },
});
export const { postStart, postSuccess, postFailure, postUpdate } = postSlice.actions;
export default postSlice.reducer;

export const uploadPost = createAsyncThunk(
  "post/uploadPost",
  async (
    { post , token}: { post: uploadPostType, token : string },
    { dispatch }
  ) => {
    try {
      dispatch(postStart());
      const formData = new FormData();
      formData.append("content", post.content);
      post.post_images.forEach((image, index) => {
        const fileName = `image_${index}.png`;
        const file = new File([image], fileName, { type: image.type });
        formData.append(`post_images`, file);
      });
      if (post.hashtags) {
        post.hashtags.forEach((tag, index) => {
          formData.append(`hashtags[${index}]`, tag);
        });
      }
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(response.status === 200) {
        dispatch(postSuccess(response.data.message));
        dispatch(postUpload(response.data.post));
      }else{
        dispatch(postFailure(response.data));
      }
    } catch {
      dispatch(postFailure("게시글 업로드를 실패했습니다."));
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async({postInfo, token}:{postInfo : updatePostType, token : string}, {dispatch}) => {
    try{
      const formData = new FormData();
      formData.append("content", postInfo.content);
      formData.append("postId", postInfo.postId);
      if (postInfo.hashtags) {
        postInfo.hashtags.forEach((tag, index) => {
          formData.append(`hashtags[${index}]`, tag);
        });
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      if(response.status === 200) {
        const postId = parseInt(postInfo.postId);
        dispatch(getPostByPostId(postId));
        dispatch(postUpdate(response.data));
      }
    }catch{

    }
  }
)

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async({token,postId}:{token: string, postId: number}, {dispatch}) => {
    try{
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200) {
        dispatch(postDelete(response.data));
        dispatch(deletePostProfile());
      }
    }catch{

    }
  }
)