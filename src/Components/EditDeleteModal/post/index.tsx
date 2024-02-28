import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { postType } from "../../../Interfaces/post";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import { followUser, followedCheck } from "../../../Redux/follow";
import DeleteModal from "../delete";
interface postMoreModalProps {
  open: boolean;
  post: postType;
  onClose: () => void;
  onDeleteOpen: () => void;
  onEditOpen: () => void;
}
const PostMoreModal: React.FC<postMoreModalProps> = ({
  open,
  post,
  onClose,
  onDeleteOpen,
  onEditOpen
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const Followed = useSelector(
    (state: RootState) => state.followReducer.chekcFollowed
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [checkFollowed, setCheckFollowed] = useState(false);

  const userId = post.userId;
  const postId = post.id;
  useEffect(() => {
    followCheck();
  }, [post, Followed]);
  const handleUnFollow = () => {
    if (token) {
      const followUserId = post?.userId!;
      dispatch(followUser({ token, followUserId }) as any);
    }
    onClose();
  };
  const followCheck = async() => {
    if (token && post) {
      const result = await followedCheck(token, post.userId);
      setCheckFollowed(result);
    }
  };
  const postDelete = () => {
    onDeleteOpen();
    onClose();
  };
  const onDeleteClose= () => {
    setDeleteOpen(false);
  }
  const postEdit = () => {
    onEditOpen();
    onClose();
  }
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="post-detail">
          <div className="modal-container">
            {userId === user!.id ? (
              <div>
                <div>
                  <button className="mbtn1 mbtnc" onClick={postEdit}>수정</button>
                </div>
                <div>
                  <button className="mbtnc" onClick={postDelete}>삭제</button>
                </div>
                {deleteOpen && (
                  <DeleteModal postId={postId} deleteOpen={deleteOpen} onDeleteClose={onDeleteClose}/>
                )}
              </div>
            ) : (
              <div>
                <div>
                  <button className="mbtn1 mbtnc">신고</button>
                </div>
                {checkFollowed && (
                  <div>
                    <button className="mbtnc" onClick={handleUnFollow}>
                      팔로우 취소
                    </button>
                  </div>
                )}
              </div>
            )}
            <div>
              <button className="mbtn2" onClick={onClose}>
                취소
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default PostMoreModal;
