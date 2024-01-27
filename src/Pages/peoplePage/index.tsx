import React from "react";
import Nav from "../../Components/Nav";
import "./index.css";
import { SuggestList } from "../../Components/follow/suggestList";

const People: React.FC = () => {
  
  return (
    <div className="mainPage">
      <div className="main-left">
        <Nav></Nav>
      </div>
      <div className="main-center">
        <div>추천</div>
        <div className="segFollow">
          <SuggestList/>
        </div>
      </div>
    </div>
  );
};

export default People;
