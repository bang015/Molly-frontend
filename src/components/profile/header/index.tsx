import React, { useEffect, useState } from 'react'
import { UserType } from '@/interfaces/user'
import { Avatar, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { clearFollowList, followUser, followedCheck } from '@/redux/follow'
import EditImage from '../profileImage/editImage'
import EditProfile from '../editProfile'
import { openSubModal } from '@/redux/modal'
interface headerProps {
  profile: UserType
}
const Header: React.FC<headerProps> = ({ profile }) => {
  const user = useSelector((state: RootState) => state.authReducer.user)
  const loading = useSelector((state: RootState) => state.userReducer.editLoading)
  const [showImage, setShowImage] = useState('')
  const [checkFollowed, setCheckFollowed] = useState(false)
  const [editImage, setEditImage] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearFollowList())
    if (profile.id !== user?.id) {
      const check = async () => {
        const result = await followedCheck(profile.id!)
        console.log(result)
        setCheckFollowed(result)
      }
      check()
    }
  }, [profile.id])
  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const currentImageUrl = URL.createObjectURL(file)
    setEditImage(true)
    setShowImage(currentImageUrl)
    e.target.value = ''
  }

  const onEditImgClose = () => {
    setEditImage(false)
    setShowImage('')
  }
  const handleFollow = async () => {
    const followUserId = profile?.id!
    const result = await dispatch(followUser(followUserId) as any)
    setCheckFollowed(result.payload)
  }
  const EditProfileOpen = () => {
    setEditProfile(true)
  }
  const EditProfileClose = () => {
    setEditProfile(false)
  }
  return (
    <div className="flex items-center pb-[100px]">
      <div className="px-20">
        <label htmlFor="profileImageInput">
          <input
            className="hidden"
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={handleProfileImg}
          />
          {editImage && (
            <EditImage open={editImage} onClose={onEditImgClose} showImage={showImage} />
          )}
          <div className="relative mx-auto size-[150px] overflow-hidden rounded-full border">
            {loading && (
              <div className="absolute z-10 flex size-full items-center justify-center bg-black bg-opacity-50">
                <CircularProgress />
              </div>
            )}
            <Avatar src={profile.profileImage?.path} sx={{ width: 150, height: 150 }} />
          </div>
        </label>
      </div>
      <div className="flex grow flex-col">
        <div className="my-3 flex items-center text-body18sd">
          <div>{profile?.nickname}</div>
          <div className="ml-3">
            {profile.id === user?.id ? (
              <div>
                <button className="btn h-9 text-body14sd" onClick={EditProfileOpen}>
                  프로필 편집
                </button>
                {editProfile && (
                  <EditProfile open={editProfile} onClose={EditProfileClose} profile={profile} />
                )}
              </div>
            ) : (
              <button
                onClick={handleFollow}
                className={`btn h-9 text-body14sd ${checkFollowed && 'out-line'}`}
              >
                {checkFollowed ? '팔로잉' : '팔로우'}
              </button>
            )}
          </div>
        </div>
        <div className="text-body16rg mr-5 flex space-x-7 py-3">
          <div className="cursor-pointer">
            게시물 <span className="text-body16sd">{profile.postCount}</span>
          </div>
          <div
            className="cursor-pointer"
            onClick={() =>
              dispatch(openSubModal({ subModalType: 'FollowModal', followType: 'follower', id: profile.id }))
            }
          >
            팔로워 <span className="text-body16sd">{profile.followerCount}</span>
          </div>
          <div
            className="cursor-pointer"
            onClick={() =>
              dispatch(openSubModal({ subModalType: 'FollowModal', followType: 'follow', id: profile.id }))
            }
          >
            팔로우 <span className="text-body16sd">{profile.followingCount}</span>
          </div>
        </div>
        <div className="text-body14sd">{profile?.name}</div>
        <div className="text-body14rg">{profile?.introduce}</div>
      </div>
    </div>
  )
}

export default Header
