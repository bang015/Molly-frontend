import { Avatar, Button, Modal } from '@mui/material'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import './index.css'
import { getSearchResult } from '@/redux/search'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { socket } from '@/redux/auth'
interface createRoomProps {
  open: boolean
  onClose: () => void
}
const CreateRoom: React.FC<createRoomProps> = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const result = useSelector((state: RootState) => state.searchReducer.result)
  const [chatUser, setChatUser] = useState<string | null>(null)
  const handleSeach = (e: React.ChangeEvent<HTMLInputElement>) => {
    let keyword = e.target.value
    if (keyword !== '') {
      const type = 'user'
      dispatch(getSearchResult({ keyword, type }) as any)
    }
  }
  const handleChatUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatUser(e.target.value)
  }
  const handleCteartChat = () => {
    if (socket && chatUser) {
      socket.emit('create-room', { chatUser })
    }
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal">
        <div className="pointer-events-auto flex h-[550px] flex-col rounded-lg bg-white">
          <div className="w-[540px] border-b p-5 text-center text-body16sd">새로운 메시지</div>
          <div className="flex items-center px-5 py-1">
            <div className="text-body14sd">받는 사람: </div>
            <div className="grow">
              <input
                className="w-full p-2 outline-none"
                type="text"
                placeholder="검색..."
                onChange={handleSeach}
              />
            </div>
          </div>
          <div className="grow overflow-y-scroll border-t">
            {result.map(user => (
              <label key={user.id} htmlFor={user.id.toString()}>
                <div
                  className="flex cursor-pointer items-center rounded-lg p-2.5 hover:bg-gray-100"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex size-[44px] flex-col justify-center overflow-hidden rounded-full border bg-white">
                    <Avatar src={user.profileImage?.path} sx={{ width: 44, height: 44 }} />
                  </div>
                  <div className="flex grow flex-col pl-2.5 text-body14m">
                    {user.name}
                    <div className="text-body14rg text-gray-500">{user.nickname}</div>
                  </div>
                  <input
                    type="radio"
                    name="user"
                    id={user.id.toString()}
                    value={user.id}
                    onChange={handleChatUser}
                  />
                </div>
              </label>
            ))}
          </div>
          <div className="p-4">
            <button className="btn w-full" onClick={handleCteartChat}>
              채팅
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CreateRoom
