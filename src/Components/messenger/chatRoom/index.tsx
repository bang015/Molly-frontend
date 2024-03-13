import React, { useEffect, useState } from "react";
import { socket } from "../../../Redux/auth";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import { userType } from "../../../Interfaces/user";
import { Avatar } from "@mui/material";
import { messageType } from "../../../Interfaces/message";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
interface chatRoomProps {
  roomId: number | null;
  previousRoom: number |null;
  handleCeateOpen: () => void;
}
const ChatRoom: React.FC<chatRoomProps> = ({ roomId, handleCeateOpen, previousRoom }) => {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [message, setMessage] = useState("");
  const [messageArr, setMessageArr] = useState<
    { date: string; message: messageType[] }[]
  >([]);
  const [chatUser, setChatUser] = useState<userType | null>(null);
  useEffect(() => {
    if (socket && token && roomId) {
      socket.emit("leaveRoom", previousRoom);
      socket.emit(`joinChatRoom`, { roomId, token });
    }
  }, [roomId]);
  if (socket) {
    socket.on("joinRoomSuccess", (data): void => {
      setChatUser(data.user.cUsers);
      const messageList: messageType[] = data.room;
      const messageByDate: { date: string; message: messageType[] }[] = [];
      for (var i = 0; i < messageList.length; i++) {
        const message = messageList[i];
        const date = message.createdAt.substring(0, 10);
        const messageId = message.id;
        let found = false;
        for (var j = 0; j < messageByDate.length; j++) {
          if (messageByDate[j].date === date) {
            const existingMessageIndex = messageByDate[j].message.findIndex(
              (msg) => msg.id === messageId
            );
            if (existingMessageIndex === -1) {
              messageByDate[j].message.unshift(message);
            }
            found = true;
            break;
          }
        }
        if (!found) {
          messageByDate.push({ date: date, message: [message] });
        }
      }
      setMessageArr(messageByDate);
      if (socket) {
        socket.emit("getRoomInfo", { roomId, token });
        socket.emit("getNotReadMessage", token);
      }
    });
    socket.emit("messageRead", { roomId, token });
    socket.on(`sendMessagesuccess`, (data: messageType): void => {
      if (data.roomId === roomId) {
        console.log(1);
        const messageByDate1: { date: string; message: messageType[] }[] = [
          ...messageArr,
        ];
        const date = data.createdAt.substring(0, 10);
        const messageId = data.id;
        let found = false;
        for (var i = 0; i < messageByDate1.length; i++) {
          if (messageByDate1[i].date === date) {
            const existingMessageIndex = messageByDate1[i].message.findIndex(
              (msg) => msg.id === messageId
            );
            if (existingMessageIndex === -1) {
              messageByDate1[i].message.push(data);
            }
            found = true;
            break;
          }
        }
        if (!found) {
          messageByDate1.push({ date: date, message: [data] });
        }
        setMessageArr(messageByDate1);
      }
    });
  }
  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const sendMessage = () => {
    if (message !== "" && socket && token) {
      socket.emit("sendMessage", { roomId, token, message });
    }
    setMessage("");
  };
  return (
    <>
      {roomId ? (
        <div className="room">
          <div className="header">
            {chatUser && (
              <div>
                <div>
                  <Avatar
                    src={chatUser?.ProfileImage?.path}
                    sx={{ width: 50, height: 50 }}
                  />
                </div>
                <div>
                  <span>{chatUser.name}</span>
                </div>
              </div>
            )}
          </div>
          <div className="content">
            <div className="list">
              {messageArr.map((message, index) => (
                <div key={index}>
                  <div className="createdAt">{message.date}</div>
                  {message.message.map((msg) => (
                    <div
                      key={msg.id}
                      className={
                        msg.userMessage.id === user?.id
                          ? "msg_list my"
                          : "msg_list"
                      }
                    >
                      {msg.userMessage.id === user?.id ? (
                        <div className="msg">
                          <div>{msg.createdAt}</div>
                          <div className="myMessage message">{msg.message}</div>
                        </div>
                      ) : (
                        <div className="msg">
                          <div className="profile">
                            <Avatar
                              src={msg?.userMessage.ProfileImage?.path}
                              sx={{ width: 30, height: 30 }}
                            />
                          </div>
                          <div className="message">{msg.message}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="input">
              <textarea
                name="message"
                id="message"
                value={message}
                onChange={handleMessage}
              ></textarea>
              <div>
                <button onClick={sendMessage}>보내기</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="room"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div className="msgIcon">
            <EmailOutlinedIcon sx={{ fontSize: 70, color: "black" }} />
          </div>
          <h2 style={{ fontWeight: 500 }}>내 메시지</h2>
          <div style={{ fontSize: "14px", color: "rgb(115,115,115)" }}>
            사람들에게 메시지를 보내보세요
          </div>
          <div className="msgBtn">
            <button onClick={handleCeateOpen}>메시지 보내기</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatRoom;
