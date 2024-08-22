import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFollowing } from '@/redux/follow'
import { RootState } from '@/redux'
import FollowListUser from '../followListUser'
import { FollowType } from '@/interfaces/follow'
interface followListProps {
  keyword: string
}
const FollowingList: React.FC<followListProps> = ({ keyword }) => {
  const target = useRef<HTMLDivElement | null>(null)
  const [hasObserved, setHasObserved] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const follow = useSelector((state: RootState) => state.followReducer.list.following)
  const totalPages = useSelector((state: RootState) => state.followReducer.totalPages.following)
  const userId = useSelector((state: RootState) => state.modalReducer.id)
  const callback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !isFetching) {
      if (hasObserved) {
        setIsFetching(true)
        if (page < totalPages) {
          setPage(prevPage => prevPage + 1)
        }
        setIsFetching(false)
      } else {
        setHasObserved(true)
      }
    }
  }
  const observer = new IntersectionObserver(callback, {
    threshold: 0.5,
  })

  useEffect(() => {
    if (target.current) {
      observer.observe(target.current)
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current)
      }
    }
  }, [observer])
  useEffect(() => {
    if (userId) dispatch(getFollowing({ userId, page, keyword }) as any)
  }, [userId, page, keyword])
  return (
    <div className="follow">
      {follow.map((user: FollowType) => (
        <div key={user.id}>
          <FollowListUser key={user.id} user={user} type="" />
        </div>
      ))}
      <div ref={target}></div>
    </div>
  )
}

export default FollowingList
