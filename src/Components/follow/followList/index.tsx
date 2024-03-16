import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { getFollowing } from "../../../Redux/follow";
import { RootState } from "../../../Redux";
import FollowListUser from "../followListUser";
interface followListProps {
  userId: number;
  keyword: string;
}
const FollowList: React.FC<followListProps> = ({ userId, keyword }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const follow = useSelector(
    (state: RootState) => state.followReducer.followingUser
  );
  useEffect(() => {
    dispatch(getFollowing({ userId, page, keyword }) as any);
  }, [userId, page, keyword]);

  return (
    <div className="follow">
      {follow.map((user) => (
        <FollowListUser key={user.id} user={user} type=""/>
      ))}
    </div>
  );
};

export default FollowList;
