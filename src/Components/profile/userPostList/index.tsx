import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostList, getPostByUserId } from "../../../Redux/postList";
import { RootState } from "../../../Redux";
import "./index.css";
import PostDetail from "../../post/postDetail";
import { clearComment } from "../../../Redux/comment";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import PostForm from "../../post/postForm";
import PostLoading from "../../post/postLoading";
interface userPostListProps {
  userId: number;
}
const UserPostList: React.FC<userPostListProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postConfig, setPostConfig] = useState(false);
  const [open, setOpen] = useState(false);

  const user = useSelector((state: RootState) => state.authReducer.user);
  const post = useSelector(
    (state: RootState) => state.postListReducer.userPostList
  );
  useEffect(() => {
    dispatch(getPostByUserId({ userId, page }) as any);
  }, [userId, page]);
  useEffect(() => {
    dispatch(clearPostList());
  }, [userId]);
  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };
  const closeModal = () => {
    setSelectedPostId(null);
    dispatch(clearComment());
  };
  const onPostOpen = () => {
    setPostConfig(true);
  };
  const onPostClose = () => {
    setPostConfig(false);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <div>
      {post.length ? (
        <div className="user_post">
          {post.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                handlePostModal(post.id);
              }}
            >
              <img className="image_item" src={post.mediaList[0].mediaPath} />
            </div>
          ))}
          {selectedPostId && (
            <PostDetail postId={selectedPostId} onClose={closeModal} />
          )}
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
              <div className="postbtn" onClick={onPostOpen}>
                <button>첫 사진 공유하기</button>
              </div>
            </div>
          )}
        </div>
      )}

      {postConfig && (
        <PostForm
          postConfig={postConfig}
          onClose={onPostClose}
          openModal={handleOpenModal}
          post={null}
        />
      )}
      <PostLoading open={open} onClose={handleCloseModal} />
    </div>
  );
};

export default UserPostList;
