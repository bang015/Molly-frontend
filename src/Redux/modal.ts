import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface modalState {
  postId: number | null;
  postDetailOpen: boolean;
  editOrDeleteOpen: boolean;
  confirmDeletionOpen: boolean;
  postEditOpen: boolean;
  createLoadingOpen: boolean;
}
const initialState: modalState = {
  postId: null,
  postDetailOpen: false,
  editOrDeleteOpen: false,
  confirmDeletionOpen: false,
  postEditOpen: false,
  createLoadingOpen: false,
};
const modalSlice = createSlice({
  name: "modalSlice",
  initialState,
  reducers: {
    postDetailOpen: (state, action: PayloadAction<number>) => {
      state.postId = action.payload;
      state.postDetailOpen = true;
    },
    postDetailClose: (state) => {
      state.postId = null;
      state.postDetailOpen = false;
    },
    editOrDeleteOpen: (state, action: PayloadAction<number>) => {
      state.postId = action.payload;
      state.editOrDeleteOpen = true;
    },
    editOrDeleteClose: (state) => {
      state.postId = null;
      state.editOrDeleteOpen = false;
    },
    confirmDeletionOpen: (state, action: PayloadAction<number>) => {
      state.postId = action.payload;
      state.confirmDeletionOpen = true;
    },
    confirmDeletionClose: (state) => {
      state.postId = null;
      state.confirmDeletionOpen = false;
    },
    postEditOpen: (state, action: PayloadAction<number>) => {
      state.postId = action.payload;
      state.postEditOpen = true;
    },
    postEditClose: (state) => {
      state.postId = null;
      state.postEditOpen = false;
    },
    createLoadingOpen: (state) => {
      state.createLoadingOpen = true;
    },
    createLoadingClose: (state) => {
      state.createLoadingOpen = false;
    },
  },
});
