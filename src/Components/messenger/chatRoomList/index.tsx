import React, { useEffect, useState } from "react";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import { socket } from "../../../Redux/auth";
import { userType } from "../../../Interfaces/user";
import { Avatar } from "@mui/material";
import { messageType } from "../../../Interfaces/message";
import { displayCreateAt } from "../../../Utils/moment";
interface chatRoomListProps {
  roomId: number;
  handleChatRoom: (roomId: number) => void;
}
const ChatRoomList: React.FC<chatRoomListProps> = ({
  roomId,
  handleChatRoom,
}) => {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [_message, set_message] = useState<number | null>(null);
  const [chatUser, setChatUser] = useState<userType | null>(null);
  const [latestMessage, setLatestMessage] = useState<messageType | null>(null);
  useEffect(() => {
    if (socket && roomId && token) {
      socket.emit("getRoomInfo", { roomId, token });
      socket.on("newMessage", (data) => {
        if (data.cUsers.id === user?.id && socket) {
          socket.emit("getRoomInfo", { roomId, token });
          socket.emit("getChatRoomList", token);
          socket.emit("getNotReadMessage", token);
        }
      });
      socket.on(`getRoomInfo${roomId}`, (data): void => {
        set_message(data._message);
        setChatUser(data.user.cUsers);
        setLatestMessage(data.latestMessage);
      });
    }
  }, [roomId]);
  return (
    <div
      onClick={() => {
        handleChatRoom(roomId);
      }}
    >
      <div className="search_result" style={{ borderRadius: 0 }}>
        <div className="se1">
          <div>
            <Avatar
              src={chatUser?.ProfileImage?.path}
              sx={{ width: 44, height: 44 }}
            />
          </div>
        </div>
        <div className="se2">
          <div>
            <div>{chatUser?.name}</div>
          </div>
          <div className="ch">
            <div>{latestMessage?.message}</div>
            <div className="cAt">
              • {latestMessage && displayCreateAt(latestMessage.createdAt)}
            </div>
          </div>
        </div>
        <div className="se3">
          {_message !== 0 && <span className="notReadMsg">{_message}</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;
