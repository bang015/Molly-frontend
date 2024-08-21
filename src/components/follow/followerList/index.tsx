import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFollower } from '@/redux/follow'
import { RootState } from '@/redux'
import FollowListUser from '../followListUser'
import { FollowType } from '@/interfaces/follow'
interface followerListProps {
  keyword: string
}
const FollowerList: React.FC<followerListProps> = ({ keyword }) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const follow = useSelector((state: RootState) => state.followReducer.list.follower)
  const totalPages = useSelector((state: RootState) => state.followReducer.totalPages.follower)
  const userId = useSelector((state: RootState) => state.modalReducer.id)
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
    if (userId) dispatch(getFollower({ userId, page, keyword }) as any)
  }, [userId, page, keyword])
  return (
    <div className="follow">
      {follow.map((user: FollowType) => (
        <div key={user.id}>
          <FollowListUser key={user.id} user={user} type="" />
        </div>
      ))}
    </div>
  )
}

export default FollowerList
