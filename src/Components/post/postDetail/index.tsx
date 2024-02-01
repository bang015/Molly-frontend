import { Avatar, IconButton, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostByPostId } from "../../../Redux/postList";
import { RootState } from "../../../Redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import "./index.css";

interface PostDetailModalProps {
  postId: number;
  onClose: () => void;
}
const PostDetail: React.FC<PostDetailModalProps> = ({ postId, onClose }) => {
  const dispatch = useDispatch();
  const post = useSelector(
    (state: RootState) => state.postListReducer.getPostDetail
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  useEffect(() => {
    dispatch(getPostByPostId(postId) as any);
  }, [postId]);
  return (
    <div>
      <Modal open={postId !== null} onClose={onClose}>
        <div className="post-detail">
          <div className="post-container">
            <div className="post-media">
              <div>
                <img
                  className="medias"
                  src={post?.mediaList[currentImageIndex].mediaPath}
                  alt="img"
                />
              </div>
            </div>
            <div className="post-comment">
              <div className="comment-header">
                <div className="ch1">
                  <div className="cht1">
                    <div className="pi">
                      {post && (
                        <Avatar
                          alt="Remy Sharp"
                          src={post.profileImage?.path || ""}
                        />
                      )}
                    </div>
                    <div className="uf">
                      <div className="un">{post?.nickname}</div>
                      <div>
                        <span>•</span>
                        <button>
                          <div className="ft">팔로우</div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb">
                    <IconButton aria-label="delete">
                      <MoreHorizIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div className="comment-main">
                <div className="comment">
                  <ul className="comment-list"></ul>
                </div>
                <section className="sec1">
                  <div className="icon">
                    <IconButton aria-label="heart">
                      <FavoriteBorderIcon />
                    </IconButton>
                  </div>
                  <div className="icon">
                    <IconButton aria-label="chat">
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                  </div>
                  <div className="icon-left">
                    <IconButton aria-label="bookmark">
                      <BookmarkBorderIcon />
                    </IconButton>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostDetail;
