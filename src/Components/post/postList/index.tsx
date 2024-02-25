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
import {
  addComment,
  clearComment,
  getMyCommentByPost,
} from "../../../Redux/comment";
import PostUtilIcon from "../postUtilIcon";
import { getPostLike, likePost } from "../../../Redux/like";
import PostLikeCount from "../postLikeCount";
import { displayCreateAt } from "../../../Utils/moment";
import PostDetail from "../postDetail";
import PostMoreModal from "../../EditDeleteModal/post";
import DeleteModal from "../../EditDeleteModal/delete";
import PostForm from "../postForm";

interface postListProps {
  post: postType;
}
const PostList: React.FC<postListProps> = (post) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const updatedPost = useSelector((state: RootState) => state.postReducer.updatedPost);
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
  const [content, setContent] = useState("");
  useEffect(() => {
    const myComment = async () => {
      const result = await getMyCommentByPost(user?.id!, post.post.id);
      setCommentList(result.commentList);
    };
    myComment();
    setContent(post.post.content);
  }, [user, post]);
  useEffect(() => {
    const like = async () => {
      const result = await getPostLike(token!, post.post.id);
      setLikeCount(result.count);
      setCheckLiked(result.checkLiked);
    };
    like();
  }, [post, checkLiked]);
  useEffect(() => {
    if(updatedPost){
      if(post.post.id === updatedPost.postId){
        setContent(updatedPost.updatedPost!);
      }
    }
  }, [updatedPost]);
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
  const handleLike = async () => {
    if (token) {
      const check = await likePost(token, post.post.id);
      setCheckLiked(check);
    }
  };
  const handleChatClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };
  // 게시물 상세보기 모달
  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };
  const closeModal = () => {
    setSelectedPostId(null);
    dispatch(clearComment());
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
  }
  const onEditClose = () => {
    setPostConfig(false);
  }
  // 게시물 수정 로딩
  const onEditLoadingOpen = () => {
    setLoading(true);
  }
  const onEditLoadingClose= () => {
    setLoading(false);
  }
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
          <div className="fs14 ml10">
            <div>{post.post.nickname}</div> <div className="ms5 cAt">•</div>{" "}
            <div className="cAt">{displayCreateAt(post.post.createdAt)}</div>
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
        post={post.post}
      />
      <DeleteModal // 게시물 삭제 확인 모달
        postId={post.post.id}
        deleteOpen={deleteOpen}
        onDeleteClose={onDeleteClose}
      />
      <PostForm postConfig={postConfig} onClose={onEditClose} openModal={onEditLoadingOpen} post={post.post}/>
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
          {post.post.mediaList &&
            post.post.mediaList.length > 1 &&
            currentImageIndex < post.post.mediaList.length - 1 && (
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
            {post.post.mediaList.map((media, index) => (
              <img key={index} src={media.mediaPath} alt="img" />
            ))}
          </div>
        </div>
        <PostUtilIcon
          checkLiked={checkLiked}
          handleLike={handleLike}
          handleChatClick={handleChatClick}
          config={true}
          postId={post.post.id}
        />
        <PostLikeCount
          config={true}
          likeCount={likeCount}
          handleLike={handleLike}
        />
        <div className="pct">
          <div className="c2">
            <span>{post.post.nickname}</span>
          </div>
          <div
            className="c3"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="cabtn">
          <button
            onClick={() => {
              handlePostModal(post.post.id);
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
