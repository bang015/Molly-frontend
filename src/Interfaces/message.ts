import { UserType } from "./user";

export interface MessageType {
  createdAt: string,
  id: number,
  isRead: boolean,
  message: string,
  roomId: number,
  userId: number,
  user: UserType
}