import { IconButton, InputAdornment, TextField } from '@mui/material'
import Logo from '@/icons/molly-logo.svg?react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { checkPasswordValidation } from '@/utils/validation'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { resetPassword } from '@/redux/auth'

const PasswordReset: React.FC = () => {
  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search)
  const code = query.get('code')
  const email = query.get('email')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  })
  const [helperText, setHelperText] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [isValid, setIsValid] = useState({
    newPassword: false,
    confirmPassword: false,
  })
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    const isPasswordValid = checkPasswordValidation(e.target.value)
    setHelperText({ ...helperText, newPassword: isPasswordValid.helperText })
    setIsValid({ ...isValid, newPassword: isPasswordValid.isValid })
  }
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (newPassword !== e.target.value) {
      setIsValid({ ...isValid, confirmPassword: false })
      setHelperText({ ...helperText, confirmPassword: '새 비밀번호가 일치하지 않습니다.' })
    } else {
      setIsValid({ ...isValid, confirmPassword: true })
      setHelperText({ ...helperText, confirmPassword: '' })
    }
  }
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      reset()
    }
  }
  const handleClickShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    })
  }
  const reset = () => {
    if (email && code && isValid.newPassword && isValid.confirmPassword) {
      resetPassword({ email, code, newPassword })
      navigate('/sign/in')
    }
  }
  return (
    <section className="flex size-full items-center justify-center bg-background p-4">
      <div className="relative flex w-[480px] flex-col items-center rounded-xl bg-white p-8 shadow-modal">
        <Logo width={'200px'} />
        <h1 className="pt-5">보안 수준이 높은 비밀번호 만들기</h1>
        <div className="text-center text-body14rg text-slate-400">
          비밀번호는 6자 이상이어야 하고 숫자, 영문, 특수기호(!$@%)의 조합을 포함해야 합니다
        </div>
        <div className="mt-7 w-full">
          <TextField
            className="size-full"
            type={showPasswords.newPassword ? 'text' : 'password'}
            label="새 비밀번호"
            required
            helperText={helperText.newPassword}
            error={helperText.newPassword != ''}
            onChange={handlePassword}
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
        <div className="mb-2 mt-7 w-full">
          <TextField
            className="size-full"
            type={showPasswords.confirmPassword ? 'text' : 'password'}
            label="새 비밀번호 확인"
            required
            helperText={helperText.confirmPassword}
            error={helperText.confirmPassword != ''}
            onChange={handleConfirmPassword}
            onKeyDown={handleEnter}
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
        <button
          disabled={!isValid.newPassword || !isValid.confirmPassword}
          className="btn mt-5 w-full px-1"
          onClick={reset}
        >
          비밀번호 재설정
        </button>
        <button className="link mt-4">
          <Link className="text-body14rg text-slate-400" to="/sign/in">
            이미 계정이 있으신가요?
          </Link>
        </button>
      </div>
    </section>
  )
}

export default PasswordReset
