import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFollowing } from '@/redux/follow'
import { RootState } from '@/redux'
import FollowListUser from '../followListUser'
import { FollowType } from '@/interfaces/follow'
interface followListProps {
  userId: number
  keyword: string
  onFollowClose: () => void
}
const FollowingList: React.FC<followListProps> = ({ userId, keyword, onFollowClose }) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const follow = useSelector((state: RootState) => state.followReducer.list.following)
  const totalPages = useSelector((state: RootState) => state.followReducer.totalPages.following)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.9) {
        if (page < totalPages) {
          setPage(prevPage => prevPage + 1)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [page, totalPages])
  useEffect(() => {
    dispatch(getFollowing({ userId, page, keyword }) as any)
  }, [userId, page, keyword])

  return (
    <div className="follow">
      {follow.map((user: FollowType) => (
        <div key={user.id} onClick={onFollowClose}>
          <FollowListUser key={user.id} user={user} type="" />
        </div>
      ))}
    </div>
  )
}

export default FollowingList
