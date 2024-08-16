import React, { useState } from 'react'
import { UserType } from '@/interfaces/user'
import { Avatar, CircularProgress, Modal, TextField } from '@mui/material'
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
        <div className="modal">
          <div className="pointer-events-auto flex flex-col rounded-lg bg-white">
            <div className="flex justify-center border-b p-3 text-body16sd">프로필 수정</div>
            <div className="flex items-center p-5">
              <div className="mr-5">
                <label className="profileImg" htmlFor="profileImageInput">
                  <div className="relative mx-auto size-[150px] overflow-hidden rounded-full border">
                    {loading && (
                      <div className="absolute z-10 flex size-full items-center justify-center bg-black bg-opacity-50">
                        <CircularProgress />
                      </div>
                    )}
                    <Avatar src={profile.profileImage?.path} sx={{ width: 150, height: 150 }} />
                  </div>
                </label>
              </div>
              <div className="w-[250px]">
                <div>
                  <div className="py-1 text-body14m">사용자 이름</div>
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
                  <div className="py-1 text-body14m">성명</div>
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
            <div className="p-5">
              <div className="py-1 text-body14m">소개</div>
              <TextField
                multiline
                rows={5}
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
            <div className="flex justify-end px-5 pb-2.5">
              <button className="p-1 text-body14sd hover:text-main" onClick={onClose}>
                취소
              </button>
              <button className="p-1 text-body14sd hover:text-main" onClick={editProfile}>
                저장
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditProfile
