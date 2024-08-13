import { MessageType } from '@/interfaces/chat'

export const groupMessagesByDate = (messages: MessageType[]) => {
  const messageByDateMap = new Map<string, MessageType[]>()
  messages.forEach(message => {
    const date = message.createdAt.substring(0, 10)
    const existingMessages = messageByDateMap.get(date) || []
    if (!existingMessages.some(msg => msg.id === message.id)) {
      existingMessages.unshift(message)
    }
    messageByDateMap.set(date, existingMessages)
  })
  return Array.from(messageByDateMap, ([date, messages]) => ({ date, messages }))
}

export const updateMessagesByDate = (
  incomingMessage: MessageType,
  existingMessagesByDate: { date: string; messages: MessageType[] }[],
) => {
  const messageMap = new Map<string, MessageType[]>(
    existingMessagesByDate.map(group => [group.date, group.messages]),
  )
  const messageDate = incomingMessage.createdAt.substring(0, 10)
  if (messageMap.has(messageDate)) {
    if (!messageMap.get(messageDate)?.some(message => message.id === incomingMessage.id)) {
      messageMap.get(messageDate)?.push(incomingMessage)
    }
  } else {
    messageMap.set(messageDate, [incomingMessage])
  }
  return Array.from(messageMap, ([date, messages]) => ({ date, messages })).sort((a, b) =>
    b.date < a.date ? -1 : 1,
  )
}
