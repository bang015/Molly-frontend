import React, { useState, useEffect, ChangeEvent } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../Redux/auth";
import Nav from "../../Components/Nav";
import { SuggestList } from "../../Components/follow/suggestList";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Main: React.FC = () => {
  const dispatch = useDispatch();
  const limit = 5;
  const navigate = useNavigate();
  const handlesignOut = () => {
    dispatch(signOut() as any);
  };
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="main-center">
      
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
