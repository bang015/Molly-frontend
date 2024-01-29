import React from "react";
import Nav from "../../Components/Nav";
import "./index.css";
import { SuggestList } from "../../Components/follow/suggestList";

const People: React.FC = () => {
  const limit = 30;
  return (
    <div className="mainPage">
      <div className="main-left">
        <Nav></Nav>
      </div>
      <div className="follow-center">
        <div className="segFollow">
        <div className="seg">추천</div>

          <SuggestList limit={limit}/>
        </div>
      </div>
    </div>
  );
};

export default People;
