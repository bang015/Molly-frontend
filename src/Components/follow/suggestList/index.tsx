import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import React, { useEffect } from 'react'
import { clearFollowList, getSuggestFollow } from '@/redux/follow'
import './index.css'
import FollowListUser from '../followListUser'
interface SuggestListProps {
  limit: number
}

export const SuggestList: React.FC<SuggestListProps> = ({ limit }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearFollowList())
    dispatch(getSuggestFollow({ limit }) as any)
  }, [limit])
  const suggestList = useSelector((state: RootState) => state.followReducer.suggestList)

  return (
    <div className="list">
      {suggestList.map(user => (
        <FollowListUser key={user.id} user={user} type="sug" />
      ))}
    </div>
  )
}
