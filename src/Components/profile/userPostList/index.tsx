import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostList, getPostByUserId } from "../../../Redux/postList";
import { RootState } from "../../../Redux";
import "./index.css";
import PostDetail from "../../post/postDetail";
import { clearComment } from "../../../Redux/comment";
interface userPostListProps {
  userId: number;
}
const UserPostList: React.FC<userPostListProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const post = useSelector(
    (state: RootState) => state.postListReducer.userPostList
  );
  useEffect(() => {
    dispatch(getPostByUserId({ userId, page }) as any);
  }, [userId, page]);
  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };
  const closeModal = () => {
    setSelectedPostId(null);
    dispatch(clearComment());
  };
  return (
    <div>
      <div className="user_post">
        {post &&
          post.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                handlePostModal(post.id);
              }}
            >
              <img className="image_item" src={post.mediaList[0].mediaPath} />
            </div>
          ))}
      </div>
      {selectedPostId && (
        <PostDetail postId={selectedPostId} onClose={closeModal} />
      )}
    </div>
  );
};

export default UserPostList;