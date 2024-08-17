import React, { useEffect, useState } from 'react'
import { FollowType } from '@/interfaces/follow'
import { followUser, followedCheck } from '@/redux/follow'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface followListUserProps {
  user: FollowType
  type: string
}
const FollowListUser: React.FC<followListUserProps> = ({ user, type }) => {
  const navigate = useNavigate()
  const checkFollowed = useSelector((state: RootState) => state.followReducer.followed)
  const dispatch = useDispatch()
  const [followed, setFollowed] = useState(false)
  useEffect(() => {
    const check = async () => {
      const result = await followedCheck(user.id)
      setFollowed(result)
    }
    check()
  }, [user, checkFollowed])
  const handleFollow = (followUserId: number) => {
    dispatch(followUser(followUserId) as any)
  }
  const goToProfilePage = () => {
    navigate(`/profile/${user.nickname}`)
  }
  return (
    <div>
      <ListItem
        key={user.id}
        style={{ padding: 0 }}
        secondaryAction={
          <button
            className={`btn h-9 rounded text-body14m ${followed && 'out-line'}`}
            onClick={() => handleFollow(user.id)}
          >
            {followed ? '팔로잉' : '팔로우'}
          </button>
        }
      >
        <ListItemAvatar onClick={goToProfilePage}>
          <Avatar
            src={user.profileImage?.path}
            sx={type === 'sug' ? { width: '50px', height: '50px' } : {}}
          />
        </ListItemAvatar>
        <ListItemText
          style={{ cursor: 'pointer' }}
          onClick={goToProfilePage}
          primary={<span className="text-body14sd text-black">{user.nickname}</span>}
          secondary={
            <span className="block text-body12rg">
              {user.name}
              {type === 'sug' && <span className="block text-body12rg">{user.message}</span>}
            </span>
          }
        />
      </ListItem>
    </div>
  )
}

export default FollowListUser
