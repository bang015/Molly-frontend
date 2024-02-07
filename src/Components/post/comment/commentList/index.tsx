import React, { useState } from "react";
import { commentType } from "../../../../Interfaces/comment";
import { SubCommentList } from "../subCommentList";
import { Avatar } from "@mui/material";
import { displayCreateAt } from "../../../../Utils/moment";
interface commentListProps {
  comment: commentType;
  handleSubComment: (nickname: string, commentId: number) => void;
}
export const CommentList: React.FC<commentListProps> = ({
  comment,
  handleSubComment,
}) => {
  const [isSubCommentVisible, setIsSubCommentVisible] = useState(false);

  const handleSubCommentList = () => {
    setIsSubCommentVisible(!isSubCommentVisible);
  };
  return (
    <div key={comment.id}>
      <div className="cml">
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
            <div>
              <button
                className="c-btn"
                onClick={() => {
                  handleSubComment(comment.nickname, comment.id);
                }}
              >
                답글 달기
              </button>
            </div>
          </div>
        </div>
      </div>
      {comment.subcommentCount! > 0 && (
        <div className="cmb">
          <button onClick={handleSubCommentList}>
            <div className="cmll"></div>
            <span>답글 보기({comment.subcommentCount}개)</span>
          </button>
          {isSubCommentVisible && (
            <div>
              <SubCommentList postId={comment.postId} id={comment.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
