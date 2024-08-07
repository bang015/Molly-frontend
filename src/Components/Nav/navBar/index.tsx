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
import ExploreIcon from '@mui/icons-material/Explore'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import EmailIcon from '@mui/icons-material/Email'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { signOut } from '@/redux/auth'
import Search from '@/components/nav/search/search'
import { useLocation, useNavigate } from 'react-router-dom'
import { socket } from '@/redux/auth'
import { clearPostList } from '@/redux/postList'
import { openModal } from '@/redux/modal'
const Nav: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)
  const { user } = useSelector((state: RootState) => state.authReducer)
  const [_message, set_message] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsCollapsed(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef])

  useEffect(() => {
    if (socket) {
      socket.emit('getNotReadMessage')
      socket.on('allNotReadMessage', data => {
        set_message(data)
      })
      socket.on('newMessage', data => {
        if (data.sendUser === user?.id && socket) {
          socket.emit('getNotReadMessage')
        }
      })
    }
  }, [socket])
  const handleSignOut = () => {
    dispatch(clearPostList())
    dispatch(signOut() as any)
  }

  const toggleSearch = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      ref={searchRef}
      className={`fixed left-0 top-0 z-10 flex h-full min-w-16 ${location.pathname === '/messenger' ? 'w-16' : 'w-1/6'}`}
    >
      <div
        className={`flex flex-shrink-0 flex-col border-r py-3 transition-all duration-300 ${isCollapsed || location.pathname === '/messenger' ? 'w-16' : 'w-full'}`}
      >
        <div
          className="mb-3 flex h-[70px] flex-col pl-3.5 pt-2"
          onClick={() => {
            navigate('/')
          }}
        >
          {isCollapsed || location.pathname === '/messenger' ? (
            <SmallLogo width={40} />
          ) : (
            <Logo width={110} />
          )}
        </div>
        <div className="grow space-y-2">
          <ListItemButton
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
              className={`m-0 ${(isCollapsed || location.pathname === '/messenger') && 'hidden'}`}
              primary="Home"
              primaryTypographyProps={{
                className: ` ${location.pathname === '/' && 'text-body16sd'}`,
              }}
            />
          </ListItemButton>
          <ListItemButton
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              toggleSearch()
            }}
          >
            <ListItemIcon>
              <SearchIcon sx={{ fontSize: 30, color: 'black' }} />
            </ListItemIcon>
            <ListItemText
              className={`m-0 ${(isCollapsed || location.pathname === '/messenger') && 'hidden'}`}
              primary="Search"
            />
          </ListItemButton>
          <ListItemButton
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
              className={`m-0 ${(isCollapsed || location.pathname === '/messenger') && 'hidden'}`}
              primary="Explore"
              primaryTypographyProps={{
                className: `${location.pathname === '/explore' && 'text-body16sd'}`,
              }}
            />
          </ListItemButton>
          <ListItemButton
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              navigate('/messenger')
            }}
          >
            <ListItemIcon>
              <Badge badgeContent={_message} color="primary">
                {location.pathname === '/messenger' ? (
                  <EmailIcon sx={{ fontSize: 30, color: 'black' }} />
                ) : (
                  <EmailOutlinedIcon sx={{ fontSize: 30, color: 'black' }} />
                )}
              </Badge>
            </ListItemIcon>
            <ListItemText
              className={`m-0 ${(isCollapsed || location.pathname === '/messenger') && 'hidden'}`}
              primary="Messages"
            />
          </ListItemButton>
          <ListItemButton
            style={{ borderRadius: '12px' }}
            component="a"
            onClick={() => {
              dispatch(
                openModal({
                  modalType: 'PostFormModal',
                  id: null,
                  post: null,
                }),
              )
            }}
          >
            <ListItemIcon>
              <AddBoxOutlinedIcon sx={{ fontSize: 30, color: 'black' }} />
            </ListItemIcon>
            <ListItemText
              className={`m-0 ${(isCollapsed || location.pathname === '/messenger') && 'hidden'}`}
              primary="Post"
            />
          </ListItemButton>
          <ListItemButton
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
              className={`m-0 ${(isCollapsed || location.pathname === '/messenger') && 'hidden'}`}
              primary="Profile"
              primaryTypographyProps={{
                className: `${location.pathname.includes('/profile/') && 'text-body16sd'}`,
              }}
            />
          </ListItemButton>
        </div>
        <div className="mb-4">
          <ListItemButton style={{ borderRadius: '12px' }} component="a" onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutIcon sx={{ fontSize: 30, color: 'black' }} />
            </ListItemIcon>
            <ListItemText
              className={`m-0 ${(isCollapsed || location.pathname === '/messenger') && 'hidden'}`}
              primary="Logout"
            />
          </ListItemButton>
        </div>
      </div>
      <div
        ref={searchRef}
        className={`flex flex-shrink-0 flex-col rounded-r-xl border-r bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'visible w-96 opacity-100' : 'invisible w-0 opacity-0'
        }`}
      >
        <Search isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}

export default Nav
