import { Modal } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import "./index.css";
import { deleteComment, updatePending } from "@/redux/comment";
import { commentType } from "@/interfaces/comment";
interface EditDeleteModalProps {
  open: boolean;
  comment: commentType;
  onClose: () => void;
}
const EditDeleteModal: React.FC<EditDeleteModalProps> = ({
  open,
  comment,
  onClose,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const id = comment.id;
  const userId = comment.userId;
  const removeComment = () => {
    if (token) dispatch(deleteComment({ id, token }) as any);
    onClose();
  };

  const updateComment = () => {
    dispatch(updatePending(comment));
    onClose();
  };
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="post-detail">
          <div className="modal-container">
            {userId === user!.id ? (
              <div className="editBtn">
                <div>
                  <button className="mbtn1 mbtnc" onClick={updateComment}>
                    수정
                  </button>
                </div>
                <div>
                  <button className="mbtnc" onClick={removeComment}>
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="editBtn">
                <button className="mbtn1 mbtnc">신고</button>
              </div>
            )}
            <div className="editBtn">
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

export default EditDeleteModal;
