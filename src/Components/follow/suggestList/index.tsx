import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import React, { useEffect } from "react";
import { clearFollowList, getSuggestFollow } from "../../../Redux/follow";
import "./index.css";
import FollowListUser from "../followListUser";
interface SuggestListProps {
  limit: number;
}

export const SuggestList: React.FC<SuggestListProps> = ({ limit }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authReducer.token);
  useEffect(() => {
    dispatch(clearFollowList());
    if (token) {
      dispatch(getSuggestFollow({ token, limit }) as any);
    }
  }, [token, limit]);
  const suggestList = useSelector(
    (state: RootState) => state.followReducer.suggestList
  );

  return (
    <div className="list">
      {suggestList.map((user) => (
        <FollowListUser key={user.id} user={user} type="sug" />
      ))}
    </div>
  );
};
