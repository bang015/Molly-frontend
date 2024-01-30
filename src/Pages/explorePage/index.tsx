import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "../../Redux/postList";
import { RootState } from "../../Redux";
import Nav from "../../Components/Nav";
import { ImageList, ImageListItem } from "@mui/material";
import "./index.css";

const Explore: React.FC = () => {
  const dispatch = useDispatch();
  const allPostList = useSelector((state: RootState) => state.postListReducer.allPostList);
  console.log(allPostList);
  const [page, setPage] = useState(1);
  useEffect(() => {
    dispatch(getAllPost(page) as any);
  }, [page]);
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="post-content">
        <div className="image-grid">
          {allPostList.map((post) => (
            <div key={post.id}>    
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
      </div>
    </div>
  );
};

export default Explore;
                  