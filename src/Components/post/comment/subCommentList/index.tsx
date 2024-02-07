import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSubComment } from "../../../../Redux/comment";
import { Avatar } from "@mui/material";
import { commentType } from "../../../../Interfaces/comment";
import { displayCreateAt } from "../../../../Utils/moment";

interface subCommentListProps {
  postId: number;
  id: number;
}
export const SubCommentList: React.FC<subCommentListProps> = ({ postId, id }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [subComment, setSubComment] = useState<commentType[]>([]);
  useEffect(() => {
    const result = async () => {
      const comment = await getSubComment(postId, id, page);
      setSubComment(comment);
    };
    result();
  }, [postId, id, page]);
  return (
    <div>
      {subComment.map((comment) => (
        <div key={comment.id} className="cml">
          <div className="c1">
            <Avatar
              alt="profile"
              src={
                comment.profileImage
                  ? comment.profileImage ?? undefined
                  : undefined
              }
            />
          </div>
          <div>
            <div className="c2">
              <span>{comment.nickname}</span>
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
        </div>
      ))}
    </div>
  );
};
