import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { PostType } from '@/interfaces/post'
import './index.css'
import { Avatar, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { addCommentType, commentType } from '@/interfaces/comment'
import { addComment, getMyCommentByPost } from '@/redux/comment'
import PostUtilIcon from '../postUtilIcon'
import { getPostLike, likePost } from '@/redux/like'
import PostLikeCount from '../postLikeCount'
import { displayCreateAt } from '@/utils/format/moment'
import { useNavigate } from 'react-router-dom'
import { openModal } from '@/redux/modal'
import { formatTextToHTML } from '@/utils/format/formatter'

interface postListProps {
  post: PostType
}
const PostList: React.FC<postListProps> = ({ post }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.authReducer.user)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const textFieldRef = useRef<HTMLInputElement | null>(null)
  const [commentList, setCommentList] = useState<commentType[]>([])
  const [likeCount, setLikeCount] = useState<number>(0)
  const [checkLiked, setCheckLiked] = useState(false)

  useEffect(() => {
    const myComment = async () => {
      const result = await getMyCommentByPost(user?.id!, post.id)
      setCommentList(result.commentList)
    }
    myComment()
  }, [user, post])
  useEffect(() => {
    const like = async () => {
      const result = await getPostLike(post.id)
      setLikeCount(result.count)
      setCheckLiked(result.checkLiked)
    }
    like()
  }, [post, checkLiked])
  const onPrevClick = () => {
    setCurrentImageIndex(
      prevIndex => (prevIndex - 1 + post.postMedias.length) % post.postMedias.length,
    )
  }
  const onNextClick = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % post.postMedias.length)
  }
  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const commentContent = e.target.value
    setComment(commentContent)
  }
  const handlePostComment = async () => {
    const commentContent = formatTextToHTML(comment)
    const commentInfo: addCommentType = {
      postId: post.id,
      content: commentContent,
    }
    const newComment= await addComment(commentInfo)
    setCommentList([newComment, ...commentList])
    setComment('')
  }
  const handleLike = async () => {
    const check = await likePost(post.id)
    setCheckLiked(check)
  }
  const handleChatClick = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
  }
  const goToProfilePage = () => {
    navigate(`/profile/${post.user.nickname}`)
  }
  return (
    <div className="container">
      <div className="ph1">
        <div className="pht1" onClick={goToProfilePage}>
          <div>
            <Avatar
              alt="Remy Sharp"
              src={post.user.profileImage?.path}
              sx={{ width: 34, height: 34 }}
            />
          </div>
          <div className="fs14 ml10">
            <div>{post.user.nickname}</div> <div className="ms5 cAt">•</div>{' '}
            <div className="cAt">{displayCreateAt(post.createdAt)}</div>
          </div>
        </div>
        <div>
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
      <div className="content">
        <div className="media">
          {currentImageIndex > 0 && (
            <div className="c-back-btn">
              <IconButton
                aria-label="fingerprint"
                color="secondary"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  padding: 0,
                }}
                onClick={onPrevClick}
              >
                <ChevronLeftIcon style={{ color: 'black' }} />
              </IconButton>
            </div>
          )}
          {post.postMedias &&
            post.postMedias.length > 1 &&
            currentImageIndex < post.postMedias.length - 1 && (
              <div className="c-next-btn">
                <IconButton
                  aria-label="fingerprint"
                  color="secondary"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    padding: 0,
                  }}
                  onClick={onNextClick}
                >
                  <NavigateNextIcon style={{ color: 'black' }} />
                </IconButton>
              </div>
            )}
          <div
            className="medias-wrapper"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {post.postMedias.map((media, index) => (
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
        <PostLikeCount config={true} likeCount={likeCount} handleLike={handleLike} />
        <div className="pct">
          <div className="c2">
            <span>{post.user.nickname}</span>
          </div>
          <div className="c3" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        <div className="cabtn">
          <button
            onClick={() => {
              dispatch(openModal({ modalType: 'PostDetailModal', id: post.id }))
            }}
          >
            댓글 모두 보기
          </button>
        </div>
        {commentList && (
          <div>
            {commentList.map(comment => (
              <div key={comment.id}>
                <div className="c2">
                  <span>{comment.user.nickname}</span>
                </div>
                <div className="c3" dangerouslySetInnerHTML={{ __html: comment.content }} />
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
                transition: 'none',
                fontSize: 'small',
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    disabled={comment === ''}
                    onClick={handlePostComment}
                    style={{
                      padding: 0,
                      justifyContent: 'flex-end',
                      background: 'none',
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
  )
}

export default PostList
