import { RootState } from '@/redux'
import { signOut } from '@/redux/auth'
import { closeSubModal } from '@/redux/modal'
import { updateUser } from '@/redux/user'
import { checkPasswordValidation } from '@/utils/validation'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, Modal, TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ModifyPasswordModal: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isSubOpen } = useSelector((state: RootState) => state.modalReducer)
  const { user } = useSelector((state: RootState) => state.authReducer)
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [isValid, setIsValid] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [helperText, setHelperText] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const handleClickShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    })
  }
  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value)
    if (e.target.value !== '') {
      setIsValid({ ...isValid, currentPassword: true })
    } else {
      setIsValid({ ...isValid, currentPassword: false })
    }
  }
  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    const isPasswordValid = checkPasswordValidation(e.target.value)
    setHelperText({ ...helperText, newPassword: isPasswordValid.helperText })
    setIsValid({ ...isValid, newPassword: isPasswordValid.isValid })
  }
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (newPassword !== e.target.value) {
      setHelperText({ ...helperText, confirmPassword: '새 비밀번호가 일치하지 않습니다.' })
      setIsValid({ ...isValid, confirmPassword: false })
    } else {
      setHelperText({ ...helperText, confirmPassword: '' })
      setIsValid({ ...isValid, confirmPassword: true })
    }
  }
  const modifyPassword = async () => {
    if (isValid.confirmPassword && isValid.currentPassword && isValid.newPassword) {
      const result = await dispatch(
        updateUser({ newInfo: { currentPassword, newPassword } }) as any,
      )
      if (result.payload) {
        dispatch(signOut() as any)
      }
      dispatch(closeSubModal())
    }
  }
  return (
    <Modal
      open={isSubOpen}
      onClose={() => {
        dispatch(closeSubModal())
      }}
    >
      <div className="modal">
        <div className="pointer-events-auto flex w-[550px] flex-col rounded-xl bg-white p-5">
          <div>
            <div className="text-body16rg pt-2 text-gray-500">{user?.nickname}</div>
            <div className="py-2 text-body20sd">비밀번호 변경</div>
            <div className="text-body16rg">
              비밀번호는 최소 6자 이상이어야 하며 숫자, 영문, 특수 문자(!$@%)의 조합을 포함해야
              합니다.
            </div>
          </div>
          <div className="py-3">
            <div className="py-2">
              <TextField
                className="w-full"
                type={showPasswords.currentPassword ? 'text' : 'password'}
                label="현재 비밀번호"
                required
                onChange={handleCurrentPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          handleClickShowPassword('currentPassword')
                        }}
                        edge="end"
                      >
                        {showPasswords.currentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="py-2">
              <TextField
                className="w-full"
                type={showPasswords.newPassword ? 'text' : 'password'}
                label="새 비밀번호"
                required
                onChange={handleNewPassword}
                helperText={helperText.newPassword}
                error={helperText.newPassword != ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          handleClickShowPassword('newPassword')
                        }}
                        edge="end"
                      >
                        {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="py-2">
              <TextField
                className="w-full"
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                label="새 비밀번호 확인"
                required
                onChange={handleConfirmPassword}
                error={helperText.confirmPassword != ''}
                helperText={helperText.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          handleClickShowPassword('confirmPassword')
                        }}
                        edge="end"
                      >
                        {showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              dispatch(closeSubModal())
              navigate('/auth/email/request')
            }}
            className="flex text-body14sd text-main"
          >
            비밀번호를 잊으셨나요?
          </button>
          <div className="pt-4">
            <button
              disabled={
                !isValid.confirmPassword || !isValid.currentPassword || !isValid.newPassword
              }
              onClick={modifyPassword}
              className="btn w-full"
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModifyPasswordModal
