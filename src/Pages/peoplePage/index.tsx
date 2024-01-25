import React, { useCallback, useEffect, useRef, useState } from "react";
import Nav from "../../Components/Nav";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from "@mui/material";
import { followUser } from "../../Redux/follow";

const People: React.FC = () => {
  const dispatch = useDispatch();
  const suggestList = useSelector(
    (state: RootState) => state.authReducer.suggestList
  );
  const token = useSelector((state: RootState) => state.authReducer.token);
  const followLoading = useSelector(
    (state: RootState) => state.followReducer.followLoading
  );
  const followedList = useSelector(
    (state: RootState) => state.followReducer.followedUsers
  );
  const isFollowing = (userId: number) => {
    return followedList.some((followedUser) => followedUser.userId === userId);
  };

  const handleFollow = (followUserId: number) => {
    if (token) {
      dispatch(followUser({ token, followUserId }) as any);
    }
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
                  {isFollowing(user.userId) ? "팔로잉" : "팔로우"}
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
