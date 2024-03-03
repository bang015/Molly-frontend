import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import Cropper from "react-easy-crop";
import { Avatar, Button, Tab, Tabs, TextField } from "@mui/material";
import { Point, Area } from "react-easy-crop/types";
import { RootState } from "../../Redux";
import getCroppedImg from "../../Utils/image-crop";
import { updateUser } from "../../Redux/auth";
import Nav from "../../Components/Nav";
import { getProfile } from "../../Redux/profile";
import AppsIcon from "@mui/icons-material/Apps";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import UserPostList from "../../Components/profile/userPostList";
import Header from "../../Components/profile/header";
import BookmarkList from "../../Components/profile/bookmarkList";

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const profile = useSelector(
    (state: RootState) => state.profileReducer.profile
  );
  const updateProfile = useSelector(
    (state: RootState) => state.profileReducer.updateProfile
  );
  const chekcFollowed = useSelector(
    (state: RootState) => state.followReducer.chekcFollowed
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState<number>(1);
  const { nickname } = useParams();
  useEffect(() => {
    if (nickname) {
      dispatch(getProfile(nickname) as any);
    }
  }, [nickname, chekcFollowed, updateProfile]);
  return (
    <div className="mainPage">
      <div className="nav-container">
        <Nav></Nav>
      </div>
      <div className="pcontent">
        {profile ? (
          <div className="prfile">
            <Header profile={profile} />
            <div>
              <div className="menu">
                <div>
                  <button
                    className={value === 1 ? "click" : ""}
                    onClick={() => {
                      setValue(1);
                    }}
                  >
                    <AppsIcon />
                    게시물
                  </button>
                </div>
                {profile.id === user?.id && (
                  <div style={{ marginLeft: 60 }}>
                    <button
                      className={value === 2 ? "click" : ""}
                      onClick={() => {
                        setValue(2);
                      }}
                    >
                      <BookmarkBorderIcon />
                      저장됨
                    </button>
                  </div>
                )}
              </div>
              <div>
                {value === 1 && (
                  <div>
                    <UserPostList userId={profile.id!} />
                  </div>
                )}
                {value === 2 && (
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
