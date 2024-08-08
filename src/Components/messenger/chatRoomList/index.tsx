import React, { useEffect, useState } from 'react'
import './index.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { UserType } from '@/interfaces/user'
import { Avatar } from '@mui/material'
import { MessageType } from '@/interfaces/message'
import { displayCreateAt } from '@/utils/format/moment'
import { socket } from '@/redux/auth'
interface chatRoomListProps {
  roomId: number
  handleChatRoom: (roomId: number) => void
}
const ChatRoomList: React.FC<chatRoomListProps> = ({ roomId, handleChatRoom }) => {
  const { user } = useSelector((state: RootState) => state.authReducer)
  const [_message, set_message] = useState<number | null>(null)
  const [chatUser, setChatUser] = useState<UserType | null>(null)
  const [latestMessage, setLatestMessage] = useState<MessageType | null>(null)
  useEffect(() => {
    if (socket && roomId) {
      socket.emit('getRoomInfo', { roomId })
      socket.on('newMessage', data => {
        if (data.sendUser === user?.id && socket) {
          socket.emit('getRoomInfo', { roomId })
          socket.emit('getNotReadMessage')
        }
      })
      socket.on(`getRoomInfo${roomId}`, (data): void => {
        set_message(data._message)
        setChatUser(data.user)
        setLatestMessage(data.latestMessage)
      })
    }
  }, [roomId])

  return (
    <div
      className="flex items-center rounded p-5 hover:bg-gray-100"
      onClick={() => {
        handleChatRoom(roomId)
      }}
    >
      <div className="mr-3 rounded-full border">
        <Avatar src={chatUser?.profileImage?.path} sx={{ width: 44, height: 44 }} />
      </div>
      <div className="flex flex-col">
        <div className="text-body16m">{chatUser?.name}</div>
        <div className="flex items-center">
          <div className="text-body14rg">{latestMessage?.message}</div>
          <div className="ml-1 text-body14rg">
            • {latestMessage && displayCreateAt(latestMessage.createdAt)}
          </div>
        </div>
      </div>
      <div className="flex grow justify-end">
        {_message !== 0 && (
          <span className="flex size-[20px] items-center justify-center rounded-full bg-main p-1 text-body12rg text-white">
            {_message}
          </span>
        )}
      </div>
    </div>
  )
}

export default ChatRoomList
