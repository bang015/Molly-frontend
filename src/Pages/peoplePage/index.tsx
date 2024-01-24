import React, { useCallback, useEffect, useRef, useState } from "react";
import Nav from "../../Components/Nav";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from "@mui/material";

const People: React.FC = () => {
  const suggestList = useSelector(
    (state: RootState) => state.authReducer.suggestList
  );
  const handleFollow = (followUserId: number) => {
    
  };
  return (
    <div className="mainPage">
      <div className="main-left">
        <Nav></Nav>
      </div>
      <div className="main-center">
        <div>회원님을 위한 추천</div>
        <div>
          {suggestList.map((user, index) => (
              <ListItem
                key={user.userId}
                secondaryAction={
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={() => handleFollow(user.userId)}
                  >
                    팔로우
                  </Button>
                }
              >
                <ListItemAvatar>
                  {user.profileImagePath !== null ? (
                    <Avatar src={user.profileImagePath} />
                  ) : (
                    <Avatar src="" />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={user.userNickname}
                  secondary={user.userName}
                />
              </ListItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default People;
