import { UserType } from './user'

export interface RoomListType {
  roomId: number
  unReadCount: number
  latestMessage: {
    message: string
    createdAt: string
  }
  members: UserType[]
}

export interface MessageType {
  createdAt: string
  id: number
  isRead: boolean
  message: string
  roomId: number
  userId: number
  user: UserType
  type: 'USER' | 'SYSTEM'
}
