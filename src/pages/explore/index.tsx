import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "@/redux/postList";
import { RootState } from "@/redux";
import Nav from "@/components/nav/navBar";
import "./index.css";
import { openModal } from "@/redux/modal";

const Explore: React.FC = () => {
  const dispatch = useDispatch();
  const allPostList = useSelector(
    (state: RootState) => state.postListReducer.allPostList
  );
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (token) {
      dispatch(getAllPost({ page, token }) as any);
    }
  }, [page]);

  window.addEventListener("scroll", function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage(page + 1);
    }
  });
  return (
    <div className="mainPage">
        <Nav></Nav>
      <div className="pcontent">
        <div className="image-grid">
          {allPostList.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                dispatch(
                  openModal({ modalType: "PostDetailModal", id: post.id })
                );
              }}
            >
              <img
                className="image_item"
                srcSet={`${post.PostMedia[0].path}?w=300&h=300&fit=crop&auto=format&dpr=2 2x`}
                src={`${post.PostMedia[0].path}?w=300&h=300&fit=crop&auto=format`}
                alt={post.content}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
