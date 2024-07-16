import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import Nav from "@/components/nav/navBar";
import { getProfile } from "@/redux/user";
import AppsIcon from "@mui/icons-material/Apps";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import UserPostList from "@/components/profile/userPostList";
import Header from "@/components/profile/header";
import BookmarkList from "@/components/profile/bookmarkList";

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const { profile } = useSelector((state: RootState) => state.userReducer);
  const {checkFollowed} = useSelector(
    (state: RootState) => state.followReducer
  );
  const dispatch = useDispatch();
  const [selection, setSelection] = useState<string>("post");
  const { nickname } = useParams();
  useEffect(() => {
    if (nickname) {
      dispatch(getProfile(nickname) as any);
    }
  }, [nickname, checkFollowed]);
  return (
    <div className="mainPage">
      <Nav />
      <div className="pcontent">
        {profile ? (
          <div className="prfile">
            <Header profile={profile} />
            <div>
              <div className="menu">
                <div>
                  <button
                    className={selection === "post" ? "click" : ""}
                    onClick={() => {
                      setSelection("post");
                    }}
                  >
                    <AppsIcon />
                    게시물
                  </button>
                </div>
                {profile.id === user?.id && (
                  <div style={{ marginLeft: 60 }}>
                    <button
                      className={selection === "bookmark" ? "click" : ""}
                      onClick={() => {
                        setSelection("bookmark");
                      }}
                    >
                      <BookmarkBorderIcon />
                      저장됨
                    </button>
                  </div>
                )}
              </div>
              <div>
                {selection === "post" && (
                  <div>
                    <UserPostList userId={profile.id!} />
                  </div>
                )}
                {selection === "bookmark" && (
                  <div>
                    <BookmarkList userId={profile.id!} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>죄송합니다. 페이지를 사용할 수 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
