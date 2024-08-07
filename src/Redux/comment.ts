import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { addCommentType, CommentType } from '../interfaces/comment'
import { COMMENT_API, INIT } from '../utils/api-url'
import { request } from './baseRequest'
import { openSnackBar } from './snackBar'
interface commentState {
  deleteComment: number[]
  updatePending: boolean
  updateCommentId: CommentType | null
  updatedComment: CommentType | null
}

const initialState: commentState = {
  deleteComment: [],
  updatePending: false,
  updateCommentId: null,
  updatedComment: null,
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    deleteCommentSuccess: (state, action: PayloadAction<number>) => {
      state.deleteComment = [...state.deleteComment, action.payload]
    },
    updatePending: (state, action: PayloadAction<CommentType>) => {
      state.updatePending = true
      state.updateCommentId = action.payload
    },
    updateCommentSuccess: (state, action: PayloadAction<CommentType>) => {
      state.updatedComment = action.payload
    },
    clearComment: state => {
      state.deleteComment = []
      state.updatePending = false
      state.updateCommentId = null
    },
  },
})
export const { deleteCommentSuccess, updatePending, clearComment, updateCommentSuccess } =
  commentSlice.actions
export default commentSlice.reducer

export const addComment = createAsyncThunk(
  'comment/add',
  async (commentInfo: addCommentType, { dispatch }) => {
    try {
      const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}`, {
        data: commentInfo,
        method: 'POST',
        headers: {},
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const getComment = createAsyncThunk(
  'comment/get',
  async ({ postId, page }: { postId: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}?page=${page}`,
        {
          method: 'GET',
          headers: {},
        },
      )

      if (response.status === 200) {
        return response.data
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
export const getMyCommentByPost = createAsyncThunk(
  'comment/mycomment',
  async (postId: number, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/my/${postId}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
export const getSubComment = createAsyncThunk(
  'comment/subComment',
  async ({ postId, id, page }: { postId: number; id: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/sub/${postId}/${id}?page=${page}`,
        { method: 'GET' },
      )

      if (response.status === 200) {
        return response.data
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async ({ id }: { id: number }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        {
          method: 'DELETE',
          headers: {},
        },
      )
      if (response.status === 200) {
        dispatch(deleteCommentSuccess(response.data))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ id, content }: { id: number; content: string }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        {
          data: { content },
          method: 'PATCH',
          headers: {},
        },
      )
      if (response.status === 200) {
        dispatch(updateCommentSuccess(response.data))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
