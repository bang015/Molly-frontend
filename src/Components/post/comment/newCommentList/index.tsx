import React, { useEffect, useState } from 'react'
import { Avatar, IconButton } from '@mui/material'
import { CommentType } from '@/interfaces/comment'
import { displayCreateAt } from '@/utils/format/moment'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

interface newCommentListProps {
  postId: number
  id: number
  newCommentList: { id: number; comment: CommentType }[]
}
export const NewCommentList: React.FC<newCommentListProps> = ({ id, newCommentList }) => {
  const [subComment, setSubComment] = useState<CommentType[]>([])

  useEffect(() => {
    newComment()
  }, [newCommentList, id])
  const newComment = () => {
    newCommentList.forEach(item => {
      if (item.id === id) {
        const filteredSubComments = subComment.filter(c => c.id !== item.comment.id)
        setSubComment([item.comment, ...filteredSubComments])
      }
    })
  }
  return (
    <div>
      {subComment.map(comment => (
        <div key={comment.id} className="flex py-2">
          <div className="mr-4">
            <Avatar alt="profile" src={comment.user.profileImage?.path} />
          </div>
          <div className="grow">
            <div className="mr-1.5 inline-flex text-body12sd">
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
          <IconButton className='my-1' aria-label="delete">
            <MoreHorizIcon />
          </IconButton>
        </div>
      ))}
    </div>
  )
}
