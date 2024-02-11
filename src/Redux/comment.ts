import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addCommentType, commentType } from "../Interfaces/comment";
import axios from "axios";
import { COMMENT_API, INIT } from "../Utils/api-url";
interface commentState {
  commentList: commentType[];
  subCommentList: { id: number; comment: commentType[] }[];
  newComment: { id: number; comment: commentType }[];
  addCommentLoading: boolean;
  getCommentLoading: boolean;
  totalPages: number;
}

const initialState: commentState = {
  commentList: [],
  subCommentList: [],
  newComment: [],
  addCommentLoading: false,
  getCommentLoading: false,
  totalPages: 0,
};

const commentSlice = createSlice({
  name: "Comment",
  initialState,
  reducers: {
    postCommentStart: (state) => {
      state.addCommentLoading = true;
    },
    postCommentSuccess: (state, action: PayloadAction<commentType>) => {
      state.addCommentLoading = false;
      if(action.payload.commentId === null){
        state.commentList = [action.payload, ...state.commentList];
      }else{
        const id = action.payload.commentId
        const comment = action.payload
        const newComment = {id, comment};
        state.newComment = [...state.newComment, newComment];
        for(let i = 0; i< state.subCommentList.length; i++){
          if(state.subCommentList[i].id === action.payload.commentId){
            state.subCommentList[i].comment = [action.payload, ...state.subCommentList[i].comment]
          }
        }
        for(let i =0; i< state.commentList.length; i++){
          if(state.commentList[i].id === action.payload.commentId){
            state.commentList[i].subcommentCount = state.commentList[i].subcommentCount! + 1
          }
        }
      }
    },
    postCommentFailure: (state) => {
      state.addCommentLoading = false;
    },
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
    clearComment: (state) => {
      state.commentList = [];
      state.subCommentList = [];
    },
  },
});
export const {
  postCommentStart,
  postCommentSuccess,
  postCommentFailure,
  getCommentStart,
  getCommentSuccess,
  getCommentFailure,
  getSubCommentSuccess,
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
export const addComment = async(token: string, commentInfo: addCommentType) => {
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
}

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

export const getComment = async (postId : number, page: number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}?page=${page}`
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {}
}

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
export const getSubComment = async (postId: number, id: number, page: number, ) => {
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
