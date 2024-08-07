import { createAsyncThunk } from '@reduxjs/toolkit'
import { BOOKMARK_API, INIT } from '../utils/api-url'
import { request } from './baseRequest'
import { openSnackBar } from './snackBar'

export const bookmarkPost = createAsyncThunk(
  'bookmark/post',
  async (postId: number, { dispatch }) => {
    try {
      const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/`, {
        method: 'POST',
        data: { postId },
        headers: {},
      })
      if (response.status === 200) {
        console.log(response.data)
        return response.data
      }
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  },
)
export const getPostBookmark = createAsyncThunk(
  'bookmark/get',
  async (postId: number, { dispatch }) => {
    try {
      const response = await request(
        `${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/${postId}`,
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
