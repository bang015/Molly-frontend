import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PostType, updatePostType, uploadPostType } from '../interfaces/post'
import { INIT, POST_API } from '../utils/api-url'
import { getPostDetail, postDelete, postUpdateList, postUpload } from './postList'
import { deletePostProfile } from './user'
import { request } from './baseRequest'
import { openSnackBar } from './snackBar'

interface postState {
  loading: boolean
  message: string
}

const initialState: postState = {
  loading: false,
  message: '',
}
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(uploadPost.pending, state => {
        state.loading = true
      })
      .addCase(uploadPost.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload
      })
      .addCase(uploadPost.rejected, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.message = action.payload.message
        } else {
          state.message = '알 수 없는 오류가 발생했습니다.'
        }
      })
      .addCase(deletePost.pending, state => {
        state.loading = true
      })
      .addCase(deletePost.fulfilled, state => {
        state.loading = false
      })
      .addCase(deletePost.rejected, state => {
        state.loading = false
      })
  },
})
export default postSlice.reducer

export const uploadPost = createAsyncThunk<
  string,
  uploadPostType,
  { rejectValue: { message: string } }
>('post/uploadPost', async (post: uploadPostType, { dispatch, rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('content', post.content)
    post.postMedias.forEach((image, index) => {
      const fileName = `image_${index}.png`
      const file = new File([image], fileName, { type: image.type })
      formData.append(`postMedias`, file)
    })
    if (post.hashtags) {
      post.hashtags.forEach((tag, index) => {
        formData.append('hashtags', tag)
      })
    }
    const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}`, {
      data: formData,
      method: 'POST',
      headers: {},
    })
    if (response.status === 200) {
      dispatch(postUpload(response.data.post))
    }
    return response.data.message
  } catch (e: any) {
    return rejectWithValue({ message: e.response.data.message })
  }
})

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postInfo }: { postInfo: updatePostType }, { dispatch }) => {
    try {
      const payload = {
        content: postInfo.content,
        postId: postInfo.postId,
        hashtags: postInfo.hashtags || [],
      }
      const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}`, {
        method: 'PATCH',
        data: payload,
        headers: {},
      })
      if (response.status === 200) {
        dispatch(openSnackBar(response.data.message))
        dispatch(postUpdateList(response.data.post))
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async ({ postId }: { postId: number }, { dispatch }) => {
    try {
      const response = await request(
        `${import.meta.env.VITE_SERVER_URL}${INIT}${POST_API}/${postId}`,
        {
          method: 'DELETE',
          headers: {},
        },
      )
      if (response.status === 200) {
        dispatch(postDelete(response.data.postId))
        dispatch(deletePostProfile())
        dispatch(openSnackBar(response.data.message))
        return true
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
      return false
    }
  },
)
