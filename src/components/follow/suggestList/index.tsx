import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import React, { useEffect } from 'react'
import { clearFollowList, getSuggestFollow } from '@/redux/follow'
import FollowListUser from '../followListUser'
import { FollowType } from '@/interfaces/follow'
interface SuggestListProps {
  limit: number
}

export const SuggestList: React.FC<SuggestListProps> = ({ limit }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearFollowList())
    dispatch(getSuggestFollow(limit) as any)
  }, [limit])
  const suggestList = useSelector((state: RootState) => state.followReducer.list.suggest)
  return (
    <div>
      {suggestList.map((user: FollowType) => (
        <FollowListUser key={user.id} user={user} type="sug" />
      ))}
    </div>
  )
}
