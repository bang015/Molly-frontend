import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { uploadPostType } from "../Interfaces/post";
import { INIT, POST_API } from "../Utils/api-url";

interface postState {
  posting: boolean;
  message: string;
}

const initialState: postState = {
  posting: false,
  message: "",
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
  },
});
export const { postStart, postSuccess, postFailure } = postSlice.actions;
export default postSlice.reducer;

export const uploadPost = createAsyncThunk(
  "post/uploadPost",
  async (
    { post }: { post: uploadPostType },
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
            Authorization: `Bearer ${post.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(response.status === 200) {
        dispatch(postSuccess(response.data));
      }else{
        dispatch(postFailure(response.data));
      }
    } catch {
      dispatch(postFailure("게시글 업로드를 실패했습니다."));
    }
  }
);

export const deletePost = (token: string, postId: number) => {
  axios.delete(
    `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
