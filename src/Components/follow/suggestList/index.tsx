import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import React, { useEffect } from "react";
import { followUser, getFollow } from "../../../Redux/follow";
import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import "./index.css";
interface SuggestListProps {
  limit: number;
}

export const SuggestList: React.FC<SuggestListProps>= ({ limit }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authReducer.token); 
  useEffect(() => {
    if(token){
      dispatch(getFollow({token,limit}) as any);
    }
  }, [token, limit])
  const suggestList = useSelector(
    (state: RootState) => state.followReducer.suggestList
  );
  const followedList = useSelector(
    (state: RootState) => state.followReducer.followingUser
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
    <div className="list">
      {suggestList.map((user) => (
            <ListItem
              key={user.userId}
              style={{ zIndex: 99 }}
              secondaryAction={
                <Button
                  variant={isFollowing(user.userId)? "outlined" : "contained"}
                  disableElevation
                  onClick={() => handleFollow(user.userId)}
                  style={{ zIndex: 99 }}
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
  )
}