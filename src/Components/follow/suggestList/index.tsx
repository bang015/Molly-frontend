import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import React, { useEffect } from "react";
import { followUser, getSuggestFollow } from "../../../Redux/follow";
import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import "./index.css";
import FollowListUser from "../followListUser";
interface SuggestListProps {
  limit: number;
}

export const SuggestList: React.FC<SuggestListProps>= ({ limit }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authReducer.token); 
  useEffect(() => {
    if(token){
      dispatch(getSuggestFollow({token,limit}) as any);
    }
  }, [token, limit])
  const suggestList = useSelector(
    (state: RootState) => state.followReducer.suggestList
  );
  return (
    <div className="list">
      {suggestList.map((user) => (
        <FollowListUser key={user.userId} user={user}/>
          ))}
    </div>
  )
}