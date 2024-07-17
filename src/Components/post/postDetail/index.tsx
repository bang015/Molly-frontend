import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Skeleton,
  TextField,
} from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearPostDetail, getPostByPostId } from '@/redux/postList'
import { RootState } from '@/redux'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import './index.css'
import { createdAt, displayCreateAt } from '@/utils/format/moment'
import {
  addComment,
  clearComment,
  getComment,
  getMyCommentByPost,
  updateComment,
} from '@/redux/comment'
import { addCommentType, commentType } from '@/interfaces/comment'
import { CommentList } from '../comment/commentList'
import { followUser, followedCheck } from '@/redux/follow'
import { getPostLike, likePost } from '@/redux/like'
import PostUtilIcon from '../postUtilIcon'
import PostLikeCount from '../postLikeCount'
import { useNavigate } from 'react-router-dom'
import { closeModal, openModal } from '@/redux/modal'

const PostDetail: React.FC = () => {
  const dispatch = useDispatch()
  const post = useSelector((state: RootState) => state.postListReducer.getPostDetail)
  const { updatePending, updateCommentId, updatedComment, deleteComment } = useSelector(
    (state: RootState) => state.commentReducer,
  )
  const Followed = useSelector((state: RootState) => state.followReducer.checkFollowed)
  const { user } = useSelector((state: RootState) => state.authReducer)
  const userPostList = useSelector((state: RootState) => state.postListReducer.posts.user);
  const { isOpen, id } = useSelector((state: RootState) => state.modalReducer)
  const navigate = useNavigate()
  const textFieldRef = useRef<HTMLInputElement | null>(null)
  const crAt = post?.createdAt as string
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [commentId, setCommentId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [commentList, setCommentList] = useState<commentType[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [newCommentList, setNewCommentList] = useState<{ id: number; comment: commentType }[]>([])
  const [likeCount, setLikeCount] = useState<number>(0)
  const [checkLiked, setCheckLiked] = useState(false)
  const [checkFollowed, setCheckFollowed] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    dispatch(getPostByPostId(id!) as any)
    const fetchData = async () => {
      if (user) {
        const otherCommentResult = await getComment(user.id!, id!, page)
        if (page === 1) {
          const myCommentResult = await getMyCommentByPost(user.id!, id!)
          setCommentList([...myCommentResult.commentList, ...otherCommentResult.commentList])
        } else {
          setCommentList(prevList => [...prevList, ...otherCommentResult.commentList])
        }
        setTotalPages(otherCommentResult.totalPages)
      }
    }
    fetchData()
  }, [user, id!, page])
  useEffect(() => {
    if (user?.id === post?.userId && userPostList.length) {
      const result = userPostList.filter(post => post.id === id!)
      if (result.length === 0) {
        ;() => dispatch(closeModal())
      }
    }
  }, [userPostList, id!, post])

  useEffect(() => {
    followCheck()
  }, [user, post, Followed])
  const followCheck = async () => {
    if (post) {
      const result = await followedCheck(post.userId)
      setCheckFollowed(result)
    }
  }
  useEffect(() => {
    const like = async () => {
      const result = await getPostLike(id!)
      setLikeCount(result.count)
      setCheckLiked(result.checkLiked)
    }
    like()
  }, [id!, checkLiked])
  useEffect(() => {
    if (deleteComment.length !== 0) {
      const CommentList = commentList.filter(item => !deleteComment.includes(item.id))
      setCommentList(CommentList)
    }
  }, [deleteComment])

  useEffect(() => {
    if (updatedComment) {
      const updatedCommentIndex = commentList.findIndex(map => map.id === updatedComment?.id)
      if (updatedCommentIndex !== -1) {
        const updatedCommentList = [...commentList]
        updatedCommentList[updatedCommentIndex] = updatedComment
        setCommentList(updatedCommentList)
      }
    }
  }, [updatedComment])

  useEffect(() => {
    if (updatePending) {
      if (updateCommentId) {
        const originalText = updateCommentId.content.replace(/<[^>]+>/g, '')
        setComment(originalText)
        if (textFieldRef.current) {
          textFieldRef.current.focus()
        }
      }
    }
  }, [updatePending, updateCommentId])
  useEffect(() => {
    post ? setLoading(false) : setLoading(true)
  }, [post])
  const goToProfilePage = () => {
    if (post) {
      navigate(`/profile/${post.user.nickname}`)
    }
  }
  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const commentContent = e.target.value
    if (!commentContent.includes('@')) {
      setCommentId(null)
    }
    setComment(commentContent)
  }
  const onPrevClick = () => {
    if (post) {
      setCurrentImageIndex(
        prevIndex => (prevIndex - 1 + post.postMedias.length) % post.postMedias.length,
      )
    }
  }
  const onNextClick = (): void => {
    if (post) {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % post.postMedias.length)
    }
  }
  const handleChatClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
  }
  const handlePostComment = async () => {
    const commentContent = comment
      .replace(/\n/g, '<br>')
      .replace(/@([^\s]+)/g, '<span style="color: rgb(0, 55, 107);">@$1</span>')
    const commentInfo: addCommentType = {
      postId: id!,
      content: commentContent,
      commentId: commentId,
    }
    const newComment = await addComment(commentInfo)
    if (newComment.commentId === null) {
      setCommentList([newComment, ...commentList])
    } else {
      const id: number = newComment.commentId
      const commentlist = { id, comment: newComment }
      setNewCommentList([...newCommentList, commentlist])
    }
    setComment('')
    setCommentId(null)
  }
  const handleUpdateComment = async () => {
    const commentContent = comment
      .replace(/\n/g, '<br>')
      .replace(/@([^\s]+)/g, '<span style="color: rgb(0, 55, 107);">@$1</span>')
    const id = updateCommentId?.id
    const content = commentContent
    if (id) {
      dispatch(updateComment({ id, content }) as any)
    }
    setComment('')
    dispatch(clearComment())
  }
  const handleSubComment = (nickname: string, commentId: number) => {
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
    setCommentId(commentId)
    setComment(`@${nickname} `)
  }
  const handleNextPage = () => {
    if (totalPages > page) setPage(page + 1)
  }
  const handleFollow = () => {
    const followUserId = post?.userId!
    dispatch(followUser({ followUserId }) as any)
  }
  const handleLike = async () => {
    const check = await likePost(id!)
    setCheckLiked(check)
  }
  const close = () => {
    dispatch(closeModal())
    dispatch(clearComment())
    dispatch(clearPostDetail())
  }
  return (
    <div>
      {post && (
        <Modal open={isOpen} onClose={close}>
          <div className="post-detail">
            <div className="post-container">
              {loading ? (
                <div className="post-media">
                  <Skeleton variant="rectangular" width={897} height={897} />
                </div>
              ) : (
                <div className="post-media">
                  {currentImageIndex > 0 && (
                    <div className="c-back-btn">
                      <IconButton
                        aria-label="fingerprint"
                        color="secondary"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        onClick={onPrevClick}
                      >
                        <ChevronLeftIcon style={{ color: 'black' }} />
                      </IconButton>
                    </div>
                  )}
                  {post &&
                    post.postMedias &&
                    post.postMedias.length > 1 &&
                    currentImageIndex < post.postMedias.length - 1 && (
                      <div className="c-next-btn">
                        <IconButton
                          aria-label="fingerprint"
                          color="secondary"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          }}
                          onClick={onNextClick}
                        >
                          <NavigateNextIcon style={{ color: 'black' }} />
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
                      {post.postMedias.map((media, index) => (
                        <img key={index} src={media.path} alt="img" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="post-comment">
                <div className="comment-header">
                  <div className="ch1">
                    <div className="cht1">
                      <div className="pi" onClick={goToProfilePage}>
                        {post && <Avatar alt="Remy Sharp" src={post?.user?.profileImage?.path} />}
                      </div>
                      <div className="uf">
                        <div className="un" onClick={goToProfilePage}>
                          {post.user.nickname}
                        </div>
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
                      <IconButton
                        aria-label="more"
                        onClick={() => {
                          dispatch(
                            openModal({
                              modalType: 'PostActionModal',
                              post: post,
                              id: post.id,
                            }),
                          )
                        }}
                      >
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
                          <div className="c1" onClick={goToProfilePage}>
                            {post && <Avatar src={post?.user?.profileImage?.path} />}
                          </div>
                          <div>
                            <div className="c2" onClick={goToProfilePage}>
                              <span>{post.user.nickname}</span>
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
                        {commentList.map(comment => (
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
                    postId={id!}
                  />
                  <PostLikeCount config={false} likeCount={likeCount} handleLike={handleLike} />
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
                          paddingRight: '8px',
                          transition: 'none',
                        },
                        endAdornment: updatePending ? (
                          <InputAdornment position="end">
                            <Button disabled={comment === ''} onClick={handleUpdateComment}>
                              수정
                            </Button>
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            <Button disabled={comment === ''} onClick={handlePostComment}>
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
  )
}

export default PostDetail
