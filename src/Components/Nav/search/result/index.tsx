import React, { useEffect, useState } from "react";
import { resultType } from "../../../../Interfaces/search";
import { Avatar } from "@mui/material";
import { ReactComponent as TagIcon } from "../../../../icons/tagIcon.svg";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSearchHistory,
  saveSearchHistory,
} from "../../../../Redux/search";
import { RootState } from "../../../../Redux";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
interface resultProps {
  result: resultType;
  onClose: () => void;
  type: string;
}
const Result: React.FC<resultProps> = ({ result, onClose, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const token = useSelector((state: RootState) => state.authReducer.token);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const goToPage = () => {
    if (result.type === "user") {
      navigate(`/profile/${result.nickname}`);
    } else {
      navigate(`/explore/tags/${result.name}`);
    }
    if (token) dispatch(saveSearchHistory({ token, result }) as any);
    onClose();
  };
  const deleteHistory = () => {
    const history = JSON.stringify(result);

    if (token) dispatch(deleteSearchHistory({ token, history }) as any);
  };
  return (
    <div
      className={isHovered ? "search_result hov" : "search_result"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="se1" onClick={goToPage}>
        {result.type === "user" ? (
          <div>
            <Avatar
              src={result?.ProfileImage?.path}
              sx={{ width: 44, height: 44 }}
            />
          </div>
        ) : (
          <div>
            <TagIcon width={20} />
          </div>
        )}
      </div>
      <div className="se2" onClick={goToPage}>
        <div>
          {result.type === "user" ? (
            <div>{result.nickname}</div>
          ) : (
            <div># {result.name}</div>
          )}
        </div>
        <div className="ch">
          {result.type === "user" ? (
            <div>{result.name}</div>
          ) : (
            <div>게시물 {result.tagCount}</div>
          )}
        </div>
      </div>
      {type === "history" && (
        <div className="se3">
          <button onClick={deleteHistory}>
            <CloseIcon sx={{ fontSize: 23 }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Result;
