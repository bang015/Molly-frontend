import React, { useEffect, useState } from "react";
import Nav from "../../Components/Nav/navBar";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux";
import EditIcon from "@mui/icons-material/Edit";
import CreateRoom from "../../Components/messenger/createRoom";
import { resetResult } from "../../Redux/search";
import { socket } from "../../Redux/auth";
import ChatRoom from "../../Components/messenger/chatRoom";
import ChatRoomList from "../../Components/messenger/chatRoomList";

const Messenger: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [createOpen, setCreateOpen] = useState(false);
  const [chatRoom, setChatRoom] = useState<number | null>(null);
  const [previousRoom, setPreviousRoom] = useState<number | null>(null);
  const [chatRoomList, setChatRoomList] = useState<number[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket && token) {
      socket.emit("getChatRoomList", token);
    }
  }, [token, socket]);
  useEffect(() => {
    setPreviousRoom(chatRoom);
  }, [chatRoom, previousRoom]);
  const handleCeateOpen = () => {
    setCreateOpen(true);
  };
  const handleCeateClose = () => {
    setCreateOpen(false);
    dispatch(resetResult());
  };
  const handleChatRoom = (roomId: number) => {
    setChatRoom(roomId);
  };
  if (socket && token) {
    socket.on("room-created-success", (data): void => {
      setChatRoom(data);
    });
    socket.on(`getChatRoomList${user?.id}`, (data): void => {
      setChatRoomList(data);
    });
    
  }
  return (
    <div className="mainPage">
      <Nav></Nav>
      <div className="chat">
        <div className="chatList">
          <div className="chat_header">
            <h3>{user?.nickname}</h3>
            <div onClick={handleCeateOpen}>
              <EditIcon sx={{ color: "rgb(85,85,85)" }} />
            </div>
          </div>
          <div className="chat_t">
            <div>메시지</div>
          </div>
          <div className="chat_content">
            {chatRoomList.map((chat) => (
              <ChatRoomList
                key={chat}
                roomId={chat}
                handleChatRoom={handleChatRoom}
              />
            ))}
          </div>
        </div>
        <div className="chat_room">
          <ChatRoom
            roomId={chatRoom}
            handleCeateOpen={handleCeateOpen}
            previousRoom={previousRoom}
          />
        </div>
      </div>
      <CreateRoom open={createOpen} onClose={handleCeateClose} />
    </div>
  );
};

export default Messenger;
