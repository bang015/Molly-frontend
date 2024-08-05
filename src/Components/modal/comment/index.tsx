import { Modal } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import './index.css'
import { deleteComment, updatePending } from '@/redux/comment'
import { CommentType } from '@/interfaces/comment'
import { closeSubModal } from '@/redux/modal'
// interface EditDeleteModalProps {
//   open: boolean;
//   comment: CommentType;
//   onClose: () => void;
// }
const CommentActionModal: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.authReducer.user)
  const { comment, isOpen } = useSelector((state: RootState) => state.modalReducer)
  if (!comment) {
    return
  }
  const id = comment.id
  const userId = comment.userId
  const removeComment = () => {
    dispatch(deleteComment({ id }) as any)
    dispatch(closeSubModal())
  }

  const updateComment = () => {
    dispatch(updatePending(comment))
    dispatch(closeSubModal())
  }
  return (
    <div>
      <Modal open={isOpen} onClose={() => {dispatch(closeSubModal())}}>
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
              <button className="mbtn2" onClick={() => {dispatch(closeSubModal())}}>
                취소
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CommentActionModal
