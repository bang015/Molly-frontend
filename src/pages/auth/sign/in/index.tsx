import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { signIn } from '@/redux/auth'
import { useDispatch } from 'react-redux'
import Logo from '@/icons/molly-logo.svg?react'
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
const SignInPage: React.FC = () => {
  const dispatch = useDispatch()
  const [userData, setUserData] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  })
  const [helperText, setHelperText] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, email: e.target.value })
  }
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, password: e.target.value })
  }
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') handleSignIn()
  }
  const handleSignIn = async () => {
    const regExp = /^[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    if (!regExp.test(userData.email)) {
      return setHelperText('유효한 이메일 주소를 입력해주세요.')
    }
    const result = await dispatch(signIn(userData) as any)
    setHelperText(result.payload)
  }
  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  return (
    <section className="flex size-full items-center justify-center bg-background p-4">
      <div className="w-[480px] p-8 relative flex rounded-xl bg-white items-center flex-col shadow-modal">
        <Logo width={'200px'} />
        <h1 className="pt-5">로그인</h1>
        {helperText != '' && (
          <div className="w-full mt-3 flex h-10 items-center justify-center rounded bg-red-50 px-4 text-body14rg text-red-500">
            {helperText}
          </div>
        )}
        <div className="mt-7 w-full">
          <TextField
            className="size-full"
            type="email"
            label="이메일"
            required
            onChange={handleEmail}
            onKeyDown={handleEnter}
          />
        </div>
        <div className="mt-7 mb-2 w-full">
          <TextField
            className="size-full"
            type={showPassword ? 'text' : 'password'}
            label="비밀번호"
            required
            onChange={handlePassword}
            onKeyDown={handleEnter}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="w-full flex justify-end">
          <button className="link">
            <Link className="text-body12rg text-[#5253ea]" to="/password">
              비밀번호를 잊으셨나요?
            </Link>
          </button>
        </div>

        <button
          disabled={userData.email === '' || userData.password === ''}
          className="btn w-full px-1 mt-10"
          onClick={handleSignIn}
        >
          로그인
        </button>
        <button className="link mt-4">
          <Link className="text-body14rg text-slate-400" to="/sign/up">
            새로운 계정 만들기
          </Link>
        </button>
      </div>
    </section>
  )
}

export default SignInPage
