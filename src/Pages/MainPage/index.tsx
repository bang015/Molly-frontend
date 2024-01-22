import React, { useState, useEffect, ChangeEvent } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../Redux/auth";
import Nav from "../../Components/Nav";
const Main: React.FC = () => {
  const dispatch = useDispatch();
  const handlesignOut = () => {
    dispatch(signOut() as any);
  };
  return (
    <div className="mainPage">
      <div className="main-left">
        <Nav></Nav>
      </div>
      <div className="main-center"></div>
      <div className="main-right">
        <button onClick={handlesignOut}>로그아웃</button>
      </div>
    </div>
  );
};

export default Main;
