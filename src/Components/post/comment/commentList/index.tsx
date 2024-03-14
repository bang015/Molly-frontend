import React, { useState } from "react";
import { commentType } from "../../../../Interfaces/comment";
import { SubCommentList } from "../subCommentList";
import { Avatar, IconButton } from "@mui/material";
import { displayCreateAt } from "../../../../Utils/moment";
import { NewCommentList } from "../newCommentList";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditDeleteModal from "../../../EditDeleteModal/comment";
import { useNavigate } from "react-router-dom";

interface commentListProps {
  comment: commentType;
  handleSubComment: (nickname: string, commentId: number) => void;
  newCommentList: { id: number; comment: commentType }[];
  setNewCommentList: React.Dispatch<
    React.SetStateAction<{ id: number; comment: commentType }[]>
  >;
}
export const CommentList: React.FC<commentListProps> = ({
  comment,
  handleSubComment,
  newCommentList,
  setNewCommentList,
}) => {
  const [isSubCommentVisible, setIsSubCommentVisible] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSubCommentList = () => {
    setIsSubCommentVisible(!isSubCommentVisible);
    const updatedCommentList = newCommentList.filter(
      (item) => item.id !== comment.id
    );
    setNewCommentList(updatedCommentList);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  const goToProfilePage = () => {
    if (comment) {
      navigate(`/profile/${comment.nickname}`);
    }
  };
  return (
    <div key={comment.id}>
      <div className="cml">
        <div className="c1" onClick={goToProfilePage}>
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
          <div className="c2" onClick={goToProfilePage}>
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
        <div className="cmb">
          <IconButton
            aria-label="delete"
            onClick={() => {
              handleModalOpen();
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
      {open && (
        <EditDeleteModal
          open={open}
          comment={comment}
          onClose={handleModalClose}
        />
      )}
      {comment.subcommentCount! > 0 && (
        <div className="cmb ml">
          <button onClick={handleSubCommentList}>
            <div className="cmll"></div>
            <span>
              {isSubCommentVisible
                ? "답글 숨기기"
                : `답글 보기(${comment.subcommentCount}개)`}
            </span>
          </button>
          {isSubCommentVisible ? (
            <div>
              <SubCommentList
                postId={comment.postId}
                id={comment.id}
                newCommentList={newCommentList}
                subcommentCount={comment.subcommentCount!}
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
  );
};
