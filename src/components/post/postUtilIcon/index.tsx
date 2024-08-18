import { IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useDispatch } from 'react-redux'
import { openSnackBar } from '@/redux/snackBar'
import { BOOKMARK_API, INIT } from '@/utils/api-url'
import { request } from '@/redux/baseRequest'

interface postUtilIconProps {
  checkLiked: boolean
  focusCommentInput: () => void
  handleLike: () => void
  config: boolean
  postId: number
}
const PostUtilIcon: React.FC<postUtilIconProps> = ({
  checkLiked,
  focusCommentInput,
  handleLike,
  config,
  postId,
}) => {
  const dispatch = useDispatch()
  const [checkBookmark, setCheckBookmark] = useState(false)
  useEffect(() => {
    const bookmark = async () => {
      try {
        const response = await request(
          `${import.meta.env.VITE_SERVER_URL}${INIT}${BOOKMARK_API}/${postId}`,
          {
            method: 'GET',
            headers: {},
          },
        )
        setCheckBookmark(response.data)
      } catch (e: any) {
        dispatch(openSnackBar(e.response.data.message))
      }
    }
    bookmark()
  }, [postId])
  const handleBookmark = async () => {
    try {
      const bookmark = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${BOOKMARK_API}/`, {
        method: 'POST',
        data: { postId },
        headers: {},
      })
      setCheckBookmark(bookmark.data)
    } catch (e: any) {
      dispatch(openSnackBar(e.response.data.message))
    }
  }
  return (
    <section className={`flex py-2 ${!config && 'order-2 border-t px-2'}`}>
      <IconButton className="" aria-label="heart" onClick={handleLike}>
        {checkLiked ? (
          <FavoriteIcon style={{ color: 'rgb(255, 48, 64)' }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: 25 }} />
        )}
      </IconButton>
      <IconButton aria-label="chat" onClick={focusCommentInput}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 25 }} />
      </IconButton>
      <div className="ml-auto">
        <IconButton className="" aria-label="bookmark" onClick={handleBookmark}>
          {checkBookmark ? (
            <BookmarkIcon sx={{ fontSize: 25 }} />
          ) : (
            <BookmarkBorderIcon sx={{ fontSize: 25 }} />
          )}
        </IconButton>
      </div>
    </section>
  )
}

export default PostUtilIcon
