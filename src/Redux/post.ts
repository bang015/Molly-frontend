import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { updatePostType, uploadPostType } from '../interfaces/post'
import { INIT, POST_API } from '../utils/api-url'
import { getPostByPostId, postDelete, postUpdateList, postUpload } from './postList'
import { deletePostProfile } from './user'
import { request } from './baseRequest'
import { authStore } from './auth'
export interface updatedPost {
  updatedPost: { id: number | null; content: string | null }
}
interface postState {
  posting: boolean
  message: string
  showSnackBar: boolean
}

const initialState: postState = {
  posting: false,
  message: '',
  showSnackBar: false,
}
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    postStart: state => {
      state.posting = true
    },
    postSuccess: (state, action: PayloadAction<string>) => {
      state.posting = false
      state.message = action.payload
    },
    postFailure: (state, action: PayloadAction<string>) => {
      state.posting = false
      state.message = action.payload
    },
    postUpdate: state => {
      state.showSnackBar = true
      state.message = '게시물이 수정되었습니다.'
    },
    showSnackBar: (state, action: PayloadAction<string>) => {
      state.showSnackBar = true
      state.message = action.payload
    },
    resetSnackBar: state => {
      state.showSnackBar = false
    },
  },
})
export const { postStart, postSuccess, postFailure, postUpdate, showSnackBar, resetSnackBar } =
  postSlice.actions
export default postSlice.reducer

export const uploadPost = createAsyncThunk(
  'post/uploadPost',
  async ({ post }: { post: uploadPostType }, { dispatch }) => {
    try {
      dispatch(postStart())
      const formData = new FormData()
      formData.append('content', post.content)
      post.postMedias.forEach((image, index) => {
        const fileName = `image_${index}.png`
        const file = new File([image], fileName, { type: image.type })
        formData.append(`postMedias`, file)
      })
      if (post.hashtags) {
        post.hashtags.forEach((tag, index) => {
          formData.append(`hashtags[${index}]`, tag)
        })
      }
      const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}`, {
        data: formData,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status === 200) {
        dispatch(postSuccess(response.data.message))
        dispatch(postUpload(response.data.post))
      } else {
        dispatch(postFailure(response.data))
      }
    } catch (e: any) {
      dispatch(postFailure(e.response.data))
    }
  },
)

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postInfo }: { postInfo: updatePostType }, { dispatch }) => {
    try {
      const formData = new FormData()
      formData.append('content', postInfo.content)
      formData.append('postId', postInfo.postId)
      if (postInfo.hashtags) {
        postInfo.hashtags.forEach((tag, index) => {
          formData.append(`hashtags[${index}]`, tag)
        })
      }
      const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}`, {
        method: 'PATCH',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status === 200) {
        dispatch(getPostByPostId(response.data.updatedPost.id))
        dispatch(postUpdate())
        dispatch(postUpdateList(response.data))
      }
    } catch {}
  },
)

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async ({ postId }: { postId: number }, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${POST_API}/${postId}`,
        {
          method: 'DELETE',
          headers: {},
        },
      )
      if (response.status === 200) {
        dispatch(postDelete(response.data.postId))
        dispatch(deletePostProfile())
        dispatch(showSnackBar(response.data.message))
        return true
      }
    } catch (e: any) {
      dispatch(showSnackBar(e.response.data.message))
      return false
    }
  },
)
