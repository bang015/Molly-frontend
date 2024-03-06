import React, { useEffect, useState } from "react";
import Nav from "../../Components/Nav/navBar";
import { useParams } from "react-router-dom";
import { ReactComponent as TagIcon } from "../../icons/tagIcon.svg";
import { useDispatch } from "react-redux";
import { getPostByTagName } from "../../Redux/postList";

const Tag: React.FC = () => {
  const { tagName } = useParams();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  console.log(tagName);
  useEffect(() => {
    if(tagName){
      dispatch(getPostByTagName({tagName, page}) as any);
    }
  })
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="pcontent">
        <div className="prfile">
          <div className="header">
            <div className="profile_image">
              <div className="profileImg">
                <TagIcon width={50} />
              </div>
            </div>
            <div className="pui">
              <div>#{tagName}</div>
              <div>게시물</div>
            </div>
          </div>
          <div>
            게시물
            <div className="user_post">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Tag;
