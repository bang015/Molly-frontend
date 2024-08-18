import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { request } from './baseRequest'
import { CHAT_APT, INIT, DETAILS } from '@/utils/api-url'
import { openSnackBar } from './snackBar'
import { MessageType, RoomListType } from '@/interfaces/chat'
import { UserType } from '@/interfaces/user'
import { groupMessagesByDate, updateMessagesByDate } from '@/utils/format/message'
interface ChatState {
  roomId: number | null
  list: {
    room: RoomListType[]
    message: { date: string; messages: MessageType[] }[]
  }
  totalPages: {
    room: number
    message: number
  }
  members: UserType[]
  unreadCount: number
}
const initialState: ChatState = {
  roomId: null,
  list: {
    room: [],
    message: [],
  },
  totalPages: {
    room: 0,
    message: 0,
  },
  members: [],
  unreadCount: 0,
}
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<{ roomId: number }>) => {
      state.roomId = action.payload.roomId
    },
    addNewMessage: (state, action: PayloadAction<MessageType>) => {
      const messages = updateMessagesByDate(action.payload, state.list.message)
      state.list.message = messages
    },
    updateChatRoomInfo: (state, action) => {
      if (state.list.room.find(room => room.roomId === action.payload.roomId)) {
        state.list.room.map(room => {
          if (room.roomId === action.payload.roomId) {
            room.latestMessage = action.payload.latestMessage
            if (state.roomId !== action.payload.roomId) {
              room.unReadCount = action.payload.unReadCount
            }
          }
        })
      } else {
        state.list.room.push(action.payload)
      }
      state.list.room.sort((a, b) => {
        const dateA = new Date(a.latestMessage.createdAt).getTime()
        const dateB = new Date(b.latestMessage.createdAt).getTime()
        return dateB - dateA // 내림차순 정렬
      })
    },
    updateUnreadCount: (state, action) => {
      state.list.room.map(room => {
        if (room.roomId === action.payload) {
          state.unreadCount = state.unreadCount - room.unReadCount
          room.unReadCount = 0
        }
      })
    },
    updateAllUnreadCount: (state, action) => {
      state.unreadCount = action.payload.allUnreadCount
    },
    clearChat: state => {
      ;(state.list = { room: [], message: [] }),
        (state.members = []),
        (state.unreadCount = 0),
        (state.totalPages = { room: 0, message: 0 })
    },
    clearChatRoom: state => {
      state.roomId = null
    },
    leaveChatRoom: state => {
      const updateList = state.list.room.filter(room => room.roomId !== state.roomId)
      state.list.room = updateList
      state.roomId = null
    },
    userLeft: (state, action) => {
      if (action.payload.roomId === state.roomId) {
        state.members = action.payload.members
        const messages = updateMessagesByDate(action.payload.sysMessage, state.list.message)
        state.list.message = messages
      }
      if (state.list.room.find(room => room.roomId === action.payload.roomId)) {
        state.list.room.map(room => {
          if (room.roomId === action.payload.roomId) {
            room.latestMessage = action.payload.sysMessage
            room.members = action.payload.members
          }
        })
      } else {
        state.list.room.push({
          roomId: action.payload.roomId,
          latestMessage: action.payload.sysMessage,
          members: action.payload.members,
          unReadCount: 0,
        })
      }
      state.list.room.sort((a, b) => {
        const dateA = new Date(a.latestMessage.createdAt).getTime()
        const dateB = new Date(b.latestMessage.createdAt).getTime()
        return dateB - dateA // 내림차순 정렬
      })
    },
  },
  extraReducers: builder => {
    builder
      .addCase(chatRoomList.fulfilled, (state, action) => {
        const roomList = [...state.list.room, ...action.payload.roomList]
        const filter = new Map(roomList.map(r => [r.roomId, r]))
        state.list.room = Array.from(filter.values())
        state.list.room.sort((a, b) => {
          const dateA = new Date(a.latestMessage.createdAt).getTime()
          const dateB = new Date(b.latestMessage.createdAt).getTime()
          return dateB - dateA // 내림차순 정렬
        })
        state.totalPages.room = action.payload.totalPages
      })
      .addCase(chatRoomDetails.fulfilled, (state, action) => {
        const messages = groupMessagesByDate(action.payload.messages)
        state.list.message = messages
        state.members = action.payload.members
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload
      })
  },
})
export const {
  setRoomId,
  addNewMessage,
  updateChatRoomInfo,
  updateUnreadCount,
  updateAllUnreadCount,
  clearChatRoom,
  clearChat,
  leaveChatRoom,
  userLeft,
} = chatSlice.actions
export default chatSlice.reducer

export const chatRoomList = createAsyncThunk<
  { roomList: RoomListType[]; totalPages: number },
  number
>('chat/getList', async (page: number, { dispatch }) => {
  try {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${CHAT_APT}?page=${page}`,
      {
        method: 'GET',
        headers: {},
      },
    )
    return response.data
  } catch (e: any) {
    dispatch(openSnackBar(e.response.data.message || '오류가 발생했습니다.'))
  }
})

export const chatRoomDetails = createAsyncThunk<
  { members: UserType[]; messages: MessageType[] },
  number
>('chat/getMessages', async (roomId: number, { dispatch }) => {
  try {
    const response = await request(
      `${import.meta.env.VITE_SERVER_URL}${INIT}${CHAT_APT}${DETAILS}/${roomId}`,
      {
        method: 'GET',
        headers: {},
      },
    )
    return response.data
  } catch (e: any) {
    dispatch(openSnackBar(e.response.data.message || '오류가 발생했습니다.'))
  }
})

export const getUnreadCount = createAsyncThunk<number>('/chat/getUnreadCount', async () => {
  const response = await request(`${import.meta.env.VITE_SERVER_URL}${INIT}${CHAT_APT}/unread`, {
    method: 'GET',
    headers: {},
  })
  return response.data
})
