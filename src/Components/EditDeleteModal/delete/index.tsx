import { Modal } from "@mui/material";
import React, { useEffect } from "react";
import "./index.css";
import { deletePost } from "../../../Redux/post";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
interface deleteModalProps {
  postId: number;
  deleteOpen: boolean;
  onDeleteClose: () => void;
}
const DeleteModal: React.FC<deleteModalProps> = ({
  postId,
  deleteOpen,
  onDeleteClose,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const userPostList = useSelector(
    (state: RootState) => state.postListReducer.userPostList
  );
  useEffect(() => {
    const result = userPostList.filter((post) => post.id === postId);
    if(result.length === 0){
      onDeleteClose();
    }
  }, [userPostList, postId]);
  const postDelete = async () => {
    if (token) {
      dispatch(deletePost({ token, postId }) as any);
    }
  };
  return (
    <div>
      <Modal open={deleteOpen} onClose={onDeleteClose}>
        <div className="post-detail">
          <div className="modal-container">
            <div className="dbtnt">게시물을 삭제할까요?</div>
            <div>
              <button className="mbtnc" onClick={postDelete}>
                삭제
              </button>
            </div>
            <button className="mbtn2" onClick={onDeleteClose}>
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteModal;
