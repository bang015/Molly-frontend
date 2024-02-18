import React, { useState, useEffect, ChangeEvent } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../Redux/auth";
import Nav from "../../Components/Nav";
import { SuggestList } from "../../Components/follow/suggestList";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PostList from "../../Components/post/postList";
import { getMainPost } from "../../Redux/postList";
import { RootState } from "../../Redux";
const Main: React.FC = () => {
  const dispatch = useDispatch();
  const limit = 5;
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const postList = useSelector((state: RootState) => state.postListReducer.mainPostList);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const userId = user?.id;
    if(userId){
      dispatch(getMainPost({page, userId}) as any);
    };
  },[user]);
  const handlesignOut = () => {
    dispatch(signOut() as any);
  };
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
