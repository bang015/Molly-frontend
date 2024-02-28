import { Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./index.css"
import { useDispatch, useSelector } from "react-redux";
import { getFollowing } from "../../../Redux/follow";
import { RootState } from "../../../Redux";
interface followListProps {
  userId: number;
  followOpen: boolean;
  onFollowClose: () => void;
}
const FollowList: React.FC<followListProps> = ({userId, followOpen, onFollowClose}) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const follow = useSelector((state: RootState) => state.followReducer.followingUser);
  useEffect(() => {
    dispatch(getFollowing({userId, page}) as any)
  },[userId, page]);
  console.log(follow);
  return <div>
    <Modal
      open={followOpen}
      onClose={onFollowClose}
    >
      <div className="post-detail">
        <div className="follow_container">
          <div>
            <div>팔로잉</div>
            <div>
              검색
            </div>
            <div>
              리스트
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
};

export default FollowList;
