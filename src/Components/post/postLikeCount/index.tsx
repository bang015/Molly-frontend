import React from "react";

interface postLikeCountProps {
  config : boolean;
  likeCount: number;
  handleLike: () => void;
}
const PostLikeCount: React.FC<postLikeCountProps> = ({
  config,
  likeCount,
  handleLike,
}) => {
  return (
    <section className={config ?"section2" : "section2 m" }>
      {likeCount > 0 ? (
        <div className="like">좋아요 {likeCount}개</div>
      ) : (
        <div>
          가장 먼저 <span onClick={handleLike}>좋아요</span>를 눌러보세요
        </div>
      )}
    </section>
  );
};

export default PostLikeCount;