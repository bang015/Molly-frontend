import { IconButton } from '@mui/material'
import React from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useDispatch } from 'react-redux'
import { PostType } from '@/interfaces/post'
import { likePost } from '@/redux/like'
import { updatePostBookmark, updatePostLike } from '@/redux/postList'
import { bookmarkPost } from '@/redux/bookmark'

interface postUtilIconProps {
  focusCommentInput: () => void
  config: boolean
  post: PostType
}
const PostUtilIcon: React.FC<postUtilIconProps> = ({ focusCommentInput, config, post }) => {
  const dispatch = useDispatch()

  const handleBookmark = async () => {
    const isBookmarked = await bookmarkPost(post.id)
    dispatch(updatePostBookmark({ postId: post.id, isBookmarked }))
  }
  const handleLike = async () => {
    const isLiked = await likePost(post.id)
    dispatch(updatePostLike({ postId: post.id, isLiked }))
  }
  return (
    <section className={`flex py-2 ${!config && 'order-2 border-t px-2'}`}>
      <IconButton className="" aria-label="heart" onClick={handleLike}>
        {post.isLiked ? (
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
          {post.isBookmarked ? (
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
