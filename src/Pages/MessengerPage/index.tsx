import React, { useState } from "react";
import Nav from "../../Components/Nav/navBar";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux";
import EditIcon from "@mui/icons-material/Edit";
import CreateRoom from "../../Components/messenger/createRoom";
import { resetResult } from "../../Redux/search";
import { socket } from "../../Redux/auth";
import ChatRoom from "../../Components/messenger/chatRoom";

const Messenger: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [createOpen, setCreateOpen] = useState(false);
  const [chatRoom, setChatRoom] = useState<number | null>(null);
  const dispatch = useDispatch();
  const handleCeateOpen = () => {
    setCreateOpen(true);
  };
  const handleCeateClose = () => {
    setCreateOpen(false);
    dispatch(resetResult());
  };
  if(socket){
    socket.on("room-created-success",(data): void => {
      setChatRoom(data)
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
          <div className="chat_content"></div>
        </div>
        <div className="chat_room">
          <ChatRoom roomId={chatRoom}/>
        </div>
      </div>
      <CreateRoom open={createOpen} onClose={handleCeateClose} />
    </div>
  );
};

export default Messenger;
