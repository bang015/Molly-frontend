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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./index.css";
import { createdAt, displayCreateAt } from "../../../Utils/moment";
import EmojiPicker from "emoji-picker-react";
import {
  addComment,
  clearComment,
  getComment,
  getMyCommentByPost,
  updateComment,
} from "../../../Redux/comment";
import { addCommentType, commentType } from "../../../Interfaces/comment";
import { CommentList } from "../comment/commentList";
import { followUser, followedCheck } from "../../../Redux/follow";
import { getPostLike, likePost } from "../../../Redux/like";
import PostMoreModal from "../../EditDeleteModal/post";
import DeleteModal from "../../EditDeleteModal/delete";
import PostUtilIcon from "../postUtilIcon";
import PostLikeCount from "../postLikeCount";
import PostForm from "../postForm";
interface PostDetailModalProps {
  postId: number;
  onClose: () => void;
}
const PostDetail: React.FC<PostDetailModalProps> = ({ postId, onClose }) => {
  const dispatch = useDispatch();
  const post = useSelector(
    (state: RootState) => state.postListReducer.getPostDetail
  );
  const updatePending = useSelector(
    (state: RootState) => state.commentReducer.updatePending
  );
  const updateCommentId = useSelector(
    (state: RootState) => state.commentReducer.updateCommentId
  );
  const updatedComment = useSelector(
    (state: RootState) => state.commentReducer.updatedComment
  );
  const deleteComment = useSelector(
    (state: RootState) => state.commentReducer.deletComment
  );
  const Followed = useSelector(
    (state: RootState) => state.followReducer.chekcFollowed
  );

  const token = useSelector((state: RootState) => state.authReducer.token);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const userPostList = useSelector(
    (state: RootState) => state.postListReducer.userPostList
  );
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const crAt = post?.createdAt as string;
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [commentList, setCommentList] = useState<commentType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [newCommentList, setNewCommentList] = useState<
    { id: number; comment: commentType }[]
  >([]);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [checkLiked, setCheckLiked] = useState(false);
  const [checkFollowed, setCheckFollowed] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [postConfig, setPostConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    dispatch(getPostByPostId(postId) as any);
    const fetchData = async () => {
      if (user) {
        const otherCommentResult = await getComment(user.id!, postId, page);
        if (page === 1) {
          const myCommentResult = await getMyCommentByPost(user.id!, postId);
          setCommentList([
            ...myCommentResult.commentList,
            ...otherCommentResult.commentList,
          ]);
        } else {
          setCommentList((prevList) => [
            ...prevList,
            ...otherCommentResult.commentList,
          ]);
        }
        setTotalPages(otherCommentResult.totalPages);
      }
    };
    fetchData();
  }, [user, postId, page]);

  useEffect(() => {
    if (user?.id === post?.userId && userPostList.length) {
      const result = userPostList.filter((post) => post.id === postId);
      if (result.length === 0) {
        onClose();
      }
    }
  }, [userPostList, postId, post]);

  useEffect(() => {
    followCheck();
  }, [user, post, Followed]);
  const followCheck = async () => {
    if (token && post) {
      const result = await followedCheck(token, post.userId);
      setCheckFollowed(result);
    }
  };
  useEffect(() => {
    const like = async () => {
      const result = await getPostLike(token!, postId);
      setLikeCount(result.count);
      setCheckLiked(result.checkLiked);
    };
    like();
  }, [postId, checkLiked]);
  useEffect(() => {
    if (deleteComment.length !== 0) {
      const CommentList = commentList.filter(
        (item) => !deleteComment.includes(item.id)
      );
      setCommentList(CommentList);
    }
  }, [deleteComment]);

  useEffect(() => {
    if (updatedComment) {
      const updatedCommentIndex = commentList.findIndex(
        (map) => map.id === updatedComment?.id
      );
      if (updatedCommentIndex !== -1) {
        const updatedCommentList = [...commentList];
        updatedCommentList[updatedCommentIndex] = updatedComment;
        setCommentList(updatedCommentList);
      }
    }
  }, [updatedComment]);

  useEffect(() => {
    if (updatePending) {
      if (updateCommentId) {
        const originalText = updateCommentId.content.replace(/<[^>]+>/g, "");
        setComment(originalText);
        if (textFieldRef.current) {
          textFieldRef.current.focus();
        }
      }
    }
  }, [updatePending, updateCommentId]);
  const goToProfilePage = () => {
    if (post) {
      window.location.href = `/profile/${post.nickname}`;
    }
  };
  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const commentContent = e.target.value;
    if (!commentContent.includes("@")) {
      setCommentId(null);
    }
    setComment(commentContent);
  };
  const onPrevClick = () => {
    if (post) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + post.mediaList.length) % post.mediaList.length
      );
    }
  };
  const onNextClick = (): void => {
    if (post) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % post.mediaList.length
      );
    }
  };
  const handleChatClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };
  const handlePostComment = async () => {
    const commentContent = comment
      .replace(/\n/g, "<br>")
      .replace(
        /@([^\s]+)/g,
        '<span style="color: rgb(0, 55, 107);">@$1</span>'
      );
    const commentInfo: addCommentType = {
      postId: postId,
      content: commentContent,
      commentId: commentId,
    };
    if (token) {
      const comment = await addComment(token, commentInfo);
      if (comment.commentId === null) {
        setCommentList([comment, ...commentList]);
      } else {
        const id = comment.commentId;
        const commentlist = { id, comment };
        setNewCommentList([...newCommentList, commentlist]);
      }
    }
    setComment("");
    setCommentId(null);
  };
  const handleUpdateComment = async () => {
    const commentContent = comment
      .replace(/\n/g, "<br>")
      .replace(
        /@([^\s]+)/g,
        '<span style="color: rgb(0, 55, 107);">@$1</span>'
      );
    const id = updateCommentId?.id;
    const content = commentContent;
    if (token && id) {
      dispatch(updateComment({ token, id, content }) as any);
    }
    setComment("");
    dispatch(clearComment());
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
  const handleFollow = () => {
    if (token) {
      const followUserId = post?.userId!;
      dispatch(followUser({ token, followUserId }) as any);
    }
  };
  const handleLike = async () => {
    if (token) {
      const check = await likePost(token, postId);
      setCheckLiked(check);
    }
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
  // 게시물 수정 로딩 모달
  const onEditLoadingOpen = () => {
    setLoading(true);
  };
  const onEditLoadingClose = () => {
    setLoading(false);
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
                  <div
                    className="medias-wrapper"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {post.mediaList.map((media, index) => (
                      <img key={index} src={media.mediaPath} alt="img" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="post-comment">
                <div className="comment-header">
                  <div className="ch1">
                    <div className="cht1">
                      <div className="pi" onClick={goToProfilePage}>
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
                        <div className="un" onClick={goToProfilePage}>{post.nickname}</div>
                        {!checkFollowed && post.userId !== user?.id && (
                          <div>
                            <span>•</span>
                            <button onClick={handleFollow}>
                              <div className="ft">팔로우</div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb">
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
                    postId={postId}
                    deleteOpen={deleteOpen}
                    onDeleteClose={onDeleteClose}
                  />
                  <PostForm // 게시물 수정 모달
                    postConfig={postConfig}
                    onClose={onEditClose}
                    openModal={onEditLoadingOpen}
                    post={post}
                  />
                </div>
                <div className="comment-main">
                  <div className="comment">
                    <ul className="comment-list">
                      <li>
                        <div className="p-content">
                          <div className="c1" onClick={goToProfilePage}>
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
                            <div className="c2" onClick={goToProfilePage}>
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
                            newCommentList={newCommentList}
                            setNewCommentList={setNewCommentList}
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
                  <PostUtilIcon
                    config={false}
                    handleChatClick={handleChatClick}
                    checkLiked={checkLiked}
                    handleLike={handleLike}
                    postId={postId}
                  />
                  <PostLikeCount
                    config={false}
                    likeCount={likeCount}
                    handleLike={handleLike}
                  />
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
                        endAdornment: updatePending ? (
                          <InputAdornment position="end">
                            <Button
                              disabled={comment === ""}
                              onClick={handleUpdateComment}
                            >
                              수정
                            </Button>
                          </InputAdornment>
                        ) : (
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
