import React, { useEffect, useState } from 'react'
import Nav from '@/components/nav/navBar'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import EditIcon from '@mui/icons-material/Edit'
import CreateRoom from '@/components/messenger/createRoom'
import { resetResult } from '@/redux/search'
import { socket } from '@/redux/auth'
import ChatRoom from '@/components/messenger/chatRoom'
import ChatRoomList from '@/components/messenger/chatRoomList'

const Messenger: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user)
  const [createOpen, setCreateOpen] = useState(false)
  const [chatRoom, setChatRoom] = useState<number | null>(null)
  const [previousRoom, setPreviousRoom] = useState<number | null>(null)
  const [chatRoomList, setChatRoomList] = useState<number[]>([])
  const dispatch = useDispatch()
  useEffect(() => {
    setChatRoom(null)
    if (socket) {
      socket.emit('getChatRoomList')
      socket.on('newMessage', data => {
        if (data.user.id === user?.id || data.sendUser === user?.id) {
          socket!.emit('getChatRoomList')
          socket!.emit('getNotReadMessage')
        }
      })
      socket.on('room-created-success', (data): void => {
        setChatRoom(data)
      })
      socket.on(`getChatRoomList${user?.id}`, (data): void => {
        setChatRoomList(data)
      })
    }
  }, [socket])
  useEffect(() => {
    setPreviousRoom(chatRoom)
  }, [chatRoom, previousRoom])
  const handleCeateOpen = () => {
    setCreateOpen(true)
  }
  const handleCeateClose = () => {
    setCreateOpen(false)
    dispatch(resetResult())
  }
  const handleChatRoom = (roomId: number) => {
    setChatRoom(roomId)
  }
  return (
    <div className="relative flex size-full overflow-auto">
      <Nav />
      <div className="ml-[4rem] flex size-full">
        <div className="flex w-[540px] flex-col border-r">
          <div className="flex justify-between p-5">
            <div className="text-body16sd">{user?.nickname}</div>
            <div className="rounded border-2 border-gray-500" onClick={handleCeateOpen}>
              <EditIcon sx={{ color: 'rgb(85,85,85)' }} />
            </div>
          </div>
          <div className="p-5 text-body18sd">메시지</div>
          <div className="grow overflow-y-scroll">
            {chatRoomList.map(chat => (
              <ChatRoomList key={chat} roomId={chat} handleChatRoom={handleChatRoom} />
            ))}
          </div>
        </div>
        <div className="flex size-full">
          <ChatRoom
            roomId={chatRoom}
            handleCeateOpen={handleCeateOpen}
            previousRoom={previousRoom}
          />
        </div>
      </div>
      <CreateRoom open={createOpen} onClose={handleCeateClose} />
    </div>
  )
}

export default Messenger
