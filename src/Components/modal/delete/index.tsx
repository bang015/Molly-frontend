import { Modal } from '@mui/material'
import React, { useEffect } from 'react'
import './index.css'
import { deletePost } from '@/redux/post'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { closeModal } from '@/redux/modal'

const DeleteModal: React.FC = () => {
  const dispatch = useDispatch()
  const { isOpen, id } = useSelector((state: RootState) => state.modalReducer)
  const postDelete = async () => {
    if (id) {
      const result = await dispatch(deletePost({ postId: id }) as any)
      if (result) {
        dispatch(closeModal())
      }
    }
  }
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(closeModal())
        }}
      >
        <div className="post-detail">
          <div className="modal-container">
            <div className="dbtnt">게시물을 삭제할까요?</div>
            <div className="editBtn">
              <button className="mbtnc" onClick={postDelete}>
                삭제
              </button>
            </div>
            <div className="editBtn">
              <button
                className="mbtn2"
                onClick={() => {
                  dispatch(closeModal())
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

export default DeleteModal
