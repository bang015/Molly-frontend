import { BOOKMARK_API, INIT } from '@/utils/api-url'
import { request } from './baseRequest'

export const bookmarkPost = async (postId: number) => {
  const bookmark = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${BOOKMARK_API}`, {
    method: 'POST',
    data: { postId },
    headers: {},
  })
  return bookmark.data
}
