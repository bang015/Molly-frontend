import React, { useState } from 'react'
import { UserType } from '@/interfaces/user'
import { Avatar, CircularProgress, Modal, TextField } from '@mui/material'
import './index.css'
import { checkNameValidation, checkNickValidation } from '@/utils/validation'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/redux/user'
import { RootState } from '@/redux'
import { useNavigate } from 'react-router-dom'
interface editProfileProps {
  open: boolean
  onClose: () => void
  profile: UserType
}
const EditProfile: React.FC<editProfileProps> = ({ open, onClose, profile }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector((state: RootState) => state.userReducer.editLoading)
  const [newInfo, setNewInfo] = useState({
    name: profile.name,
    nickname: profile.nickname,
    introduce: profile.introduce,
  })
  const [error, setError] = useState({
    name: false,
    nickname: false,
  })
  const [isValid, setIsValid] = useState({
    name: true,
    nickname: true,
  })
  const [helperText, setHelperText] = useState({
    name: '',
    nickname: '',
  })
  const handleNickname = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInfo({ ...newInfo, nickname: e.target.value })
    const result = await checkNickValidation(e.target.value)
    setIsValid({ ...isValid, nickname: result.isValid })
    setHelperText({ ...helperText, nickname: result.helperText })
    setError({ ...error, nickname: !result.isValid })
  }
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInfo({ ...newInfo, name: e.target.value })
    const result = checkNameValidation(e.target.value)
    setIsValid({ ...isValid, name: result.isValid })
    setHelperText({ ...helperText, name: result.helperText })
    setError({ ...error, name: !result.isValid })
  }
  const handleIntroduce = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInfo({ ...newInfo, introduce: e.target.value })
  }
  const editProfile = () => {
    if (isValid.nickname && isValid.name) {
      console.log(newInfo)
      dispatch(updateUser({ newInfo }) as any).then(() => {
        const newProfile = `/profile/${newInfo.nickname}`
        navigate(newProfile)
      })
      onClose()
    }
  }
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="post-detail">
          <div className="modal_content">
            <div className="title">프로필 수정</div>
            <div className="user">
              <div className="img">
                <label className="profileImg" htmlFor="profileImageInput">
                  {loading && (
                    <div className="loading">
                      <CircularProgress />
                    </div>
                  )}
                  <Avatar src={profile.profileImage?.path} sx={{ width: 150, height: 150 }} />
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
                    transition: 'none',
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
  )
}

export default EditProfile
