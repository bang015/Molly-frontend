import { Avatar, Modal } from "@mui/material";
import React, { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import "./index.css";
import getCroppedImg from "../../../../Utils/image-crop";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux";
import { updateUser } from "../../../../Redux/auth";
import { updateProfile } from "../../../../Interfaces/user";
interface editImageProps {
  open: boolean;
  onClose: () => void;
  showImage: string;
}
const EditImage: React.FC<editImageProps> = ({ open, onClose, showImage }) => {
  const dispatch = useDispatch();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [profileImg, setProfileImg] = useState<Blob | null>(null);
  const token = useSelector((state:RootState) => state.authReducer.token);
  const onCropComplete = async (croppedAreaPixels: Area, croppedArea: Area) => {
    const profileImg = await getCroppedImg(showImage, croppedArea);
    setProfileImg(profileImg);
    
  };
  const SaveProfileImg = () => {
    if(token && profileImg){
      const newInfo = {profileImg} as updateProfile;
      dispatch(updateUser({token, newInfo}) as any);
    }
    onClose();
  };
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="post-detail">
          <div className="modal_content">
            <div className="cropTitle">이미지 수정</div>
            <div className="pimg">
              <div className="cropper">
                <Cropper
                  image={showImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1/ 1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="cropBtn">
              <button onClick={onClose}>취소</button>
              <button onClick={SaveProfileImg}>저장</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default EditImage;
