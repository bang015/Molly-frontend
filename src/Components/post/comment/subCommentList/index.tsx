import React, { useEffect, useState } from "react";
import { getSubComment } from "../../../../Redux/comment";
import { Avatar, IconButton } from "@mui/material";
import { commentType } from "../../../../Interfaces/comment";
import { displayCreateAt } from "../../../../Utils/moment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditDeleteModal from "../../../EditDeleteModal/comment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux";

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
  const updatedComment = useSelector(
    (state: RootState) => state.commentReducer.updatedComment
  );
  const deleteComment = useSelector(
    (state: RootState) => state.commentReducer.deletComment
  );
  const [page, setPage] = useState(1);
  const [subComment, setSubComment] = useState<commentType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
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

  useEffect(() => {
    if (deleteComment.length !== 0) {
      const CommentList = subComment.filter(
        (item) => !deleteComment.includes(item.id)
      );
      setSubComment(CommentList);
    }
  }, [deleteComment]);

  useEffect(() => {
    if (updatedComment) {
      const updatedCommentIndex = subComment.findIndex(
        (map) => map.id === updatedComment?.id
      );
      if (updatedCommentIndex !== -1) {
        const updatedCommentList = [...subComment];
        updatedCommentList[updatedCommentIndex] = updatedComment;
        setSubComment(updatedCommentList);
      }
    }
  }, [updatedComment]);

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
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
            <IconButton
              aria-label="delete"
              onClick={() => {
                handleModalOpen();
              }}
            >
              <MoreHorizIcon />
            </IconButton>
          </div>
          {open && (
            <EditDeleteModal
              open={open}
              comment={comment}
              onClose={handleModalClose}
            />
          )}
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
