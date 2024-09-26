import { INIT, LIKE_API } from '../utils/api-url'
import { request } from './baseRequest'

export const likePost = async (postId: number) => {
  const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${LIKE_API}`, {
    data:  {postId} ,
    method: 'POST',
    headers: {},
  })
  if (response.status === 200) {
    return response.data
  }
}

export const getPostLike = async (postId: number) => {
  const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${LIKE_API}/${postId}`, {
    method: 'GET',
    headers: {},
  })
  if (response.status === 200) {
    return response.data
  }
}
