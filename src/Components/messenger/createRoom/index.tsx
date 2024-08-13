import { Avatar, Modal } from '@mui/material'
import React, { useState } from 'react'
import { getSearchResult } from '@/redux/search'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import CancelIcon from '@mui/icons-material/Cancel'
import { createChatRoom } from '@/redux/chat'
import { socket } from '@/redux/auth'
interface createRoomProps {
  open: boolean
  onClose: () => void
}
const CreateRoom: React.FC<createRoomProps> = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const result = useSelector((state: RootState) => state.searchReducer.result)
  const [members, setMembers] = useState<{ id: number; name: string }[]>([])
  const handleSeach = (e: React.ChangeEvent<HTMLInputElement>) => {
    let keyword = e.target.value
    if (keyword !== '') {
      const type = 'user'
      dispatch(getSearchResult({ keyword, type }) as any)
    }
  }
  const handleChatUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userId = Number(e.target.dataset.id)
    const name = e.target.dataset.name || ''
    const isChecked = e.target.checked
    if (isChecked) {
      setMembers(prevMembers => [...prevMembers, { id: userId, name }])
    } else {
      setMembers(prevMembers => prevMembers.filter(member => member.id !== userId))
    }
  }
  const handleCteartChat = () => {
    if (members.length > 0 && socket) {
      socket.emit('createChatRoom', { chatMembers: members })
      // dispatch(createChatRoom(members) as any)
      setMembers([])
    }
    onClose()
  }
  const removeMember = (id: number) => {
    setMembers(prevMembers => prevMembers.filter(member => member.id !== id))
  }
  const isChecked = (userId: number) => members.some(member => member.id === userId)
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(), setMembers([])
      }}
    >
      <div className="modal">
        <div className="pointer-events-auto flex h-[550px] flex-col rounded-lg bg-white">
          <div className="w-[540px] border-b p-5 text-center text-body16sd">새로운 메시지</div>
          <div className="flex h-auto max-w-[540px] items-center px-5 py-1">
            <div className="min-w-14 text-body14sd">받는 사람: </div>
            <div className="flex grow flex-wrap items-center">
              {members &&
                members.map(member => (
                  <span
                    key={member.id}
                    className="m-0.5 flex items-center rounded bg-main px-2 py-1 text-body12sd text-white"
                  >
                    {member.name}
                    <button
                      onClick={() => {
                        removeMember(member.id)
                      }}
                    >
                      <CancelIcon className="ml-1 w-4" />
                    </button>
                  </span>
                ))}
              <input
                className="w-auto p-2 outline-none"
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
                    type="checkbox"
                    className="peer hidden"
                    id={user.id.toString()}
                    data-id={user.id}
                    data-name={user.name}
                    onChange={handleChatUser}
                    checked={isChecked(user.id)}
                  />
                  <span className="h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-200 after:absolute after:left-[6px] after:top-[2px] after:hidden after:h-[10px] after:w-[5px] after:rotate-45 after:border-b-2 after:border-r-2 after:border-white after:content-[''] peer-checked:border-main peer-checked:bg-main peer-checked:after:block"></span>
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
