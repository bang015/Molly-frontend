import React, { useEffect, useState } from 'react'
import { socket } from '@/redux/auth'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Avatar } from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { addNewMessage, chatRoomDetails, updateUnreadCount } from '@/redux/chat'
import { MessageType } from '@/interfaces/chat'
import { openSubModal } from '@/redux/modal'
import { useNavigate } from 'react-router-dom'
import { UserType } from '@/interfaces/user'
interface chatRoomProps {
  handleCeateOpen: () => void
}
const ChatRoom: React.FC<chatRoomProps> = ({ handleCeateOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.authReducer.user)
  const roomId = useSelector((state: RootState) => state.chatReducer.roomId)
  const messageList = useSelector((state: RootState) => state.chatReducer.list.message)
  const members = useSelector((state: RootState) => state.chatReducer.members)
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (roomId) {
      dispatch(chatRoomDetails(roomId) as any)
      dispatch(updateUnreadCount(roomId))
      if (socket) {
        const handleNewMessage = (data: MessageType) => {
          socket?.emit('messageRead', { roomId })
          dispatch(addNewMessage(data) as any)
        }
        socket.emit('joinChatRoom', { roomId })
        socket.on('sendMessagesuccess', handleNewMessage)

        return () => {
          socket?.off('sendMessagesuccess', handleNewMessage)
        }
      }
    }
  }, [roomId, socket])

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }
  const sendMessage = () => {
    if (message !== '' && socket) {
      socket.emit('sendMessage', { roomId, message })
    }
    setMessage('')
  }
  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  return (
    <>
      {roomId ? (
        <div className="flex size-full">
          <div className="flex size-full grow flex-col">
            {/* 해더 */}
            <div className="border-b p-5">
              <div className="flex items-center">
                <div className="flex grow items-center">
                  <Avatar
                    className="border"
                    src={members[0]?.profileImage?.path}
                    sx={{ width: 50, height: 50 }}
                  />
                  {members.length > 0 ? (
                    members.map((member: UserType) => (
                      <button
                        key={member.id}
                        onClick={() => {
                          navigate(`/profile/${member.nickname}`)
                        }}
                        className="ml-3 text-body16sd"
                      >
                        {member.name}
                      </button>
                    ))
                  ) : (
                    <div className="ml-3 text-body16sd">대화상대 없음</div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                >
                  <DehazeIcon className="mr-5" />
                </button>
              </div>
            </div>
            {/* 메시지 */}
            <div className="flex size-full grow flex-col">
              <div className="flex max-h-[730px] grow flex-col-reverse overflow-y-scroll px-5">
                {messageList.map(
                  (
                    message: {
                      date: string
                      messages: MessageType[]
                    },
                    index: number,
                  ) => (
                    <div key={`${message.date}-${index}`}>
                      <div className="p-3 text-center text-body14rg text-gray-500">
                        {message.date}
                      </div>
                      {message.messages.map((msg: MessageType) => (
                        <div key={msg.id}>
                          {msg.type === 'USER' ? (
                            <div className={`flex ${msg.userId === user?.id && 'justify-end'}`}>
                              {msg.userId === user?.id ? (
                                <div className="p-1">
                                  <div className="whitespace-pre-wrap rounded-xl bg-main px-3 py-2 text-white">
                                    {msg.message}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center p-1">
                                  <div className="mr-2">
                                    <Avatar
                                      src={msg?.user?.profileImage?.path}
                                      sx={{ width: 50, height: 50 }}
                                    />
                                  </div>
                                  <div className="flex flex-col justify-start">
                                    <div className="p-1 text-body14m">{msg.user.name}</div>
                                    <div className="whitespace-pre-wrap rounded-xl bg-gray-100 px-3 py-2">
                                      {msg.message}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="py-5 text-center">
                              <span className="rounded-xl bg-gray-100 p-2 text-body14sd">
                                {msg.message}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ),
                )}
              </div>
              {/* 인풋 */}
              <div className="p-5">
                <div className="flex rounded-full border">
                  <textarea
                    className="grow resize-none rounded-full px-5 outline-none"
                    name="message"
                    id="message"
                    autoFocus
                    value={message}
                    onChange={handleMessage}
                    onKeyDown={handleEnter}
                  ></textarea>
                  <button
                    className="px-5 text-body14sd text-main hover:text-hover"
                    onClick={sendMessage}
                  >
                    보내기
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex flex-col border-l ${isOpen ? 'w-[500px]' : 'hidden'}`}>
            <div className="border-b p-5 text-body20sd">
              <div className="flex h-[50px] items-center">상세 정보</div>
            </div>
            <div className="flex grow flex-col border-b">
              <div className="p-5 text-body18m">멤버</div>
              <div className="flex grow flex-col">
                {members &&
                  members.map((member: UserType) => (
                    <div key={member.id}>
                      {member.id !== user?.id && (
                        <button
                          key={member.id}
                          onClick={() => {
                            navigate(`/profile/${member.nickname}`)
                          }}
                          className="flex items-center p-5 hover:bg-gray-100"
                        >
                          <div className="mr-3">
                            <Avatar
                              src={member?.profileImage?.path}
                              sx={{ width: 60, height: 60 }}
                            />
                          </div>
                          <div>
                            <div className="text-body16sd">{member.nickname}</div>
                            <div className="text-body14rg">{member.name}</div>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-5">
              <button
                onClick={() => {
                  dispatch(
                    openSubModal({
                      subModalType: 'LeaveRoomModal',
                    }),
                  )
                }}
                className="text-body18sd text-red-500"
              >
                채팅방 나가기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex grow flex-col items-center justify-center">
          <div className="rounded-full border-2 p-3">
            <EmailOutlinedIcon sx={{ fontSize: 70, color: 'black' }} />
          </div>
          <div className="p-2 text-body18sd">내 메시지</div>
          <div className="text-body14m text-gray-500">사람들에게 메시지를 보내보세요</div>
          <button
            className="p-3 text-body16sd text-main hover:text-hover"
            onClick={handleCeateOpen}
          >
            메시지 보내기
          </button>
        </div>
      )}
    </>
  )
}

export default ChatRoom
