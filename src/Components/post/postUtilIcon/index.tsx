import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { bookmarkPost, getPostBookmark } from "@/redux/bookmark";

interface postUtilIconProps {
  checkLiked: boolean;
  handleChatClick: () => void;
  handleLike: () => void;
  config: boolean;
  postId: number;
}
const PostUtilIcon: React.FC<postUtilIconProps> = ({
  checkLiked,
  handleChatClick,
  handleLike,
  config,
  postId,
}) => {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [checkBookmark, setCheckBookmark] = useState(false);
  useEffect(() => {
    const bookmark = async () => {
      if (token) {
        const result = await getPostBookmark(postId, token);
        setCheckBookmark(result);
      }
    };
    bookmark();
  }, [postId]);
  const handleBookmark = async () => {
    if (token) {
      const bookmark = await bookmarkPost(token, postId);
      setCheckBookmark(bookmark);
    }
  };
  return (
    <section className={config ? "mSection1" : "section1"}>
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
        <IconButton aria-label="bookmark" onClick={handleBookmark}>
          {checkBookmark ? (
            <BookmarkIcon sx={{ fontSize: 25 }} />
          ) : (
            <BookmarkBorderIcon sx={{ fontSize: 25 }} />
          )}
        </IconButton>
      </div>
    </section>
  );
};

export default PostUtilIcon;
