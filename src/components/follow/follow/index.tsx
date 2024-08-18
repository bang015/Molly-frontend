import { Modal } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import FollowList from '../followingList'
import FollowerList from '../followerList'
import { clearFollowList } from '@/redux/follow'
interface followProps {
  userId: number
  followOpen: boolean
  followType: string
  onFollowClose: () => void
}
const Follow: React.FC<followProps> = ({ userId, followOpen, followType, onFollowClose }) => {
  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState('')
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    dispatch(clearFollowList())
  }
  return (
    <div>
      <Modal open={followOpen} onClose={onFollowClose}>
        <div className="modal">
          <div className="pointer-events-auto size-[400px] overflow-hidden rounded-lg bg-white">
            <div className="flex size-full flex-col">
              <div className="border-b p-3 text-center text-body16sd">
                <div>{followType === 'follow' ? '팔로잉' : '팔로워'}</div>
              </div>
              <div className="px-5 py-2.5">
                <input
                  className="w-full rounded bg-gray-200 px-5 py-2 outline-0"
                  type="text"
                  placeholder="검색"
                  onChange={handleSearch}
                />
              </div>
              <div className="grow overflow-y-scroll pl-5">
                {followType === 'follow' && (
                  <FollowList userId={userId} keyword={keyword} onFollowClose={onFollowClose} />
                )}
                {followType === 'follower' && (
                  <FollowerList userId={userId} keyword={keyword} onFollowClose={onFollowClose} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Follow
