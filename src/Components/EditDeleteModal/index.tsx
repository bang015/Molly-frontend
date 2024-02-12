import { Modal } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux";
import "./index.css";
import { deleteComment } from "../../Redux/comment";
interface EditDeleteModalProps {
  userId: number;
  id: number;
  onClose: () => void;
}
const EditDeleteModal: React.FC<EditDeleteModalProps> = ({
  userId,
  id,
  onClose,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const removeComment = () => {
    if(token)
    dispatch(deleteComment({id, token}) as any)
    // deleteComment(commentId, token!);
  }
  return (
    <div>
      <Modal open={userId !== null} onClose={onClose}>
        <div className="post-detail">
          <div className="modal-container">
            {userId === user!.id ? (
              <div>
                <div>
                  <button className="mbtn1 mbtnc">수정</button>
                </div>
                <div>
                  <button className="mbtnc" onClick={removeComment}>삭제</button>
                </div>
              </div>
            ) : (
              <div>
                <button className="mbtn1 mbtnc">신고</button>
              </div>
            )}
            <div >
              <button className="mbtn2" onClick={onClose}>취소</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditDeleteModal;
