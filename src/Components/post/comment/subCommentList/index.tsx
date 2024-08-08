import React, { useEffect, useState } from 'react'
import { getSubComment } from '@/redux/comment'
import { Avatar, IconButton } from '@mui/material'
import { CommentType } from '@/interfaces/comment'
import { displayCreateAt } from '@/utils/format/moment'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { useNavigate } from 'react-router-dom'
import { openSubModal } from '@/redux/modal'

interface subCommentListProps {
  postId: number
  id: number
  newCommentList: { id: number; comment: CommentType }[]
  subcommentCount: number
}
export const SubCommentList: React.FC<subCommentListProps> = ({
  postId,
  id,
  newCommentList,
  subcommentCount,
}) => {
  const updatedComment = useSelector((state: RootState) => state.commentReducer.updatedComment)
  const deleteComment = useSelector((state: RootState) => state.commentReducer.deleteComment)
  const [page, setPage] = useState(1)
  const [subComment, setSubComment] = useState<CommentType[]>([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    const subList = async () => {
      setSubComment([])
      const result = await dispatch(getSubComment({ postId, id, page }) as any)
      setSubComment([...subComment, ...result.payload])
    }
    subList()
  }, [postId, id, page])

  useEffect(() => {
    newComment()
  }, [newCommentList])
  const newComment = () => {
    newCommentList.forEach(item => {
      if (item.id === id) {
        setSubComment([item.comment, ...subComment])
      }
    })
  }

  useEffect(() => {
    if (deleteComment.length !== 0) {
      const CommentList = subComment.filter(item => !deleteComment.includes(item.id))
      setSubComment(CommentList)
    }
  }, [deleteComment])

  useEffect(() => {
    if (updatedComment) {
      const updatedCommentIndex = subComment.findIndex(map => map.id === updatedComment?.id)
      if (updatedCommentIndex !== -1) {
        const updatedCommentList = [...subComment]
        updatedCommentList[updatedCommentIndex] = updatedComment
        setSubComment(updatedCommentList)
      }
    }
  }, [updatedComment])

  const handleNextPage = () => {
    setPage(page + 1)
  }
  const subCommentPages = Math.ceil(subcommentCount / 3)
  const goToProfilePage = (nickname: string) => {
    if (nickname) {
      navigate(`/profile/${nickname}`)
    }
  }
  return (
    <div>
      {subComment.map(comment => (
        <div key={comment.id} className="flex py-2">
          <div
            className="mr-4"
            onClick={() => {
              goToProfilePage(comment.user.nickname)
            }}
          >
            <Avatar alt="profile" src={comment.user.profileImage?.path} />
          </div>
          <div className="grow">
            <div
              className="mr-1.5 inline-flex text-body12sd"
              onClick={() => {
                goToProfilePage(comment.user.nickname)
              }}
            >
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
      ))}
      {subCommentPages > page && (
        <button onClick={handleNextPage}>
          <span>{`답글 더 보기(${subcommentCount - page * 3}개)`}</span>
        </button>
      )}
    </div>
  )
}
