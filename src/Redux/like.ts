import axios from 'axios'
import { INIT, LIKE_API } from '../utils/api-url'
import { request } from './baseRequest'
const token = localStorage.getItem('accessToken')
export const likePost = async (postId: number) => {
  try {
    const response = await request(`${process.env.REACT_APP_SERVER_URL}${INIT}${LIKE_API}/`, {
      data: postId,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 200) {
      return response.data
    }
  } catch {}
}

export const getPostLike = async (postId: number) => {
  try {
    const response = await request(
      `${process.env.REACT_APP_SERVER_URL}${INIT}${LIKE_API}/${postId}`,
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
  } catch {}
}
