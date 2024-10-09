import { Modal } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { closeSubModal } from '@/redux/modal'
import { leaveChatRoom } from '@/redux/chat'
import { sendMessage } from '@/common/socket'

const LeaveRoomModal: React.FC = () => {
  const dispatch = useDispatch()
  const { isSubOpen } = useSelector((state: RootState) => state.modalReducer)
  const { roomId } = useSelector((state: RootState) => state.chatReducer)
  const leaveRoom = async () => {
    sendMessage('leaveChatRoom', { roomId })
    dispatch(leaveChatRoom())
    dispatch(closeSubModal())
    // if (roomId && socket) {
    //   socket.emit('leaveChatRoom', { roomId })

    // }
  }
  return (
    <div>
      <Modal
        open={isSubOpen}
        onClose={() => {
          dispatch(closeSubModal())
        }}
      >
        <div className="modal">
          <div className="pointer-events-auto flex flex-col rounded-xl bg-white">
            <div className="w-[400px] border-b p-5 text-center text-body18sd">
              채팅을 나가시겠습니까?
            </div>
            <div className="flex flex-col">
              <button
                className="w-[400px] border-b p-5 text-body14sd text-red-500"
                onClick={leaveRoom}
              >
                나가기
              </button>
            </div>
            <div className="flex flex-col">
              <button
                className="w-[400px] p-5 text-body14sd"
                onClick={() => {
                  dispatch(closeSubModal())
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LeaveRoomModal
