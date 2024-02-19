import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getPostLike, likePost } from "../../../Redux/like";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux";

interface postUtilIconProps {
  checkLiked: boolean;
  handleChatClick: () => void;
  handleLike: () => void;
}
const PostUtilIcon: React.FC<postUtilIconProps> = ({
  checkLiked,
  handleChatClick,
  handleLike,
}) => {
  return (
    <section className="section1">
      <div className="icon ficon">
        <IconButton aria-label="heart" onClick={handleLike}>
          {checkLiked ? (
            <FavoriteIcon style={{ color: "rgb(255, 48, 64)" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 25 }} />
          )}
        </IconButton>
      </div>
      <div className="icon">
        <IconButton aria-label="chat" onClick={handleChatClick}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </div>
      <div className="icon-left">
        <IconButton aria-label="bookmark">
          <BookmarkBorderIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </div>
    </section>
  );
};

export default PostUtilIcon;
