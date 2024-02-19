import React from "react";

interface postLikeCountProps {
  likeCount: number;
  handleLike: () => void;
}
const PostLikeCount: React.FC<postLikeCountProps> = ({
  likeCount,
  handleLike,
}) => {
  return (
    <section className="section2">
      {likeCount > 0 ? (
        <div>좋아요 {likeCount}개</div>
      ) : (
        <div>
          가장 먼저 <span onClick={handleLike}>좋아요</span>를 눌러보세요
        </div>
      )}
    </section>
  );
};

export default PostLikeCount;