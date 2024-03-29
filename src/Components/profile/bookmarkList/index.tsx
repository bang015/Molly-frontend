import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostDetail, clearPostList, getBookmarkPost } from "../../../Redux/postList";
import { RootState } from "../../../Redux";
import PostDetail from "../../post/postDetail";
import { clearComment } from "../../../Redux/comment";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
interface bookmarkListProps {
  userId: number;
}
const BookmarkList: React.FC<bookmarkListProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const post = useSelector(
    (state: RootState) => state.postListReducer.bookmarkList
  );
  useEffect(() => {
    dispatch(clearPostList());
    dispatch(getBookmarkPost({ userId, page }) as any);
  }, [userId, page]);
  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };
  const closeModal = () => {
    setSelectedPostId(null);
    dispatch(clearComment());
    dispatch(clearPostDetail());

  };
  return (
    <div>
      <div className="bookmarkT">
        저장한 내용은 회원님만 볼 수 있습니다.
      </div>
      {post.length ? (
        <div className="user_post">
          {post &&
            post.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  handlePostModal(post.id);
                }}
              >
                <img className="image_item" src={post.PostMedia[0].path} />
              </div>
            ))}
        </div>
      ) : (
        <div className="empty">
          <div className="emptyImg">
            <BookmarkBorderIcon sx={{ width: "40px", height: "40px" }} />
          </div>
          <div>
            <h1>저장</h1>
          </div>
          <div className="emptyT">
            <div>다시 보고 싶은 콘텐츠를 저장하세요.</div>
            <div>저장된 콘텐츠는 회원님만 볼 수 있습니다.</div>
          </div>
        </div>
      )}

      {selectedPostId && (
        <PostDetail postId={selectedPostId} onClose={closeModal} />
      )}
    </div>
  );
};

export default BookmarkList;
