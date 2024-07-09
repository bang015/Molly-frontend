import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import { postType } from "@/interfaces/post";
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
import { addCommentType, commentType } from "@/interfaces/comment";
import {
  addComment,
  clearComment,
  getMyCommentByPost,
} from "@/redux/comment";
import PostUtilIcon from "../postUtilIcon";
import { getPostLike, likePost } from "@/redux/like";
import PostLikeCount from "../postLikeCount";
import { displayCreateAt } from "@/utils/moment";
import PostDetail from "../postDetail";
import PostMoreModal from "@/components/modal/post";
import DeleteModal from "@/components/modal/delete";
import PostForm from "../postForm";
import { useNavigate } from "react-router-dom";
import { clearPostDetail } from "@/redux/postList";

interface postListProps {
  post: postType;
}
const PostList: React.FC<postListProps> = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [comment, setComment] = useState("");
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [commentList, setCommentList] = useState<commentType[]>([]);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [checkLiked, setCheckLiked] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [postConfig, setPostConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const myComment = async () => {
      const result = await getMyCommentByPost(user?.id!, post.id);
      setCommentList(result.commentList);
    };
    myComment();
  }, [user, post]);
  useEffect(() => {
    const like = async () => {
      const result = await getPostLike(token!, post.id);
      setLikeCount(result.count);
      setCheckLiked(result.checkLiked);
    };
    like();
  }, [post, checkLiked]);
  const onPrevClick = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + post.PostMedia.length) % post.PostMedia.length
    );
  };
  const onNextClick = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % post.PostMedia.length
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
      postId: post.id,
      content: commentContent,
    };
    if (token) {
      const comment = await addComment(token, commentInfo);
      setCommentList([comment, ...commentList]);
    }
    setComment("");
  };
  const handleLike = async () => {
    if (token) {
      const check = await likePost(token, post.id);
      setCheckLiked(check);
    }
  };
  const handleChatClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };
  const goToProfilePage = () => {
    navigate(`/profile/${post.User.nickname}`);
  };
  // 게시물 상세보기 모달
  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };
  const closeModal = () => {
    setSelectedPostId(null);
    dispatch(clearComment());
    dispatch(clearPostDetail());
  };
  // 게시물 수정, 삭제 모달
  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  // 게시물 삭제 확인 모달
  const onDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const onDeleteClose = () => {
    setDeleteOpen(false);
  };
  // 게시물 수정 모달
  const onEditOpen = () => {
    setPostConfig(true);
  };
  const onEditClose = () => {
    setPostConfig(false);
  };
  // 게시물 수정 로딩
  const onEditLoadingOpen = () => {
    setLoading(true);
  };
  return (
    <div className="container">
      <div className="ph1">
        <div className="pht1" onClick={goToProfilePage}>
          <div>
            <Avatar
              alt="Remy Sharp"
              src={post.User.ProfileImage?.path}
              sx={{ width: 34, height: 34 }}
            />
          </div>
          <div className="fs14 ml10">
            <div>{post.User.nickname}</div> <div className="ms5 cAt">•</div>{" "}
            <div className="cAt">{displayCreateAt(post.createdAt)}</div>
          </div>
        </div>
        <div>
          <IconButton aria-label="delete" onClick={handleModalOpen}>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
      <PostMoreModal // 게시물 수정, 삭제 모달
        open={open}
        onClose={handleModalClose}
        onDeleteOpen={onDeleteOpen}
        onEditOpen={onEditOpen}
        post={post}
      />
      <DeleteModal // 게시물 삭제 확인 모달
        postId={post.id}
        deleteOpen={deleteOpen}
        onDeleteClose={onDeleteClose}
      />
      <PostForm
        postConfig={postConfig}
        onClose={onEditClose}
        openModal={onEditLoadingOpen}
        post={post}
      />
      <div className="content">
        <div className="media">
          {currentImageIndex > 0 && (
            <div className="c-back-btn">
              <IconButton
                aria-label="fingerprint"
                color="secondary"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  padding: 0,
                }}
                onClick={onPrevClick}
              >
                <ChevronLeftIcon style={{ color: "black" }} />
              </IconButton>
            </div>
          )}
          {post.PostMedia &&
            post.PostMedia.length > 1 &&
            currentImageIndex < post.PostMedia.length - 1 && (
              <div className="c-next-btn">
                <IconButton
                  aria-label="fingerprint"
                  color="secondary"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    padding: 0,
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
            {post.PostMedia.map((media, index) => (
              <img key={index} src={media.path} alt="img" />
            ))}
          </div>
        </div>
        <PostUtilIcon
          checkLiked={checkLiked}
          handleLike={handleLike}
          handleChatClick={handleChatClick}
          config={true}
          postId={post.id}
        />
        <PostLikeCount
          config={true}
          likeCount={likeCount}
          handleLike={handleLike}
        />
        <div className="pct">
          <div className="c2">
            <span>{post.User.nickname}</span>
          </div>
          <div
            className="c3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        <div className="cabtn">
          <button
            onClick={() => {
              handlePostModal(post.id);
            }}
          >
            댓글 모두 보기
          </button>
        </div>
        {selectedPostId && (
          <PostDetail postId={selectedPostId} onClose={closeModal} />
        )}
        {commentList && (
          <div>
            {commentList.map((comment) => (
              <div key={comment.id}>
                <div className="c2">
                  <span>{comment.user.nickname}</span>
                </div>
                <div
                  className="c3"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            ))}
          </div>
        )}
        <div className="ctf">
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
    </div>
  );
};

export default PostList;
