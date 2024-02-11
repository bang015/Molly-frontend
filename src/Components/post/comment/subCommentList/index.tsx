import React, { useEffect, useState } from "react";
import { getSubComment } from "../../../../Redux/comment";
import { Avatar, IconButton } from "@mui/material";
import { commentType } from "../../../../Interfaces/comment";
import { displayCreateAt } from "../../../../Utils/moment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface subCommentListProps {
  postId: number;
  id: number;
  newCommentList: { id: number; comment: commentType }[];
  subcommentCount: number;
}
export const SubCommentList: React.FC<subCommentListProps> = ({
  postId,
  id,
  newCommentList,
  subcommentCount,
}) => {
  const [page, setPage] = useState(1);
  const [subComment, setSubComment] = useState<commentType[]>([]);
  useEffect(() => {
    const subList = async () => {
      setSubComment([]);
      const result = await getSubComment(postId, id, page);
      setSubComment([...subComment, ...result]);
    };
    subList();
  }, [postId, id, page]);

  useEffect(() => {
    newComment();
  }, [newCommentList]);
  const newComment = () => {
    newCommentList.forEach((item) => {
      if (item.id === id) {
        setSubComment([item.comment, ...subComment]);
      }
    });
  };
  const handleNextPage = () => {
    setPage(page + 1);
  };
  const subCommentPages = Math.ceil(subcommentCount / 3);
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
          <div style={{ flexGrow: 1 }}>
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
          <div className="cmb">
            <IconButton aria-label="delete">
              <MoreHorizIcon />
            </IconButton>
          </div>
        </div>
      ))}
      {subCommentPages > page && (
        <button onClick={handleNextPage}>
          <div className="cmll"></div>
          <span>{`답글 더 보기(${subcommentCount - page * 3}개)`}</span>
        </button>
      )}
    </div>
  );
};
