import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { addCommentType, commentType } from '../interfaces/comment'
import axios from 'axios'
import { COMMENT_API, INIT } from '../utils/api-url'
import { showSnackBar } from './post'
import { useSelector } from 'react-redux'
import { RootState } from '.'
import { request } from './baseRequest'
interface commentState {
  deleteComment: number[]
  updatePending: boolean
  updateCommentId: commentType | null
  updatedComment: commentType | null
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
    updatePending: (state, action: PayloadAction<commentType>) => {
      state.updatePending = true
      state.updateCommentId = action.payload
    },
    updateCommentSuccess: (state, action: PayloadAction<commentType>) => {
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
const token = localStorage.getItem('accessToken')
export const addComment = async (commentInfo: addCommentType) => {
  const response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}`,
    commentInfo,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (response.status === 200) {
    return response.data
  }
}

export const getComment = async (userId: number, postId: number, page: number) => {
  try {
    const response = await request(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${postId}?page=${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status === 200) {
      return response.data
    }
  } catch (err) {}
}
export const getMyCommentByPost = async (userId: number, postId: number) => {
  try {
    const response = await request(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/my/${postId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.status === 200) {
      return response.data
    }
  } catch {
    return []
  }
}
export const getSubComment = async (postId: number, id: number, page: number) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/sub/${postId}/${id}?page=${page}`,
    )

    if (response.status === 200) {
      return response.data
    }
  } catch {
    return []
  }
}
export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async ({ id }: { id: number }, { dispatch }) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.status === 200) {
        dispatch(deleteCommentSuccess(response.data))
      }
    } catch {
      dispatch(showSnackBar('다시 시도해주세요'))
    }
  },
)

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ id, content }: { id: number; content: string }, { dispatch }) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.status === 200) {
        dispatch(updateCommentSuccess(response.data))
      }
    } catch {
      dispatch(showSnackBar('다시 시도해주세요'))
    }
  },
)
