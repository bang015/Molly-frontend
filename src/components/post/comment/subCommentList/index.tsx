import React, { useEffect, useState } from 'react'
import { Avatar, IconButton } from '@mui/material'
import { CommentType } from '@/interfaces/comment'
import { displayCreateAt } from '@/utils/format/moment'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { useNavigate } from 'react-router-dom'
import { openSubModal } from '@/redux/modal'

interface subCommentListProps {
  comment: CommentType
}
export const SubCommentList: React.FC<subCommentListProps> = ({ comment }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const goToProfilePage = (nickname: string) => {
    if (nickname) {
      navigate(`/profile/${nickname}`)
    }
  }
  return (
    <div>
      <div key={comment.id} className="flex py-2">
        <div
          className="mr-4"
          onClick={() => {
            goToProfilePage(comment.user.nickname)
          }}
        >
          <Avatar alt="profile" src={comment?.user?.profileImage?.path} />
        </div>
        <div className="grow">
          <div
            className="mr-1.5 inline-flex text-body12sd"
            onClick={() => {
              goToProfilePage(comment?.user?.nickname)
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
    </div>
  )
}
