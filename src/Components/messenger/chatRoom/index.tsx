import React, { useEffect, useState } from 'react'
import { socket } from '@/redux/auth'
import './index.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { UserType } from '@/interfaces/user'
import { Avatar } from '@mui/material'
import { MessageType } from '@/interfaces/message'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
interface chatRoomProps {
  roomId: number | null
  previousRoom: number | null
  handleCeateOpen: () => void
}
const ChatRoom: React.FC<chatRoomProps> = ({ roomId, handleCeateOpen, previousRoom }) => {
  const user = useSelector((state: RootState) => state.authReducer.user)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ date: string; message: MessageType[] }[]>([])
  const [chatUser, setChatUser] = useState<UserType | null>(null)
  useEffect(() => {
    if (socket && roomId) {
      socket.emit('leaveRoom', previousRoom)
      socket.emit(`joinChatRoom`, { roomId })
      socket.on('joinRoomSuccess', (data): void => {
        setChatUser(data.user)
        const messageList: MessageType[] = data.message
        const messageByDate: { date: string; message: MessageType[] }[] = []
        if (messageList.length > 0) {
          for (var i = 0; i < messageList.length; i++) {
            const message = messageList[i]
            const date = message.createdAt.substring(0, 10)
            const messageId = message.id
            let found = false
            for (var j = 0; j < messageByDate.length; j++) {
              if (messageByDate[j].date === date) {
                const existingMessageIndex = messageByDate[j].message.findIndex(
                  msg => msg.id === messageId,
                )
                if (existingMessageIndex === -1) {
                  messageByDate[j].message.unshift(message)
                }
                found = true
                break
              }
            }
            if (!found) {
              messageByDate.push({ date: date, message: [message] })
            }
          }
        }
        setMessages(messageByDate)
        if (socket) {
          socket.emit('getRoomInfo', { roomId })
          socket.emit('getNotReadMessage')
        }
      })
      socket.emit('messageRead', { roomId })
    }
  }, [roomId, socket])
  if (socket) {
    socket.on(`sendMessagesuccess`, (data: MessageType): void => {
      console.log(data)
      if (data.roomId === roomId) {
        const messageByDate1: { date: string; message: MessageType[] }[] = [...messages]
        const date = data.createdAt.substring(0, 10)
        const messageId = data.id
        let found = false
        for (var i = 0; i < messageByDate1.length; i++) {
          if (messageByDate1[i].date === date) {
            const existingMessageIndex = messageByDate1[i].message.findIndex(
              msg => msg.id === messageId,
            )
            if (existingMessageIndex === -1) {
              messageByDate1[i].message.push(data)
            }
            found = true
            break
          }
        }
        if (!found) {
          messageByDate1.unshift({ date: date, message: [data] })
        }
        setMessages(messageByDate1)
      }
    })
  }

  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }
  const sendMessage = () => {
    console.log(message)
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
        <div className="flex size-full flex-col">
          {/* 해더 */}
          <div className="border-b p-5">
            {chatUser && (
              <div className="flex items-center">
                <Avatar
                  className="border"
                  src={chatUser?.profileImage?.path}
                  sx={{ width: 50, height: 50 }}
                />
                <span className="ml-3 text-body16sd">{chatUser.name}</span>
              </div>
            )}
          </div>
          {/* 메시지 */}
          <div className="flex size-full grow flex-col">
            <div className="flex grow flex-col-reverse overflow-y-scroll px-5">
              {messages.map((message, index) => (
                <div key={index}>
                  <div className="p-3 text-center text-body14rg text-gray-500">{message.date}</div>
                  {message.message.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.userId === user?.id && 'justify-end'}`}
                    >
                      {msg.userId === user?.id ? (
                        <div className="p-1">
                          <div className="rounded-xl bg-main px-3 py-2 text-white whitespace-pre-wrap">
                            {msg.message}
                          </div>
                        </div>
                      ) : (
                        <div className="p-1">
                          <div className="mr-2">
                            <Avatar
                              src={msg?.user.profileImage?.path}
                              sx={{ width: 30, height: 30 }}
                            />
                          </div>
                          <div className="rounded-xl bg-gray-300 px-3 py-2 whitespace-pre-wrap">{msg.message}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
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
      ) : (
        <div className="room" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="msgIcon">
            <EmailOutlinedIcon sx={{ fontSize: 70, color: 'black' }} />
          </div>
          <h2 style={{ fontWeight: 500 }}>내 메시지</h2>
          <div style={{ fontSize: '14px', color: 'rgb(115,115,115)' }}>
            사람들에게 메시지를 보내보세요
          </div>
          <div className="msgBtn">
            <button onClick={handleCeateOpen}>메시지 보내기</button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatRoom
