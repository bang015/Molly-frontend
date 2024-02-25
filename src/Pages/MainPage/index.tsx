import React, { useState, useEffect, ChangeEvent } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../Redux/auth";
import Nav from "../../Components/Nav";
import { SuggestList } from "../../Components/follow/suggestList";
import { Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PostList from "../../Components/post/postList";
import { getMainPost, resetDeleteBar } from "../../Redux/postList";
import { RootState } from "../../Redux";
const Main: React.FC = () => {
  const dispatch = useDispatch();
  const limit = 5;
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const postList = useSelector((state: RootState) => state.postListReducer.mainPostList);
  const totalPages = useSelector((state: RootState) => state.postListReducer.totalPages);
  const showDeleteBar = useSelector((state: RootState) => state.postListReducer.showDeleteBar);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if(token){
      dispatch(getMainPost({page, token}) as any)
    };
  },[token, page]);
  const handlesignOut = () => {
    dispatch(signOut() as any);
  };
  window.addEventListener('scroll', function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if(page < totalPages){
        setPage(page + 1);
      }
    }
  });
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(resetDeleteBar());
  }
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="main-center">
        {postList.map((post) => (
          <PostList key={post.id} post={post}/>
        ))}
      </div>
      <Snackbar
        open={showDeleteBar}
        autoHideDuration={2000}
        onClose={handleClose}
        message="게시물이 삭제되었습니다."
      />
      <div className="follow-container">
        <div className="more">
          <div>회원님을 위한 추천</div>
          <div><Button onClick={()=>{navigate('/explore/people')}}>모두보기</Button></div>
        </div>
        <SuggestList limit={limit}/>
      </div>
    </div>
  );
};

export default Main;
