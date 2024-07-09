import React from "react";
import Nav from "@/components/nav/navBar";
import "./index.css";
import { SuggestList } from "@/components/follow/suggestList";

const People: React.FC = () => {
  const limit = 30;
  return (
    <div className="mainPage">
      <Nav></Nav>
      <div className="follow-center">
        <div className="segFollow">
          <div className="seg">추천</div>
          <SuggestList limit={limit} />
        </div>
      </div>
    </div>
  );
};

export default People;
