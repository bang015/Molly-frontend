import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { INIT, POST_API } from "../Utils/api-url";
import { postType } from "../Interfaces/post";

interface postListState {
  allPostList: postType[];
  mainPostList: postType[];
  userPostList: postType[];
  bookmarkList: postType[];
  getPostLoading: boolean;
  getPostDetail: postType | null;
  totalPages: number;
}

const initialState: postListState = {
  allPostList: [],
  mainPostList: [],
  userPostList: [],
  bookmarkList: [],
  getPostLoading: false,
  getPostDetail: null,
  totalPages: 1,
};
const postListSlice = createSlice({
  name: "postList",
  initialState,
  reducers: {
    getListStart: (state) => {
      state.getPostLoading = true;
    },
    getAllPostList: (state, action: PayloadAction<postType[]>) => {
      state.getPostLoading = false;
      const post = [...state.allPostList, ...action.payload];
      const filter = post.filter(
        (post, index, self) => index === self.findIndex((p) => p.id === post.id)
      );
      state.allPostList = filter;
    },
    getListfailure: (state) => {
      state.getPostLoading = false;
    },
    getPostDetailSuccess: (state, action: PayloadAction<postType>) => {
      state.getPostLoading = false;
      state.getPostDetail = action.payload;
    },
    getMainPostList: (
      state,
      action: PayloadAction<{ post: postType[]; totalPages: number }>
    ) => {
      const post = [...state.mainPostList, ...action.payload.post];
      const filter = post.filter(
        (post, index, self) => index === self.findIndex((p) => p.id === post.id)
      );
      state.mainPostList = filter;
      state.totalPages = action.payload.totalPages;
    },
    getUserPostList: (state, action: PayloadAction<postType[]>) => {
      state.userPostList = [...state.userPostList, ...action.payload];
    },
    getbookmarkList: (state, action: PayloadAction<postType[]>) => {
      state.bookmarkList = [...state.bookmarkList, ...action.payload];
    },
    postUpload: (state, action: PayloadAction<postType>) => {
      state.mainPostList = [action.payload, ...state.mainPostList];
    },
    postDelete: (state, action: PayloadAction<number>) => {
      state.mainPostList = state.mainPostList.filter(
        (post) => post.id !== action.payload
      );
      state.userPostList = state.userPostList.filter(
        (post) => post.id !== action.payload
      );
    },

    clearPostList: (state) => {
      state.userPostList = [];
      state.bookmarkList = [];
    },
  },
});

export const {
  getListStart,
  getAllPostList,
  getListfailure,
  getPostDetailSuccess,
  getMainPostList,
  getUserPostList,
  getbookmarkList,
  postDelete,
  postUpload,
  clearPostList,
} = postListSlice.actions;
export default postListSlice.reducer;

export const getMainPost = createAsyncThunk(
  "postList/getMainPost",
  async ({ page, token }: { page: number; token: string }, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/main/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(getMainPostList(response.data));
      }
    } catch {}
  }
);

export const getAllPost = createAsyncThunk(
  "postList/getAllPost",
  async ({ page, token }: { page: number; token: string }, { dispatch }) => {
    dispatch(getListStart());
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const result = response.data;
        dispatch(getAllPostList(result));
      } else {
        dispatch(getListfailure());
      }
    } catch (err) {
      dispatch(getListfailure());
    }
  }
);

export const getPostByPostId = createAsyncThunk(
  "postList/getPostByPostId",
  async (postId: number, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/${postId}`
      );
      if (response.status === 200) {
        dispatch(getPostDetailSuccess(response.data));
      }
    } catch (err) {
      dispatch(getListfailure());
    }
  }
);

export const getPostByUserId = createAsyncThunk(
  "postList/getPostByUserId",
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/my/${userId}?page=${page}`
      );
      if (response.status === 200) {
        dispatch(getUserPostList(response.data.post));
      }
    } catch {}
  }
);
export const getPostByTagName = createAsyncThunk(
  "postList/getPostByTagName",
  async (
    { tagName, page }: { tagName: string; page: number },
    { dispatch }
  ) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/tags/${tagName}?page=${page}`
      );
      if (response.status === 200) {
        dispatch(getUserPostList(response.data.post));
      }
    } catch {}
  }
);

export const getBookmarkPost = createAsyncThunk(
  "postList/getBookmarkPost",
  async ({ userId, page }: { userId: number; page: number }, { dispatch }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/bookmark/${userId}?page=${page}`
      );
      if (response.status === 200) {
        dispatch(getbookmarkList(response.data));
      }
    } catch {}
  }
);
