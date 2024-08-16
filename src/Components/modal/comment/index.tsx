import { Modal } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { deleteComment, setEditingComment } from '@/redux/comment'
import { closeSubModal } from '@/redux/modal'

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
    dispatch(deleteComment({id, commentId: comment.commentId}) as any)
    dispatch(closeSubModal())
  }

  const updateComment = () => {
    dispatch(setEditingComment(comment))
    dispatch(closeSubModal())
  }
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(closeSubModal())
        }}
      >
        <div className="modal">
          <div className="pointer-events-auto flex flex-col rounded-xl bg-white">
            {userId === user!.id ? (
              <div className="flex flex-col">
                <button
                  className="w-[400px] border-b p-5 text-body14sd text-red-500"
                  onClick={updateComment}
                >
                  수정
                </button>
                <button
                  className="w-[400px] border-b p-5 text-body14sd text-red-500"
                  onClick={removeComment}
                >
                  삭제
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <button className="w-[400px] border-b p-5 text-body14sd text-red-500">신고</button>
              </div>
            )}
            <div className="flex flex-col">
              <button
                className="w-[400px] p-5 text-body14sd"
                onClick={() => {
                  dispatch(closeSubModal())
                }}
              >
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
