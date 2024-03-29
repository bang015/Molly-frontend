import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearPostDetail, getAllPost } from "../../Redux/postList";
import { RootState } from "../../Redux";
import Nav from "../../Components/Nav/navBar";
import "./index.css";
import PostDetail from "../../Components/post/postDetail";
import { clearComment } from "../../Redux/comment";

const Explore: React.FC = () => {
  const dispatch = useDispatch();
  const allPostList = useSelector(
    (state: RootState) => state.postListReducer.allPostList
  );
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
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

  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };

  const closeModal = () => {
    setSelectedPostId(null);
    dispatch(clearComment());
    dispatch(clearPostDetail());
  };
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="pcontent">
        <div className="image-grid">
          {allPostList.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                handlePostModal(post.id);
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
        {selectedPostId && (
          <PostDetail postId={selectedPostId} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default Explore;
