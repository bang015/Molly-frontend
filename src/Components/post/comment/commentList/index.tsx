import React, { useEffect, useState } from 'react'
import { CommentType } from '@/interfaces/comment'
import { SubCommentList } from '../subCommentList'
import { Avatar, IconButton } from '@mui/material'
import { displayCreateAt } from '@/utils/format/moment'
import { NewCommentList } from '../newCommentList'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openSubModal } from '@/redux/modal'

interface commentListProps {
  comment: CommentType
  handleSubComment: (nickname: string, commentId: number) => void
  newCommentList: { id: number; comment: CommentType }[]
  setNewCommentList: React.Dispatch<React.SetStateAction<{ id: number; comment: CommentType }[]>>
}
export const CommentList: React.FC<commentListProps> = ({
  comment,
  handleSubComment,
  newCommentList,
  setNewCommentList,
}) => {
  const [isSubCommentVisible, setIsSubCommentVisible] = useState(false)
  const [newSub, setNewSub] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    const check = newCommentList.some(c => c.id === comment.id)
    if (check) setNewSub(true)
  }, [newCommentList])
  const handleSubCommentList = () => {
    setIsSubCommentVisible(!isSubCommentVisible)
    const updatedCommentList = newCommentList.filter(item => item.id !== comment.id)
    setNewCommentList(updatedCommentList)
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
        className='my-1'
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
      {(comment.subCommentsCount! > 0 || newSub) && (
        <div className="ml-14">
          <button className="flex" onClick={handleSubCommentList}>
            <span className="text-body12sd">
              {isSubCommentVisible ? '답글 숨기기' : `답글 보기(${comment.subCommentsCount}개)`}
            </span>
          </button>
          {isSubCommentVisible ? (
            <div>
              <SubCommentList
                postId={comment.postId}
                id={comment.id}
                newCommentList={newCommentList}
                subcommentCount={comment.subCommentsCount!}
              />
            </div>
          ) : (
            <div>
              <NewCommentList
                postId={comment.postId}
                id={comment.id}
                newCommentList={newCommentList}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
