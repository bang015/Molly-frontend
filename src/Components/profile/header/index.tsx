import React, { useState } from "react";
import { userType } from "../../../Interfaces/user";
import { Avatar } from "@mui/material";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import FollowList from "../../follow/followList";
import { clearFollowList } from "../../../Redux/follow";
interface headerProps {
  profile: userType;
}
const Header: React.FC<headerProps> = ({ profile }) => {
  const [fileKey, setFileKey] = useState<number>(0);
  const [showImgModal, setShowImgModal] = useState(false);
  const [showImage, setShowImage] = useState("");
  const [followOpen, setFollowOpen] = useState(false);
  const [followerOpen, setFollowerOpen] = useState(false);
  const dispatch = useDispatch();
  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const currentImageUrl = URL.createObjectURL(file);
    setShowImage(currentImageUrl);
    setShowImgModal(true);
  };

  const onFollowOpen = () => {
    setFollowOpen(true);
  };
  const onFollowClose = () => {
    setFollowOpen(false);
    dispatch(clearFollowList());
  };
  const onFollowerOpen = () => {
    setFollowerOpen(true);
  };
  const onFollowerClose = () => {
    setFollowerOpen(false);
  };
  return (
    <div className="header">
      <div className="profile_image">
        <label className="profileImg" htmlFor="fileInput">
          <input
            key={fileKey}
            type="file"
            id="fileInput"
            onChange={handleProfileImg}
          />
          <div className="profileImg">
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
            <button>프로필 편집</button>
          </div>
        </div>
        <div className="mgb20 activity">
          <div>
            게시물 <span>{profile.postCount}</span>
          </div>
          <div onClick={onFollowerOpen}>
            팔로워 <span>{profile.followerCount}</span>
          </div>
          <div onClick={onFollowOpen}>
            팔로우 <span>{profile.followCount}</span>
          </div>
        </div>
        {profile && followOpen && (
          <FollowList
            userId={profile.id!}
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
