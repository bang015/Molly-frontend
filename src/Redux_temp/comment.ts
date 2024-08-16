import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { addCommentType, CommentType } from '../interfaces/comment'
import { COMMENT_API, INIT } from '../utils/api-url'
import { request } from './baseRequest'
import { openSnackBar } from './snackBar'
interface commentState {
  commentList: CommentType[]
  loading: {
    comment: boolean
    subComment: boolean
  }
  totalPages: {
    comment: number
  }
  editingComment: CommentType | null
  updatedComment: CommentType | null
}

const initialState: commentState = {
  commentList: [],
  loading: {
    comment: false,
    subComment: false,
  },
  totalPages: {
    comment: 0,
  },
  editingComment: null,
  updatedComment: null,
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setEditingComment: (state, action: PayloadAction<CommentType>) => {
      state.editingComment = action.payload
    },
    setShowSubComments: (state, action: PayloadAction<number>) => {
      const comment = state.commentList.find(comment => comment.id === action.payload)
      if (comment) {
        comment.showSubComments = !comment.showSubComments
      }
    },
    updateCommentSuccess: (state, action: PayloadAction<CommentType>) => {
      state.updatedComment = action.payload
    },
    clearComment: state => {
      state.commentList = []
      state.editingComment = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getComment.pending, state => {
        state.loading.comment = true
      })
      .addCase(getComment.fulfilled, (state, action) => {
        const comments = [...state.commentList, ...action.payload.commentList]
        const filter = new Map(comments.map(comment => [comment.id, comment]))
        state.commentList = Array.from(filter.values())
        state.loading.comment = false
        state.totalPages.comment = action.payload.totalPages
      })
      .addCase(getMyCommentByPost.pending, state => {
        state.loading.comment = true
      })
      .addCase(getMyCommentByPost.fulfilled, (state, action) => {
        state.loading.comment = false
        const comments = [...action.payload, ...state.commentList]
        const filter = new Map(comments.map(comment => [comment.id, comment]))
        state.commentList = Array.from(filter.values())
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (action.payload.commentId === null) {
          state.commentList.unshift(action.payload)
        } else {
          state.commentList.forEach(comment => {
            if (comment.id === action.payload.commentId) {
              if (!comment.subComment) {
                comment.subComment = []
              }
              if (comment.subCommentsCount !== undefined) {
                comment.subCommentsCount += 1
              }
              comment.subComment.unshift(action.payload)
              comment.showSubComments = true
            }
          })
        }
      })

      .addCase(getSubComment.pending, state => {
        state.loading.subComment = true
      })
      .addCase(getSubComment.fulfilled, (state, action) => {
        const { id } = action.meta.arg
        const parentComment = state.commentList.find(comment => comment.id === id)
        if (parentComment) {
          const subComment = [...(parentComment.subComment || []), ...action.payload]
          const filter = new Map(subComment.map(s => [s.id, s]))
          parentComment.subComment = Array.from(filter.values())
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        if (action.payload.commentId === null) {
          state.commentList = state.commentList.filter(comment => comment.id !== action.payload.id)
        } else {
          const parentComment = state.commentList.find(
            comment => comment.id === action.payload.commentId,
          )
          if (parentComment) {
            parentComment.subComment = parentComment.subComment?.filter(
              sc => sc.id !== action.payload.id,
            )
            if (
              parentComment.subCommentsCount !== undefined &&
              parentComment.subCommentsCount > 0
            ) {
              parentComment.subCommentsCount -= 1
            }
          }
        }
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        if (action.payload.commentId === null) {
          const comment = state.commentList.find(comment => comment.id === action.payload.id)
          if (comment) {
            comment.content = action.payload.content
            comment.updatedAt = action.payload.updatedAt
          }
        } else {
          const parentComment = state.commentList.find(
            comment => comment.id === action.payload.commentId,
          )
          if (parentComment) {
            const subComment = parentComment.subComment.find(sub => sub.id === action.payload.id)
            if (subComment) {
              subComment.content = action.payload.content
              subComment.updatedAt = action.payload.updatedAt
            }
          }
        }
        state.editingComment = null
      })
  },
})
export const { setShowSubComments, setEditingComment, clearComment, updateCommentSuccess } =
  commentSlice.actions
export default commentSlice.reducer

export const getComment = createAsyncThunk<
  { commentList: CommentType[]; totalPages: number },
  { postId: number; page: number }
>('comment/get', async ({ postId, page }: { postId: number; page: number }, { dispatch }) => {
  try {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${COMMENT_API}/${postId}?page=${page}`,
      {
        method: 'GET',
        headers: {},
      },
    )
    return response.data
  } catch (e: any) {
    dispatch(openSnackBar(e.response.data.message))
  }
})

export const getMyCommentByPost = createAsyncThunk<CommentType[], number>(
  'comment/mycomment',
  async (postId: number, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${COMMENT_API}/my/${postId}`,
        {
          method: 'GET',
          headers: {},
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
export const getSubComment = createAsyncThunk<CommentType[], { id: number; page: number }>(
  'comment/subComment',
  async ({ id, page }: { id: number; page: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${COMMENT_API}/sub/${id}?page=${page}`,
        { method: 'GET' },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const addComment = createAsyncThunk<CommentType, addCommentType>(
  'comment/add',
  async (commentInfo: addCommentType, { dispatch }) => {
    try {
      const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${COMMENT_API}`, {
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

export const deleteComment = createAsyncThunk<
  { id: number; commentId: number | null },
  { id: number; commentId: number | null },
  {
    rejectValue: string
  }
>(
  'comment/deleteComment',
  async (
    { id, commentId }: { id: number; commentId: number | null },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        {
          method: 'DELETE',
          headers: {},
        },
      )
      return { id: response.data, commentId }
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || '댓글 삭제에 실패했습니다.'
      dispatch(openSnackBar(e.response.data.message))
      return rejectWithValue(errorMessage)
    }
  },
)

export const updateComment = createAsyncThunk<CommentType, { id: number; content: string }>(
  'comment/updateComment',
  async ({ id, content }: { id: number; content: string }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${COMMENT_API}/${id}`,
        {
          data: { content },
          method: 'PATCH',
          headers: {},
        },
      )
      return response.data
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
