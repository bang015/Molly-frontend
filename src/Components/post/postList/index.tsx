import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import { getMainPost } from "../../../Redux/postList";
import { postType } from "../../../Interfaces/post";
import "./index.css";
import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { addCommentType, commentType } from "../../../Interfaces/comment";
import { addComment, getMyCommentByPost } from "../../../Redux/comment";

interface postListProps {
  post: postType;
}
const PostList: React.FC<postListProps> = (post) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [comment, setComment] = useState("");
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [commentList, setCommentList] = useState<commentType[]>([]);
  useEffect(() => {
    const myComment = async () => {
      const result = await getMyCommentByPost(user?.id!, post.post.id);
      setCommentList(result.commentList);
    };
    myComment();
  }, [user, post]);
  const onPrevClick = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + post.post.mediaList.length) %
        post.post.mediaList.length
    );
  };
  const onNextClick = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % post.post.mediaList.length
    );
  };
  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const commentContent = e.target.value;
    setComment(commentContent);
  };
  const handlePostComment = async () => {
    const commentContent = comment
      .replace(/\n/g, "<br>")
      .replace(
        /@([^\s]+)/g,
        '<span style="color: rgb(0, 55, 107);">@$1</span>'
      );
    const commentInfo: addCommentType = {
      postId: post.post.id,
      content: commentContent,
    };
    if (token) {
      const comment = await addComment(token, commentInfo);
      setCommentList([comment, ...commentList]);
    }
    setComment("");
  };
  return (
    <div className="container">
      <div className="ph1">
        <div className="pht1">
          <div>
            <Avatar
              alt="Remy Sharp"
              src={
                post.post.profileImage
                  ? post.post.profileImage.path ?? undefined
                  : undefined
              }
              sx={{ width: 34, height: 34 }}
            />
          </div>
          <div className="fs14 ml10">{post.post.nickname}</div>
        </div>
        <div className="mb">
          <IconButton aria-label="delete">
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
      <div className="media">
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
        {post.post.mediaList &&
          post.post.mediaList.length > 1 &&
          currentImageIndex < post.post.mediaList.length - 1 && (
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
        <div
          className="medias-wrapper"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {post.post.mediaList.map((media, index) => (
            <img key={index} src={media.mediaPath} alt="img" />
          ))}
        </div>
      </div>
      <div className="pct">
        <div className="c2">
          <span>{post.post.nickname}</span>
        </div>
        <div
          className="c3"
          dangerouslySetInnerHTML={{ __html: post.post.content }}
        />
      </div>
      <div className="cabtn">
        <button>댓글 모두 보기</button>
      </div>
      {commentList && (
        <div>
          {commentList.map((comment) => (
            <div key={comment.id}>
              <div className="c2">
                <span>{comment.nickname}</span>
              </div>
              <div
                className="c3"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
            </div>
          ))}
        </div>
      )}
      <div>
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
              transition: "none",
              fontSize: "small",
            },
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  disabled={comment === ""}
                  onClick={handlePostComment}
                  style={{
                    padding: 0,
                    justifyContent: "flex-end",
                    background: "none",
                  }}
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
  );
};

export default PostList;
