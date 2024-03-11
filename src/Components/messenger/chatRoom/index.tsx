import React, { useEffect, useState } from "react";
import { socket } from "../../../Redux/auth";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import { userType } from "../../../Interfaces/user";
import { Avatar } from "@mui/material";
import { messageType } from "../../../Interfaces/message";
interface chatRoomProps {
  roomId: number | null;
}
const ChatRoom: React.FC<chatRoomProps> = ({ roomId }) => {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [message, setMessage] = useState("");
  const [messageArr, setMessageArr] = useState<messageType[]>([]);
  const [chatUser, setChatUser] = useState<userType | null>(null);
  console.log(roomId);
  useEffect(() => {
    if (socket && token) {
      socket.emit(`joinChatRoom`, { roomId, token });
    }
  }, [roomId]);
  if (socket) {
    socket.on("joinRoomSuccess", (data): void => {
      setChatUser(data.user.cUsers);
      setMessageArr(data.room);
    });
    socket.on("sendMessageSuccess", (data): void => {
      console.log(data);
      setMessageArr([data,...messageArr]);
    })
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
              {messageArr.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.userMessage.id === user?.id ? "msg_list my" : "msg_list"
                  }
                >
                  {msg.userMessage.id === user?.id ? (
                    <div className="msg">
                      <div>{msg.createdAt}</div>
                      <div className="myMessage">{msg.message}</div>
                    </div>
                  ) : (
                    <div className="msg">
                      <div>
                        <Avatar
                          src={msg?.userMessage.ProfileImage?.path}
                          sx={{ width: 30, height: 30 }}
                        />
                      </div>
                      <div>{msg.message}</div>
                    </div>
                  )}
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
        <div>
          <div>SS</div>
        </div>
      )}
    </>
  );
};

export default ChatRoom;
