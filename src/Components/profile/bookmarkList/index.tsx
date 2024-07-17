import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostList, getBookmarkPost } from "@/redux/postList";
import { RootState } from "@/redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { openModal } from "@/redux/modal";
interface bookmarkListProps {
  userId: number;
}
const BookmarkList: React.FC<bookmarkListProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const post = useSelector(
    (state: RootState) => state.postListReducer.posts.bookmark
  );
  useEffect(() => {
    dispatch(clearPostList());
    dispatch(getBookmarkPost({ userId, page }) as any);
  }, [userId, page]);

  return (
    <div>
      <div className="bookmarkT">저장한 내용은 회원님만 볼 수 있습니다.</div>
      {post.length ? (
        <div className="user_post">
          {post &&
            post.map((post: any) => (
              <div
                key={post.id}
                onClick={() => {
                  dispatch(
                    openModal({ modalType: "PostDetailModal", id: post.id })
                  );
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
    </div>
  );
};

export default BookmarkList;
