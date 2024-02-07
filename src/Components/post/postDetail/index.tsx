import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostByPostId } from "../../../Redux/postList";
import { RootState } from "../../../Redux";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./index.css";
import { createdAt, displayCreateAt } from "../../../Utils/moment";
import EmojiPicker from "emoji-picker-react";
import { addComment, getComment } from "../../../Redux/comment";
import { addCommentType, commentType } from "../../../Interfaces/comment";
import { CommentList } from "../comment/commentList";
interface PostDetailModalProps {
  postId: number;
  onClose: () => void;
}
const PostDetail: React.FC<PostDetailModalProps> = ({ postId, onClose }) => {
  const dispatch = useDispatch();
  const post = useSelector(
    (state: RootState) => state.postListReducer.getPostDetail
  );
  const token = useSelector((state: RootState) => state.authReducer.token);
  const commentList = useSelector(
    (state: RootState) => state.commentReducer.commentList
  );
  const totalPages = useSelector(
    (state: RootState) => state.commentReducer.totalPages
  );
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const crAt = post?.createdAt as string;
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [isSubCommentVisible, setIsSubCommentVisible] = useState(false);
  useEffect(() => {
    dispatch(getPostByPostId(postId) as any);
    dispatch(getComment({ postId, page }) as any);
  }, [postId, page]);

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const commentContent = e.target.value;
    if (!commentContent.includes("@")) {
      setCommentId(null);
    }
    setComment(commentContent);
  };
  const onPrevClick = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const onNextClick = (): void => {
    if (currentImageIndex < post!.mediaList.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const handleChatClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };
  const handlePostComment = () => {
    const commentContent = comment
      .replace(/\n/g, "<br>")
      .replace(/@([^\s]+)/g, '<span style="color: blue;">@$1</span>');
    const commentInfo: addCommentType = {
      postId: postId,
      content: commentContent,
      commentId: commentId,
    };
    if (token) dispatch(addComment({ token, commentInfo }) as any);
    setComment("");
    setCommentId(null);
  };
  const handleSubComment = (nickname: string, commentId: number) => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
    setCommentId(commentId);
    setComment(`@${nickname} `);
  };
  const handleNextPage = () => {
    if (totalPages > page) setPage(page + 1);
  };
  const handleSubCommentList = () => {
    setIsSubCommentVisible(!isSubCommentVisible);
  };
  return (
    <div>
      {post && (
        <Modal open={postId !== null} onClose={onClose}>
          <div className="post-detail">
            <div className="post-container">
              <div className="post-media">
                {currentImageIndex > 0 && (
                  <div className="c-back-btn">
                    <IconButton
                      aria-label="fingerprint"
                      color="secondary"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                      onClick={onPrevClick}
                    >
                      <ChevronLeftIcon style={{ color: "black" }} />
                    </IconButton>
                  </div>
                )}
                {post &&
                  post.mediaList &&
                  post.mediaList.length > 1 &&
                  currentImageIndex < post.mediaList.length - 1 && (
                    <div className="c-next-btn">
                      <IconButton
                        aria-label="fingerprint"
                        color="secondary"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                        }}
                        onClick={onNextClick}
                      >
                        <NavigateNextIcon style={{ color: "black" }} />
                      </IconButton>
                    </div>
                  )}
                <div>
                  <img
                    className="medias"
                    src={post.mediaList[currentImageIndex].mediaPath}
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
                            src={
                              post.profileImage
                                ? post.profileImage.path ?? undefined
                                : undefined
                            }
                          />
                        )}
                      </div>
                      <div className="uf">
                        <div className="un">{post.nickname}</div>
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
                    <ul className="comment-list">
                      <li>
                        <div className="p-content">
                          <div className="c1">
                            {post && (
                              <Avatar
                                alt="profile"
                                src={
                                  post.profileImage
                                    ? post.profileImage.path ?? undefined
                                    : undefined
                                }
                              />
                            )}
                          </div>
                          <div>
                            <div className="c2">
                              <span>{post.nickname}</span>
                            </div>
                            <div
                              className="c3"
                              dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                            <div className="crAt">
                              <div>{displayCreateAt(crAt)}</div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <div>
                        {commentList.map((comment) => (
                          <CommentList
                            key={comment.id}
                            comment={comment}
                            handleSubComment={handleSubComment}
                          />
                        ))}
                        {totalPages > page && (
                          <div className="moreBtn" onClick={handleNextPage}>
                            <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
                          </div>
                        )}
                      </div>
                    </ul>
                  </div>
                  <section className="section1">
                    <div className="icon ficon">
                      <IconButton aria-label="heart">
                        <FavoriteBorderIcon sx={{ fontSize: 25 }} />
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
                  <section className="section2">
                    <div>좋아요</div>
                  </section>
                  <div className="section3">{createdAt(crAt)}</div>
                  <div className="section4">
                    <TextField
                      variant="standard"
                      className="comment-textField"
                      placeholder="댓글 달기..."
                      maxRows={3}
                      multiline
                      fullWidth
                      value={comment}
                      inputRef={textFieldRef}
                      onChange={handleComment}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          padding: 16,
                          paddingRight: "8px",
                          transition: "none",
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              disabled={comment === ""}
                              onClick={handlePostComment}
                            >
                              게시
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PostDetail;
