import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollower } from "@/redux/follow";
import { RootState } from "@/redux";
import FollowListUser from "../followListUser";
interface followerListProps {
  userId: number;
  keyword: string;
}
const FollowerList: React.FC<followerListProps> = ({ userId, keyword }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const follow = useSelector(
    (state: RootState) => state.followReducer.followerUser
  );
  useEffect(() => {
    dispatch(getFollower({ userId, page, keyword }) as any);
  }, [userId, page, keyword]);
  return (
    <div className="follow">
      {follow.map((user) => (
        <FollowListUser key={user.id} user={user} type="" />
      ))}
    </div>
  );
};

export default FollowerList;
