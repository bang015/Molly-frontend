import React, { useEffect, useState } from 'react'
import Nav from '@/components/nav/navBar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import EditIcon from '@mui/icons-material/Edit'
import CreateRoom from '@/components/messenger/createRoom'
import { resetResult } from '@/redux/search'
import ChatRoom from '@/components/messenger/chatRoom'
import ChatRoomList from '@/components/messenger/chatRoomList'
import { clearChatRoom } from '@/redux/chat'

const Messenger: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.authReducer)
  const [createOpen, setCreateOpen] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch(clearChatRoom())
    }
  }, [])
  const handleCeateOpen = () => {
    setCreateOpen(true)
  }
  const handleCeateClose = () => {
    setCreateOpen(false)
    dispatch(resetResult())
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
            <ChatRoomList />
          </div>
        </div>
        <div className="flex size-full">
          <ChatRoom handleCeateOpen={handleCeateOpen} />
        </div>
      </div>
      <CreateRoom open={createOpen} onClose={handleCeateClose} />
    </div>
  )
}

export default Messenger
