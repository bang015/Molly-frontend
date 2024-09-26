import { CircularProgress, Modal } from '@mui/material'
import React from 'react'
import { deletePost } from '@/redux/post'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { closeModal, closeSubModal } from '@/redux/modal'

const DeleteModal: React.FC = () => {
  const dispatch = useDispatch()
  const { isSubOpen, id } = useSelector((state: RootState) => state.modalReducer)
  const { loading } = useSelector((state: RootState) => state.postReducer)
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
    <Modal
      open={isSubOpen}
      onClose={() => {
        if (!loading) {
          dispatch(closeSubModal())
        }
      }}
    >
      <div className="modal">
        <div className="pointer-events-auto flex w-[400px] flex-col rounded-xl bg-white">
          <div className="border-b p-5 text-center text-body18sd">
            {loading ? '게시물을 삭제중입니다' : '게시물을 삭제할까요?'}
          </div>
          {loading ? (
            <div className="p-10 text-center">
              <CircularProgress size={100} />
            </div>
          ) : (
            <div>
              <div className="flex flex-col">
                <button className="border-b p-5 text-body14sd text-red-500" onClick={postDelete}>
                  삭제
                </button>
              </div>
              <div className="flex flex-col">
                <button
                  className="p-5 text-body14sd"
                  onClick={() => {
                    dispatch(closeSubModal())
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default DeleteModal
