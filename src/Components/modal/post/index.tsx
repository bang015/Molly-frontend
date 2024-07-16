import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import { followUser, followedCheck } from "@/redux/follow";
import { closeModal, openModal } from "@/redux/modal";

const PostActionModal: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const Followed = useSelector(
    (state: RootState) => state.followReducer.chekcFollowed
  );
  const {isOpen,post} = useSelector((state:RootState) => state.modalReducer);
  const [checkFollowed, setCheckFollowed] = useState(false);

  useEffect(() => {
    followCheck();
  }, [post, Followed]);
  const handleUnFollow = () => {
    if (token) {
      const followUserId = post?.userId!;
      dispatch(followUser({ token, followUserId }) as any);
    }
    dispatch(closeModal());
  };
  const followCheck = async () => {
    if (token && post) {
      const result = await followedCheck(token, post.userId);
      setCheckFollowed(result);
    }
  };
  return (
    <div>
      <Modal open={isOpen} onClose={()=> {dispatch(closeModal())}}>
        <div className="post-detail">
          <div className="modal-container">
            {post?.userId === user!.id ? (
              <div className="editBtn">
                <div>
                  <button className="mbtn1 mbtnc" onClick={() => {dispatch(openModal({modalType: "PostFormModal", id: post?.id, post: post}))}}>
                    수정
                  </button>
                </div>
                <div>
                  <button className="mbtnc" onClick={() => {dispatch(openModal({modalType: "DeleteModal", id: post?.id, post: post}))}}>
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="editBtn">
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
            <div className="editBtn">
              <button className="mbtn2" onClick={()=> {dispatch(closeModal())}}>
                취소
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default PostActionModal;
