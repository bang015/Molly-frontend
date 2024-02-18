import { Modal } from "@mui/material";
import React from "react";
import "./index.css";
import { deletePost } from "../../../Redux/post";
import { useSelector } from "react-redux";
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
  const token = useSelector((state: RootState) => state.authReducer.token);
  const postDelete = async () => {
    if (token) {
      deletePost(token, postId);
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
