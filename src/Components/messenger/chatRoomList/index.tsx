import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Avatar } from '@mui/material'
import { displayCreateAt } from '@/utils/format/moment'
import { chatRoomList, setRoomId, updateChatRoomInfo, userLeft } from '@/redux/chat'
import { socket } from '@/redux/auth'
interface chatRoomListProps {}
const ChatRoomList: React.FC<chatRoomListProps> = () => {
  const dispatch = useDispatch()
  const roomList = useSelector((state: RootState) => state.chatReducer.list.room)
  const totalPages = useSelector((state: RootState) => state.chatReducer.totalPages.room)
  const [page, setPage] = useState(1)
  useEffect(() => {
    dispatch(chatRoomList(page) as any)
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected')
      })
      socket.on('newMessage', data => {
        dispatch(updateChatRoomInfo(data))
      })
      socket.on('userLeft', data => {
        dispatch(userLeft(data))
      })
      socket.on('newChatRoom', data => {
        dispatch(setRoomId(data))
      })
      return () => {
        socket?.off('newMessage')
        socket?.off('userLeft')
        socket?.off('newChatRoom')
      }
    }
  }, [socket, page])
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.9) {
        if (page < totalPages) {
          setPage(prevPage => prevPage + 1)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [page, totalPages])
  console.log(roomList)
  return (
    <>
      {roomList.length > 0 &&
        roomList.map(room => (
          <div
            key={room.roomId}
            className="flex items-center rounded p-5 hover:bg-gray-100"
            onClick={() => {
              console.log(room.roomId)
              dispatch(setRoomId({ roomId: room.roomId }))
            }}
          >
            <div className="mr-3 rounded-full border">
              <Avatar src={room?.members?.[0]?.profileImage?.path} sx={{ width: 44, height: 44 }} />
            </div>
            <div className="flex flex-col">
              <div className="flex">
                {room.members.length > 0 ? (
                  room.members.map(member => (
                    <div key={member.id} className="pr-1 text-body16m">
                      {member.name}
                    </div>
                  ))
                ) : (
                  <div className="pr-1 text-body16m">대화상대 없음</div>
                )}
              </div>
              {room.latestMessage && (
                <div className="flex items-center">
                  <div className="text-body14rg">{room.latestMessage.message}</div>
                  <div className="ml-1 min-w-10 text-body14rg">
                    • {displayCreateAt(room.latestMessage.createdAt)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex grow justify-end">
              {room.unReadCount !== 0 && (
                <span className="flex size-[20px] items-center justify-center rounded-full bg-main p-1 text-body12rg text-white">
                  {room.unReadCount}
                </span>
              )}
            </div>
          </div>
        ))}
    </>
  )
}

export default ChatRoomList
