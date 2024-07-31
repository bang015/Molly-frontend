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
      onClick={() => {
        handleChatRoom(roomId)
      }}
    >
      <div className="search_result" style={{ borderRadius: 0 }}>
        <div className="se1">
          <div>
            <Avatar src={chatUser?.profileImage?.path} sx={{ width: 44, height: 44 }} />
          </div>
        </div>
        <div className="se2">
          <div>
            <div>{chatUser?.name}</div>
          </div>
          <div className="ch">
            <div>{latestMessage?.message}</div>
            <div className="cAt">• {latestMessage && displayCreateAt(latestMessage.createdAt)}</div>
          </div>
        </div>
        <div className="se3">
          {_message !== 0 && <span className="notReadMsg">{_message}</span>}
        </div>
      </div>
    </div>
  )
}

export default ChatRoomList
