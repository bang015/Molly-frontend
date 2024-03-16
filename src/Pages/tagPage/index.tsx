import React, { useEffect, useState } from "react";
import Nav from "../../Components/Nav/navBar";
import { useParams } from "react-router-dom";
import { ReactComponent as TagIcon } from "../../icons/tagIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { clearPostList, getPostByTagName } from "../../Redux/postList";
import { RootState } from "../../Redux";
import PostDetail from "../../Components/post/postDetail";
import { clearComment } from "../../Redux/comment";

const Tag: React.FC = () => {
  const { tagName } = useParams();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const post = useSelector(
    (state: RootState) => state.postListReducer.userPostList
  );
  useEffect(() => {
    if (tagName) {
      dispatch(getPostByTagName({ tagName, page }) as any);
    }
  }, [tagName, page]);
  useEffect(() => {
    dispatch(clearPostList());
  }, [tagName])
  const handlePostModal = (id: number) => {
    setSelectedPostId(id);
  };
  const closeModal = () => {
    setSelectedPostId(null);
    dispatch(clearComment());
  };
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="pcontent">
        <div className="prfile">
          <div className="header">
            <div style={{flexGrow:0}} className="profile_image">
              <div className="profileImg">
                <TagIcon width={50} />
              </div>
            </div>
            <div className="pui">
              <h2 className="tagN">#{tagName}</h2>
              <div>게시물</div>
            </div>
          </div>
          <div>
            <h4 style={{color:"rgb(115,115,115)"}}>게시물</h4>
            <div className="user_post">
              {post.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    handlePostModal(post.id);
                  }}
                >
                  <img
                    className="image_item"
                    src={post.PostMedia[0].path}
                  />
                </div>
              ))}
              {selectedPostId && (
                <PostDetail postId={selectedPostId} onClose={closeModal} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Tag;
