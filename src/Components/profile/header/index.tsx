import React, { useEffect, useState } from "react";
import { userType } from "../../../Interfaces/user";
import { Avatar, CircularProgress } from "@mui/material";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import FollowList from "../../follow/followList";
import {
  clearFollowList,
  followUser,
  followedCheck,
} from "../../../Redux/follow";
import Follow from "../../follow/follow";
import EditImage from "../profileImage/editImage";
import EditProfile from "../editProfile";
interface headerProps {
  profile: userType;
}
const Header: React.FC<headerProps> = ({ profile }) => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const loading = useSelector(
    (state: RootState) => state.profileReducer.editLoading
  );
  const [showImage, setShowImage] = useState("");
  const [followOpen, setFollowOpen] = useState(false);
  const [followType, setFollowType] = useState("");
  const [checkFollowed, setCheckFollowed] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  console.log(loading);
  const dispatch = useDispatch();
  useEffect(() => {
    if (profile.id !== user?.id) {
      const check = async () => {
        if (token) {
          const result = await followedCheck(token, profile.id!);
          setCheckFollowed(result);
        }
      };
      check();
    }
  }, [profile]);
  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const currentImageUrl = URL.createObjectURL(file);
    setEditImage(true);
    setShowImage(currentImageUrl);
  };

  const onFollowOpen = (type: string) => {
    setFollowOpen(true);
    setFollowType(type);
  };
  const onFollowClose = () => {
    setFollowOpen(false);
    dispatch(clearFollowList());
    setFollowType("");
  };
  const onEditImgClose = () => {
    setEditImage(false);
  };
  const handleFollow = () => {
    if (token) {
      const followUserId = profile?.id!;
      dispatch(followUser({ token, followUserId }) as any);
    }
  };
  const EditProfileOpen = () => {
    setEditProfile(true);
  };
  const EditProfileClose = () => {
    setEditProfile(false);
  };
  return (
    <div className="header">
      <div className="profile_image">
        <label className="profileImg" htmlFor="profileImageInput">
          <input
            type="file"
            id="profileImageInput"
            onChange={handleProfileImg}
          />
          {editImage && (
            <EditImage
              open={editImage}
              onClose={onEditImgClose}
              showImage={showImage}
            />
          )}
          <div className="profileImg">
            {loading && (
              <div className="loading">
                <CircularProgress />
              </div>
            )}
            <Avatar
              src={profile?.ProfileImage?.path}
              sx={{ width: 150, height: 150 }}
            />
          </div>
        </label>
      </div>
      <div className="pui">
        <div className="mgb20 mgt20 nick">
          <div>{profile?.nickname}</div>
          <div>
            {profile.id === user?.id ? (
              <div>
                <button onClick={EditProfileOpen}>프로필 편집</button>
                {editProfile && (
                  <EditProfile
                    open={editProfile}
                    onClose={EditProfileClose}
                    profile={profile}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={handleFollow}
                className={checkFollowed ? "" : "followbtn"}
              >
                {checkFollowed ? "팔로잉" : "팔로우"}
              </button>
            )}
          </div>
        </div>
        <div className="mgb20 activity">
          <div>
            게시물 <span>{profile.postCount}</span>
          </div>
          <div onClick={() => onFollowOpen("follower")}>
            팔로워 <span>{profile.followerCount}</span>
          </div>
          <div onClick={() => onFollowOpen("follow")}>
            팔로우 <span>{profile.followCount}</span>
          </div>
        </div>
        {profile && followOpen && (
          <Follow
            userId={profile.id!}
            followType={followType}
            followOpen={followOpen}
            onFollowClose={onFollowClose}
          />
        )}
        <div className="fonts14 fontw6">{profile?.name}</div>
        <div className="fonts14">{profile?.introduce}</div>
      </div>
    </div>
  );
};

export default Header;
