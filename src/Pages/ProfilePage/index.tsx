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
  const chekcFollowed = useSelector(
    (state: RootState) => state.followReducer.chekcFollowed
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fileKey, setFileKey] = useState<number>(0);
  const [showImage, setShowImage] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showImgModal, setShowImgModal] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState<string>("");
  const [profileImg, setProfileImg] = useState<Blob | null>(null);
  const [value, setValue] = useState<number>(1);
  const { nickname } = useParams();
  useEffect(() => {
    if (nickname) {
      dispatch(getProfile(nickname) as any);
    }
  }, [nickname, chekcFollowed]);
  const onCropComplete = (croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCloseModal = () => {
    setShowImgModal(false);
    setShowImage("");
    setFileKey((prevKey) => prevKey + 1);
  };
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const handleCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(showImage, croppedAreaPixels!);
      setProfileImg(croppedImage);
      setCroppedImage(URL.createObjectURL(croppedImage!));
      setShowImgModal(false);
      setShowImage("");
      setFileKey((prevKey) => prevKey + 1);
    } catch (e) {
      console.log(e);
    }
  };
  const handleIntro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntroduction(e.target.value);
  };
  const handleSaveProfile = async () => {
    const newInfo = {
      introduce: introduction,
      profile_image: profileImg,
    };
    if (token) {
      const profile = await dispatch(updateUser({ token, newInfo }) as any);
      if (profile) {
        navigate("/");
      } else {
      }
    }
  };

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
                <div style={{ marginRight: 60 }}>
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
                <div>
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
              </div>
              <div className="mgt20">
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
    // <div className="signup">
    //   <div className="signup-container">
    //     <div className="signup-left">
    //       <img
    //         className="logo"
    //         src="/images/molly.jpg"
    //         width="100%"
    //         alt="molly Logo"
    //       />
    //     </div>
    //     <div className="signup-right1">
    //       <Paper className="paper">
    //         <h1 className="paper-title">프로필</h1>
    //         <form>
    //           <div className="profile">
    //             <label htmlFor="fileInput">
    //               <input
    //                 key={fileKey}
    //                 type="file"
    //                 id="fileInput"
    //                 onChange={handleProfileImg}
    //               />
    //               <div className="profileImg">
    //                 {croppedImage !== null ? (
    //                   <img
    //                     src={croppedImage}
    //                     alt={croppedImage}
    //                     style={{ borderRadius: "50%" }}
    //                   />
    //                 ) : (
    //                   <div></div>
    //                 )}
    //               </div>
    //             </label>
    //             <div>
    //               <div>{user?.nickname}</div>
    //               <div>{user?.name}</div>
    //             </div>
    //           </div>
    //           <div>
    //             <div>소개</div>
    //             <TextField
    //               className="introduction"
    //               placeholder="소개"
    //               rows={2}
    //               multiline
    //               onChange={handleIntro}
    //             />
    //           </div>
    //           {showImgModal && (
    //             <div className="modal" onClick={handleCloseModal}>
    //               <div className="imageCrop" onClick={handleModalClick}>
    //                 <div className="crop-container">
    //                   <Cropper
    //                     image={showImage}
    //                     crop={crop}
    //                     zoom={zoom}
    //                     aspect={1 / 1}
    //                     onCropChange={setCrop}
    //                     onCropComplete={onCropComplete}
    //                     onZoomChange={setZoom}
    //                     cropShape="round"
    //                   />
    //                 </div>
    //                 <div className="btn">
    //                   <Button onClick={handleCloseModal}>취소</Button>
    //                   <Button onClick={handleCroppedImage}>저장</Button>
    //                 </div>
    //               </div>
    //             </div>
    //           )}
    //           <div className="btn-box">
    //             <div className="btn">
    //               <Button onClick={()=>{navigate("/")}}>건너뛰기</Button>
    //               <Button onClick={handleSaveProfile}>저장</Button>
    //             </div>
    //           </div>
    //         </form>
    //       </Paper>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ProfilePage;
