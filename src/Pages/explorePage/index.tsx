import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "../../Redux/postList";
import { RootState } from "../../Redux";
import Nav from "../../Components/Nav";
import "./index.css";
import PostDetail from "../../Components/post/postDetail";

const Explore: React.FC = () => {
  const dispatch = useDispatch();
  const allPostList = useSelector((state: RootState) => state.postListReducer.allPostList);
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number|null>(null);
  useEffect(() => {
    dispatch(getAllPost(page) as any);
  }, [page]);
  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };

  const closeModal = () => {
    setSelectedPostId(null);
  };
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="post-content">
        <div className="image-grid">
          {allPostList.map((post) => (
            <div key={post.id} onClick={() => {handlePostModal(post.id)}}>    
              <img
                className="image-item"
                srcSet={`${post.mediaList[0].mediaPath}?w=300&h=300&fit=crop&auto=format&dpr=2 2x`}
                src={`${post.mediaList[0].mediaPath}?w=300&h=300&fit=crop&auto=format`}
                alt={post.content}
                loading="lazy"
              />        
            </div>
          ))}
        </div>
        {selectedPostId && (
          <PostDetail postId={selectedPostId} onClose={closeModal}/>
        )}
      </div>
    </div>
  );
};

export default Explore;