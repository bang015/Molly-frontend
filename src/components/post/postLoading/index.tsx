import React from 'react'
import { CircularProgress, Modal } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { closeModal } from '@/redux/modal'

const PostLoading: React.FC = () => {
  const dispatch = useDispatch()
  const { loading, message } = useSelector((state: RootState) => state.postReducer)
  const { isOpen } = useSelector((state: RootState) => state.modalReducer)
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          if (!loading) {
            dispatch(closeModal())
          }
        }}
      >
        <div className="absolute left-1/2 top-1/2 h-[740px] w-[660px] -translate-x-1/2 -translate-y-1/2 transform rounded-[8px] bg-white">
          <div className="flex h-10 w-full items-center justify-center border-b text-body16sd">
            {loading ? '게시물을 공유중입니다.' : message}
          </div>
          <div className="flex h-[90%] w-auto items-center justify-center">
            {loading ? (
              <CircularProgress size={100} />
            ) : (
              <div>
                <div className="p-5 text-center">
                  <CheckCircleOutlineIcon sx={{ fontSize: 100 }} />
                </div>
                <div>{message}</div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PostLoading
