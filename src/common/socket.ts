import { Client } from '@stomp/stompjs'
export let stompClient: Client | null = null

export const initializeSocket = (URL: string, token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    stompClient = new Client({
      brokerURL: URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: str => {
        // console.log(str)
      },
      onConnect: frame => {
        // console.log('Connected: ' + frame)
        resolve()
      },
      onStompError: frame => {
        console.error('Broker reported error: ' + frame.headers['message'])
        console.error('Additional details: ' + frame.body)
        reject(new Error('Socket connection error'))
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })
    stompClient.activate()
  })
}

export const disconnectSocket = () => {
  if (stompClient) {

    stompClient.deactivate()
  }
}

export const sendMessage = (destination: string, message: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/${destination}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` || '' },
      body: JSON.stringify(message),
    })
  }
}

export const subscribeToMessages = (destination: string, callback: (message: any) => void) => {
  if (stompClient && stompClient.connected) {
    return stompClient.subscribe(destination, (message: any) => {
      callback(JSON.parse(message.body))
    })
  }
}
