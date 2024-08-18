import React from 'react'

interface postLikeCountProps {
  config: boolean
  likeCount: number
  handleLike: () => void
}
const PostLikeCount: React.FC<postLikeCountProps> = ({ config, likeCount, handleLike }) => {
  return (
    <section className={`mb-1 ${!config && 'order-4 px-4'}`}>
      {likeCount > 0 ? (
        <div className="text-body14sd">좋아요 {likeCount}개</div>
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
