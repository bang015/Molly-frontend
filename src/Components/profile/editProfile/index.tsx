import React, { useState } from "react";
import { userType } from "../../../Interfaces/user";
import { Avatar, Modal, TextField } from "@mui/material";
import "./index.css";
import {
  checkNameValidation,
  checkNickValidation,
} from "../../../Utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../Redux/auth";
import { RootState } from "../../../Redux";
import { useNavigate } from "react-router-dom";
interface editProfileProps {
  open: boolean;
  onClose: () => void;
  profile: userType;
}
const EditProfile: React.FC<editProfileProps> = ({
  open,
  onClose,
  profile,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [newInfo, setNewInfo] = useState({
    name: profile.name,
    nickname: profile.nickname,
    introduce: profile.introduce,
  });
  const [error, setError] = useState({
    name: false,
    nickname: false,
  });
  const [isValid, setIsValid] = useState({
    name: true,
    nickname: true,
  });
  const [helperText, setHelperText] = useState({
    name: "",
    nickname: "",
  });
  const handleNickname = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInfo({ ...newInfo, nickname: e.target.value });
    const result = await checkNickValidation(e.target.value);
    if (result.helperText === "이미 사용 중인 이름입니다.") {
      setIsValid({ ...isValid, nickname: true });
      setHelperText({ ...helperText, nickname: "" });
      setError({ ...error, nickname: false });
    } else {
      setIsValid({ ...isValid, nickname: result.isValid });
      setHelperText({ ...helperText, nickname: result.helperText });
      setError({ ...error, nickname: !result.isValid });
    }
  };
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInfo({ ...newInfo, name: e.target.value });
    const result = checkNameValidation(e.target.value);
    setIsValid({ ...isValid, name: result.isValid });
    setHelperText({ ...helperText, name: result.helperText });
    setError({ ...error, name: !result.isValid });
  };
  const handleIntroduce = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInfo({ ...newInfo, introduce: e.target.value });
  };
  const editProfile = () => {
    if (isValid.nickname && isValid.name && token) {
      dispatch(updateUser({ token, newInfo }) as any).then(() => {
        const newProfile = `/profile/${newInfo.nickname}`;
        navigate(newProfile);
      });
      onClose();
    }
  };
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="post-detail">
          <div className="modal_content">
            <div className="title">프로필 수정</div>
            <div className="user">
              <div className="img">
                <label className="profileImg" htmlFor="profileImageInput">
                  <Avatar
                    src={profile.ProfileImage?.path}
                    sx={{ width: 150, height: 150 }}
                  />
                </label>
              </div>
              <div className="info">
                <div>
                  <span>사용자 이름</span>
                  <TextField
                    size="small"
                    fullWidth
                    error={error.nickname}
                    value={newInfo.nickname}
                    onChange={handleNickname}
                    helperText={helperText.nickname}
                  />
                </div>
                <div>
                  <span>성명</span>
                  <TextField
                    size="small"
                    fullWidth
                    error={error.name}
                    value={newInfo.name}
                    onChange={handleName}
                    helperText={helperText.name}
                  />
                </div>
              </div>
            </div>
            <div className="intro">
              <span>소개</span>
              <TextField
                multiline
                rows={3}
                fullWidth
                onChange={handleIntroduce}
                value={newInfo.introduce}
                InputProps={{
                  style: {
                    padding: 5,
                    transition: "none",
                  },
                }}
              />
            </div>
            <div className="btn">
              <button onClick={onClose}>취소</button>
              <button onClick={editProfile}>저장</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditProfile;
