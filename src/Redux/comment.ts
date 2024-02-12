import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addCommentType, commentType } from "../Interfaces/comment";
import axios from "axios";
import { COMMENT_API, INIT } from "../Utils/api-url";
interface commentState {
  commentList: commentType[];
  subCommentList: { id: number; comment: commentType[] }[];
  deletComment: number[];
  addCommentLoading: boolean;
  getCommentLoading: boolean;
  totalPages: number;
}

const initialState: commentState = {
  commentList: [],
  subCommentList: [],
  deletComment: [],
  addCommentLoading: false,
  getCommentLoading: false,
  totalPages: 0,
};

const commentSlice = createSlice({
  name: "Comment",
  initialState,
  reducers: {
    getCommentStart: (state) => {
      state.getCommentLoading = true;
    },
    getCommentSuccess: (
      state,
      action: PayloadAction<{ commentList: commentType[]; totalPages: number }>
    ) => {
      state.getCommentLoading = false;
      state.commentList = [...state.commentList, ...action.payload.commentList];
      state.totalPages = action.payload.totalPages;
    },
    getCommentFailure: (state) => {
      state.getCommentLoading = false;
    },
    getSubCommentSuccess: (state, action: PayloadAction<commentType[]>) => {
      const comment = action.payload;
      const id = comment[0].commentId!;
      const existingSubComment = state.subCommentList.find(
        (item) => item.id === id
      );
      if (!existingSubComment) {
        const subComment = { id, comment };
        state.subCommentList = [...state.subCommentList, subComment];
      } else {
        const filteredList = comment.filter(
          (item) =>
            !existingSubComment.comment.find(
              (existingItem) => existingItem.id === item.id
            )
        );
      }
    },
    deleteCommentSuccess: (state, action: PayloadAction<number>) => {
      state.deletComment = [...state.deletComment, action.payload];
    },
    clearComment: (state) => {
      state.deletComment = [];
    },
  },
});
export const {
  getCommentStart,
  getCommentSuccess,
  getCommentFailure,
  getSubCommentSuccess,
  deleteCommentSuccess,
  clearComment,
} = commentSlice.actions;
export default commentSlice.reducer;

// export const addComment = createAsyncThunk(
//   "comment/addComment",
//   async (
//     { token, commentInfo }: { token: string; commentInfo: addCommentType },
//     { dispatch }
//   ) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}`,
//         commentInfo,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.status === 200) {
//         dispatch(postCommentSuccess(response.data));
//       }
//     } catch (err) {}
//   }
// );
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

// export const getComment = createAsyncThunk(
//   "comment/getComment",
//   async ({ postId, page }: { postId: number; page: number }, { dispatch }) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}?page=${page}`
//       );

//       if (response.status === 200) {
//         dispatch(getCommentSuccess(response.data));
//       }
//     } catch (err) {}
//   }
// );

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

// export const getSubComment = createAsyncThunk(
//   "comment/getSubComment",
//   async (
//     { postId, id, page }: { postId: number; id: number; page: number },
//     { dispatch }
//   ) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}/${id}?page=${page}`
//       );

//       if (response.status === 200) {
//         dispatch(getSubCommentSuccess(response.data));
//       }
//     } catch {}
//   }
// );
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
// export const deleteComment = async (id: number, token: string) => {
//
// }
