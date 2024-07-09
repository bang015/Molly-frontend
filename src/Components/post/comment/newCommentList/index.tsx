import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import { commentType } from "@/interfaces/comment";
import { displayCreateAt } from "@/utils/moment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface newCommentListProps {
  postId: number;
  id: number;
  newCommentList: { id: number; comment: commentType }[];
}
export const NewCommentList: React.FC<newCommentListProps> = ({
  id,
  newCommentList,
}) => {
  const [subComment, setSubComment] = useState<commentType[]>([]);

  useEffect(() => {
    newComment();
  }, [newCommentList, id]);
  const newComment = () => {
    newCommentList.forEach((item) => {
      if (item.id === id) {
        const filteredSubComments = subComment.filter(
          (c) => c.id !== item.comment.id
        );
        setSubComment([item.comment, ...filteredSubComments]);
      }
    });
  };
  return (
    <div>
      {subComment.map((comment) => (
        <div key={comment.id} className="cml">
          <div className="c1">
            <Avatar alt="profile" src={comment.user.ProfileImage?.path} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <div className="c2">
              <span>{comment.user.nickname}</span>
            </div>
            <div
              className="c3"
              dangerouslySetInnerHTML={{
                __html: comment.content,
              }}
            />
            <div className="crAt">
              <div>{displayCreateAt(comment.createdAt)}</div>
            </div>
          </div>
          <div className="cmb">
            <IconButton aria-label="delete">
              <MoreHorizIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};
