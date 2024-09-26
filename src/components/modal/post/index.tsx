import { Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { followUser, followedCheck } from '@/redux/follow'
import { closeSubModal, openModal, openSubModal } from '@/redux/modal'

const PostActionModal: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.authReducer.user)
  const Followed = useSelector((state: RootState) => state.followReducer.followed)
  const { isSubOpen, post } = useSelector((state: RootState) => state.modalReducer)
  const [checkFollowed, setCheckFollowed] = useState(false)

  useEffect(() => {
    if (user?.id !== post?.user.id) {
      followCheck()
    }
  }, [user, post, Followed])
  const handleUnFollow = () => {
    const followUserId = post?.user.id!
    dispatch(followUser(followUserId) as any)
    dispatch(closeSubModal())
  }
  const followCheck = async () => {
    if (post) {
      const result = await followedCheck(post.user.id)
      setCheckFollowed(result)
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
            {post?.user.id === user!.id ? (
              <div className="flex flex-col">
                <button
                  className="w-[400px] border-b p-5 text-body14sd text-red-500"
                  onClick={() => {
                    dispatch(
                      openSubModal({ subModalType: 'PostFormModal', id: post?.id, post: post }),
                    )
                  }}
                >
                  수정
                </button>
                <button
                  className="w-[400px] border-b p-5 text-body14sd text-red-500"
                  onClick={() => {
                    dispatch(
                      openSubModal({ subModalType: 'DeleteModal', id: post?.id, post: post }),
                    )
                  }}
                >
                  삭제
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <button className="w-[400px] border-b p-5 text-body14sd text-red-500">신고</button>
                {checkFollowed && (
                  <button
                    className="w-[400px] border-b p-5 text-body14sd text-red-500"
                    onClick={handleUnFollow}
                  >
                    팔로우 취소
                  </button>
                )}
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
export default PostActionModal
