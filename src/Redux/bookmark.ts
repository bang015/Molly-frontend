import axios from 'axios'
import { BOOKMARK_API, INIT } from '../utils/api-url'
import { request } from './baseRequest'

export const bookmarkPost = async (postId: number) => {
  const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/`, {
    method: 'POST',
    data: postId,
    headers: {},
  })
  if (response.status === 200) {
    return response.data
  }
}
export const getPostBookmark = async (postId: number) => {
  const response = await request(
    `${process.env.REACT_APP_SERVER_URL}${INIT}${BOOKMARK_API}/${postId}`,
    {
      method: "GET",
      headers: {},
    },
  )
  if (response.status === 200) {
    return response.data
  }
}
