import React, { useState } from "react";
import { resultType } from "../../../../Interfaces/search";
import { Avatar } from "@mui/material";
import { ReactComponent as TagIcon } from "../../../../icons/tagIcon.svg";
import "./index.css";
interface resultProps {
  result: resultType;
}
const Result: React.FC<resultProps> = ({ result }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const goToPage = () => {
    if(result.type === "user"){
      window.location.href = `/profile/${result.nickname}`;
    }else{
      window.location.href = `/post/${result.name}`;
    }
  }
  return (
    <div
      className={isHovered ? "search_result hov" : "search_result"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={goToPage}
    >
      <div className="se1">
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
      <div className="se2">
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
    </div>
  );
};

export default Result;
