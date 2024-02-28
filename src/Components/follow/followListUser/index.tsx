import React, { useEffect, useState } from "react";
import { followType } from "../../../Interfaces/follow";
import { followUser, followedCheck } from "../../../Redux/follow";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

interface followListUserProps {
  user: followType;
}
const FollowListUser: React.FC<followListUserProps> = ({ user }) => {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const checkFollowed = useSelector((state: RootState) => state.followReducer.chekcFollowed);
  const dispatch = useDispatch();
  const [followed, setFollowed] = useState(false);
  useEffect(() => {
    const check = async () => {
      if (token) {
        const result = await followedCheck(token, user.userId);
        setFollowed(result)
      }
    };
    check();
  }, [user, checkFollowed]);
  const handleFollow = (followUserId: number) => {
    if (token) {
      dispatch(followUser({ token, followUserId }) as any);
    }
  };
  return (
    <ListItem
      key={user.userId}
      style={{ zIndex: 99 }}
      secondaryAction={
        <Button
          variant={followed ? "outlined" : "contained"}
          disableElevation
          onClick={() => handleFollow(user.userId)}
          style={{ zIndex: 99 }}
        >
          {followed ? "팔로잉" : "팔로우"}
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
      <ListItemText primary={user.userNickname} secondary={user.userName} />
    </ListItem>
  );
};

export default FollowListUser;