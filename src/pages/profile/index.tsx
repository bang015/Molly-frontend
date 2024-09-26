import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import Nav from '@/components/nav/navBar'
import { getProfile } from '@/redux/user'
import AppsIcon from '@mui/icons-material/Apps'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import UserPostList from '@/components/profile/userPostList'
import Header from '@/components/profile/header'
import BookmarkList from '@/components/profile/bookmarkList'

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user)
  const { profile } = useSelector((state: RootState) => state.userReducer)
  const { followed } = useSelector((state: RootState) => state.followReducer)
  const dispatch = useDispatch()
  const [selection, setSelection] = useState<string>('post')
  const { nickname } = useParams()
  useEffect(() => {
    if (nickname) {
      dispatch(getProfile(nickname) as any)
    }
  }, [nickname, followed])
  return (
    <div className="flex size-full">
      <Nav />
      <div className="ml-[16.6667%] flex size-full min-w-body510 justify-center overflow-y-scroll">
        {profile ? (
          <div className="w-[70%] p-12">
            <Header profile={profile} />
            <div className="flex justify-center border-t">
              <button
                className={`py-5 text-body14m ${selection === 'post' && 'mt-[-1px] border-t-2 border-main text-body14sd text-main'}`}
                onClick={() => {
                  setSelection('post')
                }}
              >
                <AppsIcon />
                게시물
              </button>
              {profile.id === user?.id && (
                <button
                  className={`ml-10 py-5 text-body14m ${selection === 'bookmark' && 'mt-[-1px] border-t-2 border-main text-body14sd text-main'}`}
                  onClick={() => {
                    setSelection('bookmark')
                  }}
                >
                  <BookmarkBorderIcon />
                  저장됨
                </button>
              )}
            </div>
            {selection === 'post' && <UserPostList userId={profile.id!} />}
            {selection === 'bookmark' && <BookmarkList userId={profile.id!} />}
          </div>
        ) : (
          <div>죄송합니다. 페이지를 사용할 수 없습니다.</div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
