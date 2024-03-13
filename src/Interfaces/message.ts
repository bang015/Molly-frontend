import { userType } from "./user";

export interface messageType {
  createdAt: string,
  id: number,
  isRead: boolean,
  message: string,
  roomId: number,
  userId: number,
  userMessage: userType
}