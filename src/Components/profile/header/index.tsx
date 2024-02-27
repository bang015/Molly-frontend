import React, { useState } from "react";
import { userType } from "../../../Interfaces/user";
import { Avatar } from "@mui/material";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux";
interface headerProps {
  profile: userType;
}
const Header: React.FC<headerProps> = ({ profile }) => {
  const [fileKey, setFileKey] = useState<number>(0);
  const [showImgModal, setShowImgModal] = useState(false);
  const [showImage, setShowImage] = useState("");

  const handleProfileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const currentImageUrl = URL.createObjectURL(file);
    setShowImage(currentImageUrl);
    setShowImgModal(true);
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
          <div>게시물 <span>{profile.postCount}</span></div>
          <div>팔로워 <span>{profile.followerCount}</span></div>
          <div>팔로우 <span>{profile.followCount}</span></div>
        </div>
        <div className="fonts14 fontw6">{profile?.name}</div>
        <div className="fonts14">{profile?.introduce}</div>
      </div>
    </div>
  );
};

export default Header;
