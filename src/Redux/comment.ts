import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addCommentType, commentType } from "../Interfaces/comment";
import axios from "axios";
import { COMMENT_API, INIT } from "../Utils/api-url";
interface commentState {
  deletComment: number[];
  updatePending: boolean;
  updateCommentId: commentType | null;
  updatedComment: commentType | null;
}

const initialState: commentState = {
  deletComment: [],
  updatePending: false,
  updateCommentId: null,
  updatedComment: null
};

const commentSlice = createSlice({
  name: "Comment",
  initialState,
  reducers: {
    deleteCommentSuccess: (state, action: PayloadAction<number>) => {
      state.deletComment = [...state.deletComment, action.payload];
    },
    updatePending: (state, action: PayloadAction<commentType>) => {
      state.updatePending = true;
      state.updateCommentId = action.payload;
    },
    updateCommentSuccess : (state, action: PayloadAction<commentType>) => {
      state.updatedComment = action.payload
    },
    clearComment: (state) => {
      state.deletComment = [];
      state.updatePending = false;
      state.updateCommentId = null;
    },
  },
});
export const {
  deleteCommentSuccess,
  updatePending,
  clearComment,
  updateCommentSuccess
} = commentSlice.actions;
export default commentSlice.reducer;

export const addComment = async (
  token: string,
  commentInfo: addCommentType
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}`,
      commentInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {}
};

export const getComment = async (postId: number, page: number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}?page=${page}`
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {}
};

export const getSubComment = async (
  postId: number,
  id: number,
  page: number
) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}/${id}?page=${page}`
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch {}
};
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ id, token }: { id: number; token: string }, { dispatch }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(deleteCommentSuccess(response.data));
      }
    } catch {}
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({token, id, content} : {token: string, id:number, content: string} , {dispatch}) => {
    try{
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        {content},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if(response.status === 200) {
        dispatch(updateCommentSuccess(response.data));
      }
    }catch{

    }
  }
)

