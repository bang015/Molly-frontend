import { Modal } from '@mui/material'
import React from 'react'
import { deletePost } from '@/redux/post'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { closeModal, closeSubModal } from '@/redux/modal'

const DeleteModal: React.FC = () => {
  const dispatch = useDispatch()
  const { isSubOpen, id } = useSelector((state: RootState) => state.modalReducer)
  const postDelete = async () => {
    if (id) {
      const result = await dispatch(deletePost({ postId: id }) as any)
      if (result) {
        dispatch(closeSubModal())
        dispatch(closeModal())
      }
    }
  }
  return (
    <div>
      <Modal
        open={isSubOpen}
        onClose={() => {
          dispatch(closeSubModal())
        }}
      >
        <div className="modal">
          <div className="pointer-events-auto flex flex-col rounded-xl bg-white">
            <div className="w-[400px] border-b p-5 text-center text-body18sd">
              게시물을 삭제할까요?
            </div>
            <div className="flex flex-col">
              <button
                className="w-[400px] border-b p-5 text-body14sd text-red-500"
                onClick={postDelete}
              >
                삭제
              </button>
            </div>
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

export default DeleteModal
