import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { PostType } from '@/interfaces/post'
import { Avatar, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { addCommentType, CommentType } from '@/interfaces/comment'
import { addComment, getMyCommentByPost } from '@/redux/comment'
import PostUtilIcon from '../postUtilIcon'
import PostLikeCount from '../postLikeCount'
import { displayCreateAt } from '@/utils/format/moment'
import { useNavigate } from 'react-router-dom'
import { openModal, openSubModal } from '@/redux/modal'
import { formatTextToHTML } from '@/utils/format/formatter'
import { setPostDetail } from '@/redux/postList'

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
  const [commentList, setCommentList] = useState<CommentType[]>([])

  useEffect(() => {
    const myComment = async () => {
      const result = await dispatch(getMyCommentByPost(post.id) as any)
      setCommentList(result.payload.slice(0, 3))
    }
    myComment()
  }, [user])
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
    const newComment = await dispatch(addComment(commentInfo) as any)
    setCommentList([newComment.payload, ...commentList])
    setComment('')
  }

  const focusCommentInput = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
  }
  const goToProfilePage = () => {
    navigate(`/profile/${post.user.nickname}`)
  }
  return (
    <div className="m-auto flex w-body510 flex-col p-5">
      <div className="flex py-1">
        <div className="flex grow cursor-pointer items-center" onClick={goToProfilePage}>
          <div>
            <Avatar
              alt="Remy Sharp"
              src={post.user.profileImage?.path}
              sx={{ width: 34, height: 34 }}
            />
          </div>
          <div className="ml-2.5 flex text-body14sd">
            <div>{post.user.nickname}</div> <div className="mx-1 text-gray-400">•</div>{' '}
            <div className="text-body14rg text-gray-400">{displayCreateAt(post.createdAt)}</div>
          </div>
        </div>
        <div>
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
      <div className="flex flex-col">
        <div className="media rounded">
          {currentImageIndex > 0 && (
            <div className="switch-btn left-2">
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
          {post && post.postMedias.length > 1 && currentImageIndex < post.postMedias.length - 1 && (
            <div className="switch-btn right-2">
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
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {post.postMedias.map((media, index) => (
              <img key={index} src={media.path} alt="img" />
            ))}
          </div>
        </div>
        <PostUtilIcon focusCommentInput={focusCommentInput} config={true} post={post} />
        <PostLikeCount config={true} post={post} />
        <div className="py-1">
          <div className="mr-1.5 inline-flex text-body12sd">
            <span>{post.user.nickname}</span>
          </div>
          <div
            className="inline-flex text-body14rg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        <div className="pb-1 text-body14rg text-gray-500">
          <button
            onClick={() => {
              dispatch(openModal({ modalType: 'PostDetailModal' }))
              dispatch(setPostDetail(post))
            }}
          >
            댓글 모두 보기
          </button>
        </div>
        {commentList && (
          <div>
            {commentList.map(comment => (
              <div key={comment.id}>
                <div className="mr-1.5 inline-flex text-body12sd">
                  <span>{comment.user.nickname}</span>
                </div>
                <div
                  className="inline-flex text-body14rg"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            ))}
          </div>
        )}
        <div className="border-b pb-4 pt-1">
          <TextField
            variant="standard"
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
