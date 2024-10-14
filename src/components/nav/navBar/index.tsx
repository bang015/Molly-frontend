import React, { useState, useEffect, useRef } from 'react'
import {
  Avatar,
  Badge,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Logo from '@/icons/molly-logo.svg?react'
import SmallLogo from '@/icons/molly-small-logo.svg?react'
import HomeIcon from '@mui/icons-material/Home'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import SearchIcon from '@mui/icons-material/Search'
import LogoutIcon from '@mui/icons-material/Logout'
import ExploreIcon from '@mui/icons-material/Explore'
import SyncLockIcon from '@mui/icons-material/SyncLock'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import EmailIcon from '@mui/icons-material/Email'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { signOut } from '@/redux/auth'
import Search from '@/components/nav/search/search'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearPostList } from '@/redux/postList'
import { openSubModal } from '@/redux/modal'
import { getUnreadCount } from '@/redux/chat'
import { subscribeToMessages } from '@/common/socket'
const Nav: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)
  const { user, isConnected } = useSelector((state: RootState) => state.authReducer)
  const { unreadCount } = useSelector((state: RootState) => state.chatReducer)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMore, setIsMore] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  useEffect(() => {
    dispatch(getUnreadCount() as any)
  }, [])
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsCollapsed(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef])

  useEffect(() => {
    let subscription: any
    if (isConnected && user) {
      subscription = subscribeToMessages(`/user/${user?.id}/updateCount`, message => {
        dispatch(getUnreadCount() as any)
      })
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [isConnected, user, dispatch])
  const handleSignOut = () => {
    dispatch(clearPostList())
    dispatch(signOut() as any)
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
  }

  const toggleSearch = () => {
    setIsCollapsed(!isCollapsed)
    setIsTransitioning(true)
  }

  const getTextVisibilityClass = () => {
    return isTransitioning || !isCollapsed || location.pathname === '/messenger' ? 'hidden ' : ''
  }

  return (
    <div
      ref={searchRef}
      className={`fixed left-0 top-0 z-10 bg-white flex h-full ${location.pathname === '/messenger' ? 'w-16' : 'w-1/6 min-w-[200px]'}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className={`flex flex-shrink-0 flex-col border-r py-3 transition-all duration-300 ${!isCollapsed || location.pathname === '/messenger' ? 'w-16' : 'w-full'}`}
      >
        <div
          className="mb-3 flex h-[70px] flex-col pl-3.5 pt-2"
          onClick={() => {
            navigate('/')
          }}
        >
          {!isCollapsed || location.pathname === '/messenger' ? (
            <SmallLogo width={40} />
          ) : (
            <Logo width={110} />
          )}
        </div>
        <div className="grow space-y-2">
          <ListItemButton
            className="h-10"
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              navigate('/')
            }}
          >
            <ListItemIcon>
              {location.pathname === '/' ? (
                <HomeIcon sx={{ fontSize: 30, color: 'black' }} />
              ) : (
                <HomeOutlinedIcon sx={{ fontSize: 30, color: 'black' }} />
              )}
            </ListItemIcon>
            <ListItemText
              className={`m-0 ${getTextVisibilityClass()}`}
              primary="홈"
              primaryTypographyProps={{
                className: ` ${location.pathname === '/' && 'text-body16sd'}`,
              }}
            />
          </ListItemButton>
          <ListItemButton
            className="h-10"
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              toggleSearch()
            }}
          >
            <ListItemIcon>
              <SearchIcon sx={{ fontSize: 30, color: 'black' }} />
            </ListItemIcon>
            <ListItemText className={`m-0 ${getTextVisibilityClass()}`} primary="검색" />
          </ListItemButton>
          <ListItemButton
            className="h-10"
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              navigate('/explore')
            }}
          >
            <ListItemIcon>
              {location.pathname === '/explore' ? (
                <ExploreIcon sx={{ fontSize: 30, color: 'black' }} />
              ) : (
                <ExploreOutlinedIcon sx={{ fontSize: 30, color: 'black' }} />
              )}
            </ListItemIcon>
            <ListItemText
              className={`m-0 ${getTextVisibilityClass()}`}
              primary="탐색"
              primaryTypographyProps={{
                className: `${location.pathname === '/explore' && 'text-body16sd'}`,
              }}
            />
          </ListItemButton>
          <ListItemButton
            className="h-10"
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              navigate('/messenger')
            }}
          >
            <ListItemIcon>
              <Badge badgeContent={unreadCount} color="primary">
                {location.pathname === '/messenger' ? (
                  <EmailIcon sx={{ fontSize: 30, color: 'black' }} />
                ) : (
                  <EmailOutlinedIcon sx={{ fontSize: 30, color: 'black' }} />
                )}
              </Badge>
            </ListItemIcon>
            <ListItemText className={`m-0 ${getTextVisibilityClass()}`} primary="메시지" />
          </ListItemButton>
          <ListItemButton
            className="h-10"
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              dispatch(
                openSubModal({
                  subModalType: 'PostFormModal',
                  id: null,
                  post: null,
                }),
              )
            }}
          >
            <ListItemIcon>
              <AddBoxOutlinedIcon sx={{ fontSize: 30, color: 'black' }} />
            </ListItemIcon>
            <ListItemText className={`m-0 ${getTextVisibilityClass()}`} primary="게시물" />
          </ListItemButton>
          <ListItemButton
            className="h-10"
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              navigate(`/profile/${user?.nickname}`)
            }}
          >
            <ListItemAvatar>
              <Avatar
                alt="profile"
                src={user?.profileImage?.path}
                style={{ width: 30, height: 30 }}
              />
            </ListItemAvatar>
            <ListItemText
              className={`m-0 ${getTextVisibilityClass()}`}
              primary="프로필"
              primaryTypographyProps={{
                className: `${location.pathname.includes('/profile/') && 'text-body16sd'}`,
              }}
            />
          </ListItemButton>
        </div>
        {isMore && (
          <div className="flex flex-col border-t">
            <button
              onClick={() => {
                dispatch(
                  openSubModal({
                    subModalType: 'ModifyPasswordModal',
                  }),
                )
              }}
              className="flex justify-start border-b p-5 text-body16sd text-red-500"
            >
              {isTransitioning || !isCollapsed || location.pathname === '/messenger' ? (
                <SyncLockIcon />
              ) : (
                '비밀번호 변경'
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="flex justify-start border-b p-5 text-body16sd text-red-500"
            >
              {isTransitioning || !isCollapsed || location.pathname === '/messenger' ? (
                <LogoutIcon />
              ) : (
                '로그아웃'
              )}
            </button>
          </div>
        )}
        <div className="mb-4">
          <ListItemButton
            className="h-10"
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              setIsMore(!isMore)
            }}
          >
            <ListItemIcon>
              <DehazeIcon sx={{ fontSize: 30, color: 'black' }} />
            </ListItemIcon>
            <ListItemText className={`m-0 ${getTextVisibilityClass()}`} primary="더보기" />
          </ListItemButton>
        </div>
      </div>
      <div
        ref={searchRef}
        className={`flex flex-shrink-0 flex-col rounded-r-xl border-r bg-white transition-all duration-300 ease-in-out ${
          !isCollapsed ? 'visible w-96 opacity-100' : 'invisible w-0 opacity-0'
        }`}
      >
        <Search />
      </div>
    </div>
  )
}

export default Nav
