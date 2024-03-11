import { Avatar, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./index.css";
import { getSearchResult } from "../../../Redux/search";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import { socket } from "../../../Redux/auth";
interface createRoomProps {
  open: boolean;
  onClose: () => void;
}
const CreateRoom: React.FC<createRoomProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const result = useSelector((state: RootState) => state.searchReducer.result);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [chatUser, setChatUser] = useState<string | null>(null);
  const handleSeach = (e: React.ChangeEvent<HTMLInputElement>) => {
    let keyword = e.target.value;
    if (keyword !== "") {
      const type = "user";
      dispatch(getSearchResult({ keyword, type }) as any);
    }
  };
  const handleChatUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatUser(e.target.value);
  };
  const handleCteartChat = () => {
    if(socket && chatUser && token){
      socket.emit("create-room",{chatUser,token})
    }
    onClose();
  }
  return (
    <Modal open={open} onClose={onClose}>
      <div className="post-detail">
        <div className="modal-container" style={{ height: "65vh" }}>
          <div className="create_message">
            <div>새로운 메시지</div>
            <button onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <div className="search_user">
            <div className="se1">받는 사람: </div>
            <div className="se2">
              <input type="text" placeholder="검색..." onChange={handleSeach} />
            </div>
          </div>
          <div className="result_list">
            {result.map((user) => (
              <label key={user.id} htmlFor={user.id.toString()}>
                <div
                  className="search_result"
                  style={{ borderRadius: 0 }}
                >
                  <div className="se1">
                    <div>
                      <Avatar
                        src={user.ProfileImage?.path}
                        sx={{ width: 44, height: 44 }}
                      />
                    </div>
                  </div>
                  <div className="se2">
                    <div>
                      <div>{user.name}</div>
                    </div>
                    <div className="ch">
                      <div>{user.nickname}</div>
                    </div>
                  </div>
                  <div className="se3">
                    <input
                      type="radio"
                      name="user"
                      id={user.id.toString()}
                      value={user.id}
                      onChange={handleChatUser}
                    />
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="message_btn">
            <Button size="large" variant="contained" onClick={handleCteartChat}>
              채팅
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateRoom;
