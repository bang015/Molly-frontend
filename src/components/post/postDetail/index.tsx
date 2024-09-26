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
import { clearPostDetail } from '@/redux/postList'
import { RootState } from '@/redux'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { createdAt, displayCreateAt } from '@/utils/format/moment'
import {
  addComment,
  clearComment,
  getComment,
  getMyCommentByPost,
  updateComment,
} from '@/redux/comment'
import { CommentList } from '../comment/commentList'
import { followUser, followedCheck } from '@/redux/follow'
import PostUtilIcon from '../postUtilIcon'
import PostLikeCount from '../postLikeCount'
import { useNavigate } from 'react-router-dom'
import { closeModal, openSubModal } from '@/redux/modal'
import { formatTextToHTML } from '@/utils/format/formatter'
import { MediaListType } from '@/interfaces/post'
import { CommentType } from '@/interfaces/comment'

const PostDetail: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.authReducer)
  const post = useSelector((state: RootState) => state.postListReducer.postDetail)
  const loading = useSelector((state: RootState) => state.postListReducer.loading.detail)
  const { editingComment } = useSelector((state: RootState) => state.commentReducer)
  const commentList = useSelector((state: RootState) => state.commentReducer.commentList)
  const totalPages = useSelector((state: RootState) => state.commentReducer.totalPages.comment)
  const { followed } = useSelector((state: RootState) => state.followReducer)
  const { isOpen } = useSelector((state: RootState) => state.modalReducer)
  const textFieldRef = useRef<HTMLInputElement | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [commentId, setCommentId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [checkFollowed, setCheckFollowed] = useState(false)
  useEffect(() => {
    dispatch(clearComment())
  }, [])
  useEffect(() => {
    // dispatch(getPostDetail(id!) as any)
    dispatch(getComment({ postId: post?.id!, page }) as any)
    if (page === 1) {
      dispatch(getMyCommentByPost(post?.id!) as any)
    }
  }, [post, page])

  useEffect(() => {
    followCheck()
  }, [user, post, followed])
  const followCheck = async () => {
    if (post) {
      const result = await followedCheck(post.user.id)
      setCheckFollowed(result)
    }
  }

  useEffect(() => {
    if (editingComment) {
      const originalText = editingComment.content.replace(/<[^>]+>/g, '')
      setComment(originalText)
      if (textFieldRef.current) {
        textFieldRef.current.focus()
      }
    }
  }, [editingComment])
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
  const focusCommentInput = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
  }
  const handlePostComment = async () => {
    const commentContent = formatTextToHTML(comment)
    dispatch(
      addComment({ postId: post?.id!, content: commentContent, commentId: commentId }) as any,
    )
    setComment('')
    setCommentId(null)
  }
  const handleUpdateComment = async () => {
    const commentContent = formatTextToHTML(comment)
    const content = commentContent
    if (editingComment) {
      dispatch(updateComment({ id: editingComment.id, content }) as any)
    }
    setComment('')
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
    const followUserId = post?.user.id!
    dispatch(followUser(followUserId) as any)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (comment.trim() !== '') {
        if (editingComment) {
          handleUpdateComment()
        } else {
          handlePostComment()
        }
      }
    }
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
          <div className="modal">
            <div className="flex">
              {loading ? (
                <div className="media">
                  <Skeleton variant="rectangular" width={897} height={897} />
                </div>
              ) : (
                <div className="media">
                  {currentImageIndex > 0 && (
                    <div className="switch-btn left-2">
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
                  {post.postMedias.length > 1 && currentImageIndex < post.postMedias.length - 1 && (
                    <div className="switch-btn right-2">
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
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {post.postMedias.map((media: MediaListType, index: number) => (
                      <img key={index} src={media.path} alt="img" />
                    ))}
                  </div>
                </div>
              )}
              <div className="pointer-events-auto flex min-w-body400 max-w-body510 flex-col rounded-r-lg bg-white">
                <div className="border-b border-l">
                  <div className="flex items-center">
                    <div className="flex grow items-center px-5 py-3">
                      <div onClick={goToProfilePage}>
                        {post && <Avatar alt="Remy Sharp" src={post?.user?.profileImage?.path} />}
                      </div>
                      <div className="ml-2.5 flex items-center">
                        <div className="mr-1 text-body14m" onClick={goToProfilePage}>
                          {post.user.nickname}
                        </div>
                        {!checkFollowed && post.user.id !== user?.id && (
                          <div>
                            <span>•</span>
                            <button onClick={handleFollow}>
                              <div className="ml-1 text-body14sd text-main">팔로우</div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-2">
                      <IconButton
                        aria-label="more"
                        onClick={() => {
                          dispatch(
                            openSubModal({
                              subModalType: 'PostActionModal',
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
                <div className="relative flex grow flex-col border-l">
                  <div className="relative order-1 grow overflow-auto">
                    <ul className="absolute size-full overflow-y-scroll p-5">
                      <li>
                        <div className="flex">
                          <div className="mr-4" onClick={goToProfilePage}>
                            {post && <Avatar src={post?.user?.profileImage?.path} />}
                          </div>
                          <div className="grow">
                            <div
                              className="mr-1.5 inline-flex text-body12sd"
                              onClick={goToProfilePage}
                            >
                              <span>{post.user.nickname}</span>
                            </div>
                            <div
                              className="inline-flex text-body14rg"
                              dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                            <div className="pt-1 text-body12rg text-gray-500">
                              <div>{displayCreateAt(post?.createdAt)}</div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <div className="pt-3">
                        {commentList.map((comment: CommentType) => (
                          <CommentList
                            key={comment.id}
                            comment={comment}
                            handleSubComment={handleSubComment}
                          />
                        ))}
                        {totalPages > page && (
                          <div className="mt-2.5 text-center" onClick={handleNextPage}>
                            <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
                          </div>
                        )}
                      </div>
                    </ul>
                  </div>
                  <PostUtilIcon config={false} focusCommentInput={focusCommentInput} post={post} />
                  <PostLikeCount config={false} post={post} />
                  <div className="order-5 mb-2.5 px-5 text-body14rg text-gray-500">
                    {createdAt(post?.createdAt)}
                  </div>
                  <div className="order-6 border-t">
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
                      onKeyDown={handleKeyDown}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          padding: 16,
                          paddingRight: '8px',
                          transition: 'none',
                        },
                        endAdornment: editingComment ? (
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
