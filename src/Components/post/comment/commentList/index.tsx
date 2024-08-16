import React, { useCallback, useState } from 'react'
import { CommentType } from '@/interfaces/comment'
import { SubCommentList } from '../subCommentList'
import { Avatar, IconButton } from '@mui/material'
import { displayCreateAt } from '@/utils/format/moment'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openSubModal } from '@/redux/modal'
import { getSubComment, setShowSubComments } from '@/redux/comment'

interface commentListProps {
  comment: CommentType
  handleSubComment: (nickname: string, commentId: number) => void
}
export const CommentList: React.FC<commentListProps> = ({ comment, handleSubComment }) => {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const totalSubCommentPage = Math.ceil(comment.subCommentsCount / 3)
  const handleSubCommentList = useCallback(() => {
    dispatch(setShowSubComments(comment.id))
    dispatch(getSubComment({ id: comment.id, page }) as any)
  }, [comment.id, dispatch, page])
  const handleLoadMoreSubComments = () => {
    setPage(prevPage => {
      if (totalSubCommentPage > page) {
        const nextPage = prevPage + 1
        dispatch(getSubComment({ id: comment.id, page: nextPage }) as any)
        return nextPage
      }
      return prevPage
    })
  }
  const goToProfilePage = () => {
    if (comment) {
      navigate(`/profile/${comment.user.nickname}`)
    }
  }
  return (
    <div key={comment.id}>
      <div className="flex py-2">
        <div className="mr-4" onClick={goToProfilePage}>
          <Avatar alt="profile" src={comment.user.profileImage?.path} />
        </div>
        <div className="grow">
          <div className="mr-1.5 inline-flex text-body12sd" onClick={goToProfilePage}>
            <span>{comment.user.nickname}</span>
          </div>
          <div
            className="inline-flex text-body14rg"
            dangerouslySetInnerHTML={{
              __html: comment.content,
            }}
          />
          <div className="flex pt-1 text-body12rg text-gray-500">
            <div>{displayCreateAt(comment.createdAt)}</div>
            <button
              className="ml-1.5 text-body12sd"
              onClick={() => {
                handleSubComment(comment.user.nickname, comment.id)
              }}
            >
              답글 달기
            </button>
          </div>
        </div>
        <IconButton
          className="my-1"
          aria-label="delete"
          onClick={() => {
            dispatch(
              openSubModal({
                subModalType: 'CommentActionModal',
                comment: comment,
              }),
            )
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      </div>
      {comment.subCommentsCount > 0 && (
        <div className="ml-14">
          <button className="flex" onClick={handleSubCommentList}>
            <span className="text-body12sd">
              {comment.showSubComments ? '답글 숨기기' : `답글 보기(${comment.subCommentsCount}개)`}
            </span>
          </button>
          {comment.showSubComments && comment.subComment && (
            <div>
              {comment.subComment.map(comment => (
                <SubCommentList key={comment.id} comment={comment} />
              ))}
              {comment.subCommentsCount! > comment.subComment.length && (
                <button
                  className="text-body12sd"
                  onClick={() => {
                    if (
                      comment.subCommentsCount - comment.subComment.length >= 1 &&
                      comment.subComment.length < 3
                    ) {
                      dispatch(getSubComment({ id: comment.id, page }) as any)
                    } else {
                      handleLoadMoreSubComments()
                    }
                  }}
                >
                  {`답글 더 보기(${comment.subCommentsCount - comment.subComment.length}개)`}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
