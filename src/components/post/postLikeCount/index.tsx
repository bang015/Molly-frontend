import { PostType } from '@/interfaces/post'
import { likePost } from '@/redux/like'
import { updatePostLike } from '@/redux/postList'
import React from 'react'
import { useDispatch } from 'react-redux'

interface postLikeCountProps {
  config: boolean
  post: PostType
}

const PostLikeCount: React.FC<postLikeCountProps> = ({ config, post }) => {
  const dispatch = useDispatch()
  const handleLike = async () => {
    const isLiked = await likePost(post.id)
    dispatch(updatePostLike({ postId: post.id, isLiked }))
  }
  return (
    <section className={`mb-1 ${!config && 'order-4 px-4'}`}>
      {post.likeCount > 0 ? (
        <div className="text-body14sd">좋아요 {post.likeCount}개</div>
      ) : (
        <div className="text-body14rg">
          가장 먼저{' '}
          <span className="cursor-pointer font-semibold hover:text-gray-500" onClick={handleLike}>
            좋아요
          </span>
          를 눌러보세요
        </div>
      )}
    </section>
  )
}

export default PostLikeCount
