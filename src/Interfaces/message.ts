import { userType } from "./user";

export interface messageType {
  createdAt: string,
  id: number,
  isRead: boolean,
  message: string,
  userMessage: userType
}