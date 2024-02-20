import { IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface postUtilIconProps {
  checkLiked: boolean;
  handleChatClick: () => void;
  handleLike: () => void;
  config : boolean;
}
const PostUtilIcon: React.FC<postUtilIconProps> = ({
  checkLiked,
  handleChatClick,
  handleLike,
  config
}) => {
  return (
    <section className={config ? "mSection1": "section1"}>
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
