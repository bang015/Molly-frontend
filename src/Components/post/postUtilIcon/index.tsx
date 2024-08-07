import { IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { bookmarkPost, getPostBookmark } from '@/redux/bookmark'
import { useDispatch } from 'react-redux'

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
      const result = await dispatch(getPostBookmark(postId) as any)
      setCheckBookmark(result.payload)
    }
    bookmark()
  }, [postId])
  const handleBookmark = async () => {
    const bookmark = await dispatch(bookmarkPost(postId) as any)
    console.log(bookmark)
    setCheckBookmark(bookmark.payload)
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
