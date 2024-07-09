import React, { useState, useEffect } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import Nav from "@/components/nav/navBar";
import { SuggestList } from "@/components/follow/suggestList";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PostList from "@/components/post/postList";
import { getMainPost } from "@/redux/postList";
import { RootState } from "@/redux";
const Main: React.FC = () => {
  const dispatch = useDispatch();
  const limit = 5;
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const postList = useSelector(
    (state: RootState) => state.postListReducer.mainPostList
  );
  const totalPages = useSelector(
    (state: RootState) => state.postListReducer.totalPages
  );

  const [page, setPage] = useState(1);
  useEffect(() => {
    if (token) {
      dispatch(getMainPost({ page, token }) as any);
    }
  }, [token, page]);
  window.addEventListener("scroll", function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (page < totalPages) {
        setPage(page + 1);
      }
    }
  });
  return (
    <div className="mainPage">
      <Nav></Nav>
      <div className="main-center">
        {postList.map((post) => (
          <PostList key={post.id} post={post} />
        ))}
      </div>

      <div className="follow-container">
        <div className="content">
          <div className="more">
            <div>회원님을 위한 추천</div>
            <div>
              <Button
                onClick={() => {
                  navigate("/explore/people");
                }}
              >
                모두보기
              </Button>
            </div>
          </div>
          <SuggestList limit={limit} />
        </div>
      </div>
    </div>
  );
};

export default Main;
