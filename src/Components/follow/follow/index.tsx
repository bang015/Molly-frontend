import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { clearFollowList, getFollowing } from "../../../Redux/follow";
import { RootState } from "../../../Redux";
import FollowListUser from "../followListUser";
import CloseIcon from "@mui/icons-material/Close";
import FollowList from "../followList";
import FollowerList from "../followerList";
interface followProps {
  userId: number;
  followOpen: boolean;
  followType: string;
  onFollowClose: () => void;
}
const Follow: React.FC<followProps> = ({
  userId,
  followOpen,
  followType,
  onFollowClose,
}) => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    dispatch(clearFollowList());
  };
  return (
    <div>
      <Modal open={followOpen} onClose={onFollowClose}>
        <div className="post-detail">
          <div className="t">
            <div className="follow_container">
              <div className="follow_content">
                <div className="follow_section1">
                  <div>{followType === "follow" ? "팔로잉" : "팔로워"}</div>
                  <button onClick={onFollowClose}>
                    <CloseIcon fontSize="medium" />
                  </button>
                </div>
                <div className="follow_section2">
                  <input
                    type="text"
                    placeholder="검색"
                    onChange={handleSearch}
                  />
                </div>
                <div className="followList">
                  {followType === "follow" && (
                    <FollowList userId={userId} keyword={keyword} />
                  )}
                  {followType === "follower" && (
                    <FollowerList userId={userId} keyword={keyword} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Follow;
