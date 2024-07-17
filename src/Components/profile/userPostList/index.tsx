import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostList, getPostByUserId } from "@/redux/postList";
import { RootState } from "@/redux";
import "./index.css";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { openModal } from "@/redux/modal";
interface userPostListProps {
  userId: number;
}
const UserPostList: React.FC<userPostListProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const post = useSelector(
    (state: RootState) => state.postListReducer.posts.user
  );
  useEffect(() => {
    dispatch(getPostByUserId({ userId, page }) as any);
  }, [userId, page]);
  useEffect(() => {
    dispatch(clearPostList());
  }, [userId]);

  return (
    <div>
      {post.length ? (
        <div className="user_post">
          {post.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                dispatch(
                  openModal({ modalType: "PostDetailModal", id: post.id })
                );
              }}
            >
              <img className="image_item" src={post.postMedias[0].path} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="emptyImg">
            <CameraAltOutlinedIcon sx={{ width: "40px", height: "40px" }} />
          </div>
          <div>
            <h1>게시물 없음</h1>
          </div>
          {userId === user?.id && (
            <div>
              <div className="emptyT">
                <div>회원님의 추억을 공유해주세요.</div>
              </div>
              <div
                className="postbtn"
                onClick={() => {
                  dispatch(
                    openModal({
                      modalType: "PostFormModal",
                      id: null,
                      post: null,
                    })
                  );
                }}
              >
                <button>첫 사진 공유하기</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPostList;
