import { Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { followUser, followedCheck } from '@/redux/follow'
import { closeSubModal, openModal } from '@/redux/modal'

const PostActionModal: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.authReducer.user)
  const Followed = useSelector((state: RootState) => state.followReducer.followed)
  const { isSubOpen, post } = useSelector((state: RootState) => state.modalReducer)
  const [checkFollowed, setCheckFollowed] = useState(false)

  useEffect(() => {
    if(user?.id !== post?.userId){
      followCheck()
    }
  }, [user, post, Followed])
  const handleUnFollow = () => {
    const followUserId = post?.userId!
    dispatch(followUser({ followUserId }) as any)
    dispatch(closeSubModal())
  }
  const followCheck = async () => {
    if (post) {
      const result = await followedCheck(post.userId)
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
          <div className="modal-container">
            {post?.userId === user!.id ? (
              <div className="editBtn">
                <div>
                  <button
                    className="mbtn1 mbtnc"
                    onClick={() => {
                      dispatch(openModal({ modalType: 'PostFormModal', id: post?.id, post: post }))
                    }}
                  >
                    수정
                  </button>
                </div>
                <div>
                  <button
                    className="mbtnc"
                    onClick={() => {
                      dispatch(openModal({ modalType: 'DeleteModal', id: post?.id, post: post }))
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="editBtn">
                <div>
                  <button className="mbtn1 mbtnc">신고</button>
                </div>
                {checkFollowed && (
                  <div>
                    <button className="mbtnc" onClick={handleUnFollow}>
                      팔로우 취소
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="editBtn">
              <button
                className="mbtn2"
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
