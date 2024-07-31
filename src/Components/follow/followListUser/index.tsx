import React, { useEffect, useState } from 'react'
import { FollowType } from '@/interfaces/follow'
import { followUser, followedCheck } from '@/redux/follow'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import './index.css'
import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
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
    dispatch(followUser({ followUserId }) as any)
  }
  const goToProfilePage = () => {
    navigate(`/profile/${user.nickname}`)
  }
  return (
    <div className="followListUser">
      <ListItem
        key={user.id}
        style={{ zIndex: 99, padding: 0 }}
        secondaryAction={
          <Button
            variant={followed ? 'outlined' : 'contained'}
            disableElevation
            onClick={() => handleFollow(user.id)}
            style={{ zIndex: 99 }}
          >
            {followed ? '팔로잉' : '팔로우'}
          </Button>
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
          primary={<span className="nickname">{user.nickname}</span>}
          secondary={
            <span>
              {user.name}
              {type === 'sug' && <span>{user.message}</span>}
            </span>
          }
        />
      </ListItem>
    </div>
  )
}

export default FollowListUser
